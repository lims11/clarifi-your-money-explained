import type { Tables } from '@/integrations/supabase/types';
import { categoryColours, formatCurrency } from '@/lib/finance';

type Transaction = Tables<'transactions'>;
type Account = Tables<'accounts'>;
type Goal = Tables<'goals'>;
type PulseAlert = Tables<'pulse_alerts'>;

interface BuildTransactionsReportOptions {
  transactions: Transaction[];
  accounts?: Account[] | null;
  goals?: Goal[] | null;
  pulseAlerts?: PulseAlert[] | null;
  periodStart?: string;
  periodEnd?: string;
  maxTransactions?: number;
}

export interface TransactionsReportData {
  periodStart?: string;
  periodEnd?: string;
  netWorth: number;
  totalIncome: number;
  totalExpenses: number;
  netSaved: number;
  categories: Array<{
    name: string;
    amount: number;
    pct: number;
    colour: string;
  }>;
  transactions: Array<{
    date: string;
    payee: string;
    category: string;
    subcategory: string | null;
    accountName: string;
    amount: number;
    type: string;
    description: string | null;
    aiConfidence: number | null;
    aiReason: string | null;
  }>;
  goals: Array<{
    name: string;
    icon: string;
    current: number;
    target: number;
    targetDate: string | null;
    progressPct: number;
  }>;
  pulseAlerts: Array<{
    title: string;
    body: string;
    type: string;
  }>;
}

const NEWLINE = '\r\n';

function escapeCsv(value: string | number | null | undefined) {
  if (value == null) return '';

  const stringValue = String(value);
  if (!/[",\n\r]/.test(stringValue)) return stringValue;

  return `"${stringValue.replace(/"/g, '""')}"`;
}

function createCsvRow(values: Array<string | number | null | undefined>) {
  return values.map(escapeCsv).join(',');
}

function formatDisplayDate(date?: string | null) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function buildTransactionsReportData({
  transactions,
  accounts,
  goals,
  pulseAlerts,
  periodStart,
  periodEnd,
  maxTransactions,
}: BuildTransactionsReportOptions): TransactionsReportData {
  const totalIncome = transactions
    .filter((transaction) => Number(transaction.amount) > 0)
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalExpenses = Math.abs(
    transactions
      .filter((transaction) => Number(transaction.amount) < 0)
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0),
  );

  const netWorth = (accounts || []).reduce((sum, account) => sum + Number(account.balance || 0), 0);

  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((transaction) => Number(transaction.amount) < 0)
    .forEach((transaction) => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + Math.abs(Number(transaction.amount));
    });

  const maxCategorySpend = Math.max(...Object.values(categoryTotals), 1);
  const categories = Object.entries(categoryTotals)
    .sort((first, second) => second[1] - first[1])
    .map(([name, amount]) => ({
      name,
      amount,
      pct: Math.round((amount / maxCategorySpend) * 100),
      colour: categoryColours[name] || '#7F77DD',
    }));

  const accountMap = (accounts || []).reduce((map, account) => {
    map[account.id] = account.name;
    return map;
  }, {} as Record<string, string>);

  const limitedTransactions = transactions.slice(0, maxTransactions ?? transactions.length);

  return {
    periodStart,
    periodEnd,
    netWorth,
    totalIncome,
    totalExpenses,
    netSaved: totalIncome - totalExpenses,
    categories,
    transactions: limitedTransactions.map((transaction) => ({
      date: transaction.date,
      payee: transaction.payee || transaction.description || transaction.category,
      category: transaction.category,
      subcategory: transaction.subcategory || null,
      accountName: accountMap[transaction.account_id] || '-',
      amount: Number(transaction.amount),
      type: transaction.type,
      description: transaction.description || null,
      aiConfidence: transaction.ai_category_confidence != null ? Number(transaction.ai_category_confidence) : null,
      aiReason: transaction.ai_category_reason || null,
    })),
    goals: (goals || []).map((goal) => {
      const current = Number(goal.current_amount || 0);
      const target = Number(goal.target_amount || 0);
      return {
        name: goal.name,
        icon: goal.icon || '🎯',
        current,
        target,
        targetDate: goal.target_date,
        progressPct: target > 0 ? Math.round((current / target) * 100) : 0,
      };
    }),
    pulseAlerts: (pulseAlerts || []).slice(0, 5).map((alert) => ({
      title: alert.title,
      body: alert.body,
      type: alert.type,
    })),
  };
}

export function createTransactionsCsvReport(reportData: TransactionsReportData) {
  const generatedAt = new Date();
  const sections: string[] = [];

  sections.push(
    [
      createCsvRow(['Sonfi Transactions Report']),
      createCsvRow(['Generated at', generatedAt.toLocaleString('en-GB')]),
      createCsvRow(['Period start', formatDisplayDate(reportData.periodStart)]),
      createCsvRow(['Period end', formatDisplayDate(reportData.periodEnd)]),
      createCsvRow(['Transactions', reportData.transactions.length]),
      createCsvRow(['Total income', reportData.totalIncome, formatCurrency(reportData.totalIncome)]),
      createCsvRow(['Total expenses', reportData.totalExpenses, formatCurrency(reportData.totalExpenses)]),
      createCsvRow(['Net saved', reportData.netSaved, formatCurrency(reportData.netSaved)]),
      createCsvRow(['Net worth', reportData.netWorth, formatCurrency(reportData.netWorth)]),
    ].join(NEWLINE),
  );

  if (reportData.categories.length > 0) {
    sections.push(
      [
        createCsvRow(['Category breakdown']),
        createCsvRow(['Category', 'Spent', 'Spent formatted', 'Share of expenses']),
        ...reportData.categories.map((category) => createCsvRow([
          category.name,
          category.amount,
          formatCurrency(category.amount),
          reportData.totalExpenses > 0 ? `${Math.round((category.amount / reportData.totalExpenses) * 100)}%` : '0%',
        ])),
      ].join(NEWLINE),
    );
  }

  sections.push(
    [
      createCsvRow(['Transactions']),
      createCsvRow(['Date', 'Payee', 'Category', 'Subcategory', 'Account', 'Type', 'Amount', 'Amount formatted', 'Description', 'AI confidence', 'AI reason']),
      ...reportData.transactions.map((transaction) => createCsvRow([
        formatDisplayDate(transaction.date),
        transaction.payee,
        transaction.category,
        transaction.subcategory,
        transaction.accountName,
        transaction.type,
        transaction.amount,
        formatCurrency(transaction.amount),
        transaction.description,
        transaction.aiConfidence != null ? `${Math.round(transaction.aiConfidence * 100)}%` : '',
        transaction.aiReason,
      ])),
    ].join(NEWLINE),
  );

  if (reportData.goals.length > 0) {
    sections.push(
      [
        createCsvRow(['Goals snapshot']),
        createCsvRow(['Goal', 'Current', 'Current formatted', 'Target', 'Target formatted', 'Progress', 'Target date']),
        ...reportData.goals.map((goal) => createCsvRow([
          `${goal.icon} ${goal.name}`,
          goal.current,
          formatCurrency(goal.current),
          goal.target,
          formatCurrency(goal.target),
          `${goal.progressPct}%`,
          formatDisplayDate(goal.targetDate),
        ])),
      ].join(NEWLINE),
    );
  }

  if (reportData.pulseAlerts.length > 0) {
    sections.push(
      [
        createCsvRow(['Pulse alerts']),
        createCsvRow(['Type', 'Title', 'Message']),
        ...reportData.pulseAlerts.map((alert) => createCsvRow([alert.type, alert.title, alert.body])),
      ].join(NEWLINE),
    );
  }

  return sections.join(`${NEWLINE}${NEWLINE}`);
}

export function downloadTransactionsCsvReport(reportData: TransactionsReportData, fileName = 'transactions-report.csv') {
  const csv = createTransactionsCsvReport(reportData);
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(url);
}