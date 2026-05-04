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
  bankId: string;
  filename: string;
  transactions: ParsedStatementTransaction[];
}) {
  const selectedTransactions = params.transactions.filter((transaction) => transaction.selected);
  if (selectedTransactions.length === 0) throw new Error('No transactions selected.');

  const rows = selectedTransactions.map((transaction) => ({
    user_id: params.userId,
    account_id: params.accountId,
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
      .eq('id', params.accountId)
      .eq('user_id', params.userId)
      .single();

    if (accountError) throw accountError;
    const { error: balanceError } = await supabase
      .from('accounts')
      .update({ balance: Number(account.balance) + balanceChange })
      .eq('id', params.accountId)
      .eq('user_id', params.userId);
    if (balanceError) throw balanceError;
  }

  const orderedDates = selectedTransactions.map((transaction) => transaction.date).sort();
  const { error: uploadError } = await supabase.from('statement_uploads').insert({
    user_id: params.userId,
    account_id: params.accountId,
    filename: params.filename,
    bank_id: params.bankId,
    file_format: params.filename.split('.').pop()?.toLowerCase() || 'pdf',
    period_start: orderedDates[0] || null,
    period_end: orderedDates[orderedDates.length - 1] || null,
    transactions_found: params.transactions.length,
    transactions_imported: selectedTransactions.length,
    status: 'complete',
  });
  if (uploadError) throw uploadError;

  return selectedTransactions.length;
}