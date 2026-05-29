import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { supabase } from '@/integrations/supabase/client';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ParsedStatementTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  rawDescription: string;
  suggestedCategory?: string;
  suggestedSubcategory?: string;
  confidence?: number;
  selected: boolean;
  editedCategory?: string;
}

export interface StatementParseResult {
  transactions: ParsedStatementTransaction[];
  summary: { total: number; income: number; expenses: number } | null;
}

export const STATEMENT_CATEGORIES = ['Food & Drink', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Travel', 'Education', 'Savings', 'Investment', 'Income', 'Personal'];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function resolveImportAccount(params: { userId: string; accountId: string; accountName: string; institution?: string | null }) {
  if (UUID_PATTERN.test(params.accountId)) return params.accountId;

  const { data: existing, error: findError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', params.userId)
    .eq('name', params.accountName)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  if (findError) throw findError;
  if (existing?.id) return existing.id;

  const { data: created, error: createError } = await supabase
    .from('accounts')
    .insert({
      user_id: params.userId,
      name: params.accountName,
      institution: params.institution || 'Manual',
      type: 'current',
      balance: 0,
      currency: 'GBP',
      colour: '#7F77DD',
      is_active: true,
    })
    .select('id')
    .single();
  if (createError) throw createError;
  return created.id;
}

async function extractPdfText(file: File) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pageCount = Math.min(pdf.numPages, 50);
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = (content.items as Array<{ str?: string }>)
      .map((item) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (text) pages.push(`Page ${pageNumber}\n${text}`);
  }

  const fullText = pages.join('\n\n').trim();
  if (fullText.replace(/\s/g, '').length < 50) {
    throw new Error('This PDF could not be read. Please try a text-based PDF or a CSV export.');
  }

  return fullText;
}

function parseJsonResponse(text: string) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export function getStatementUploadError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const lower = message.toLowerCase();

  if (lower.includes('failed to fetch') || lower.includes('cors') || lower.includes('network')) {
    return 'Could not reach the statement analyser. Please check your connection and try again.';
  }
  if (lower.includes('refresh token') || lower.includes('jwt') || lower.includes('session') || lower.includes('auth')) {
    return 'Your sign-in session expired. Please sign in again, then retry the import.';
  }
  if (lower.includes('row-level security') || lower.includes('permission denied')) {
    return 'We could not save this statement to your account. Please refresh, sign in, and try again.';
  }
  if (lower.includes('invalid input syntax') && lower.includes('uuid')) {
    return 'We could not match this statement to the selected account. Please refresh the Accounts page and try again.';
  }

  return message || 'Statement upload failed. Please try again.';
}

export async function uploadBankStatementFile(file: File, bankId: string): Promise<StatementParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !['pdf', 'csv'].includes(extension)) {
    throw new Error('Please upload a PDF or CSV bank statement.');
  }

  const body = extension === 'pdf'
    ? { fileType: 'pdf', statementText: await extractPdfText(file), bankId, filename: file.name }
    : { fileType: 'csv', csvText: await file.text(), bankId, filename: file.name };

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const response = await fetch(`${baseUrl}/functions/v1/parse-statement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: publishableKey,
    },
    body: JSON.stringify(body),
  });

  const responseText = await response.text();
  const data = parseJsonResponse(responseText);
  if (!response.ok || data?.error) {
    throw new Error(data?.error || `Statement analyser returned ${response.status}`);
  }


  return {
    transactions: (data?.transactions || []).map((transaction: Omit<ParsedStatementTransaction, 'selected'>) => ({
      ...transaction,
      selected: true,
    })),
    summary: data?.summary || null,
  };
}


export async function importParsedStatementTransactions(params: {
  userId: string;
  accountId: string;
  accountName: string;
  institution?: string | null;
  bankId: string;
  filename: string;
  transactions: ParsedStatementTransaction[];
}): Promise<{ imported: number; skipped: number }> {

  const selectedTransactions = params.transactions.filter((transaction) => transaction.selected);
  if (selectedTransactions.length === 0) throw new Error('No transactions selected.');
  const accountId = await resolveImportAccount(params);

  // Duplicate detection — pull existing transactions in the date range for this account
  const dates = selectedTransactions.map(t => t.date).sort();
  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];
  const { data: existing } = await supabase
    .from('transactions')
    .select('date, amount, payee, description')
    .eq('user_id', params.userId)
    .eq('account_id', accountId)
    .gte('date', minDate)
    .lte('date', maxDate);

  const normalise = (s?: string | null) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 40);
  const existingKeys = new Set(
    (existing || []).map(e => `${e.date}|${Number(e.amount).toFixed(2)}|${normalise(e.payee || e.description)}`)
  );

  const fresh: ParsedStatementTransaction[] = [];
  let skipped = 0;
  for (const t of selectedTransactions) {
    const key = `${t.date}|${Number(t.amount).toFixed(2)}|${normalise(t.description)}`;
    if (existingKeys.has(key)) { skipped += 1; continue; }
    existingKeys.add(key);
    fresh.push(t);
  }

  if (fresh.length === 0) {
    return { imported: 0, skipped } as any;
  }

  const rows = fresh.map((transaction) => ({
    user_id: params.userId,
    account_id: accountId,
    date: transaction.date,
    payee: transaction.description,
    description: transaction.rawDescription,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.editedCategory || transaction.suggestedCategory || (transaction.type === 'income' ? 'Income' : 'Shopping'),
    subcategory: transaction.suggestedSubcategory || null,
    ai_category_confidence: transaction.confidence || null,
    ai_category_reason: transaction.suggestedCategory ? 'AI categorised from statement' : null,
  }));

  for (let index = 0; index < rows.length; index += 50) {
    const batch = rows.slice(index, index + 50);
    const { error } = await supabase.from('transactions').insert(batch);
    if (error) throw error;
  }

  const balanceChange = rows.reduce((sum, row) => sum + Number(row.amount), 0);
  if (balanceChange !== 0) {
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', accountId)
      .eq('user_id', params.userId)
      .single();

    if (accountError) throw accountError;
    const { error: balanceError } = await supabase
      .from('accounts')
      .update({ balance: Number(account.balance) + balanceChange })
      .eq('id', accountId)
      .eq('user_id', params.userId);
    if (balanceError) throw balanceError;
  }

  const orderedDates = fresh.map((transaction) => transaction.date).sort();
  const { error: uploadError } = await supabase.from('statement_uploads').insert({
    user_id: params.userId,
    account_id: accountId,
    filename: params.filename,
    bank_id: params.bankId,
    file_format: params.filename.split('.').pop()?.toLowerCase() || 'pdf',
    period_start: orderedDates[0] || null,
    period_end: orderedDates[orderedDates.length - 1] || null,
    transactions_found: params.transactions.length,
    transactions_imported: fresh.length,
    status: 'complete',
  });
  if (uploadError) throw uploadError;

  return { imported: fresh.length, skipped } as any;
}
