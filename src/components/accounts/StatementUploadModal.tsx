import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload, Wifi, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpcomingBadge } from '@/components/UpcomingBadge';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { supabase } from '@/integrations/supabase/client';
import { UK_BANKS } from '@/data/ukBanks';
import { toast } from 'sonner';
import { getStatementUploadError, importParsedStatementTransactions, STATEMENT_CATEGORIES, uploadBankStatementFile, type ParsedStatementTransaction } from '@/lib/bank-statement-upload';

interface AccountSummary {
  id: string;
  name: string;
  institution?: string | null;
}

interface StatementUploadModalProps {
  account: AccountSummary;
  onClose: () => void;
}

const UPLOAD_FREQUENCIES = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly (recommended)' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'adhoc', label: 'Ad hoc' },
] as const;

const MONTH_DAYS = Array.from({ length: 28 }, (_, index) => index + 1);

function findBankId(institution?: string | null) {
  const normalized = institution?.trim().toLowerCase();
  if (!normalized) return 'other';

  return UK_BANKS.find((bank) => {
    const name = bank.name.toLowerCase();
    return normalized === name || normalized.includes(name) || name.includes(normalized);
  })?.id || 'other';
}

export function StatementUploadModal({ account, onClose }: StatementUploadModalProps) {
  const { user } = useAuth();
  const demo = useDemoMode();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bankId = useMemo(() => findBankId(account.institution), [account.institution]);
  const selectedBank = UK_BANKS.find((bank) => bank.id === bankId);

  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsedTransactions, setParsedTransactions] = useState<ParsedStatementTransaction[]>([]);
  const [parseSummary, setParseSummary] = useState<{ total: number; income: number; expenses: number } | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'review' | 'income' | 'expense'>('all');
  const [importing, setImporting] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ amount: '', category: 'Shopping', date: '', description: '', type: 'expense' as 'income' | 'expense' });
  const [uploadFrequency, setUploadFrequency] = useState<string>('monthly');
  const [monthlyDay, setMonthlyDay] = useState<number>(2);
  const [reminderId, setReminderId] = useState<string | null>(null);
  const [loadingPreference, setLoadingPreference] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPreference = async () => {
      if (!user || demo) {
        setLoadingPreference(false);
        return;
      }

      const { data, error } = await supabase
        .from('reminder_preferences')
        .select('id, frequency, payday_date')
        .eq('user_id', user.id)
        .eq('entity_type', 'statement_upload')
        .eq('entity_id', account.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!mounted) return;
      if (!error && data?.[0]) {
        setReminderId(data[0].id);
        setUploadFrequency(data[0].frequency || 'monthly');
        setMonthlyDay(data[0].payday_date || 2);
      }
      setLoadingPreference(false);
    };

    void loadPreference();
    return () => {
      mounted = false;
    };
  }, [account.id, demo, user]);

  const saveReminderPreference = async () => {
    if (!user || demo) return;

    const payload = {
      user_id: user.id,
      entity_type: 'statement_upload',
      entity_id: account.id,
      frequency: uploadFrequency,
      channels: ['in_app'],
      payday_date: uploadFrequency === 'monthly' ? monthlyDay : null,
      is_active: true,
    };

    if (reminderId) {
      const { error } = await supabase.from('reminder_preferences').update(payload).eq('id', reminderId);
      if (error) throw error;
      return;
    }

    const { data, error } = await supabase.from('reminder_preferences').insert(payload).select('id').single();
    if (error) throw error;
    setReminderId(data.id);
  };

  const handleFileDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleParseFile = async () => {
    if (!file) return;
    setParsing(true);
    setParseError('');

    try {
      // Save reminder preference (non-blocking — don't let it crash the parse)
      try { await saveReminderPreference(); } catch (e) { console.warn('Reminder save skipped:', e); }

      const result = await uploadBankStatementFile(file, bankId);
      setParsedTransactions(result.transactions);
      setParseSummary(result.summary);
    } catch (error: any) {
      console.error('Import upload error:', error);
      setParseError(getStatementUploadError(error));
    } finally {
      setParsing(false);
    }
  };

  const filteredTransactions = parsedTransactions.filter((transaction) => {
    if (reviewFilter === 'review') return (transaction.confidence || 0) < 0.8;
    if (reviewFilter === 'income') return transaction.type === 'income';
    if (reviewFilter === 'expense') return transaction.type === 'expense';
    return true;
  });

  const toggleTransaction = (index: number) => {
    setParsedTransactions((current) => current.map((transaction, transactionIndex) => (
      transactionIndex === index ? { ...transaction, selected: !transaction.selected } : transaction
    )));
  };

  const toggleAll = (selected: boolean) => {
    setParsedTransactions((current) => current.map((transaction) => ({ ...transaction, selected })));
  };

  const startEditTransaction = (index: number) => {
    const transaction = parsedTransactions[index];
    setEditingTransaction(index);
    setEditForm({
      amount: String(Math.abs(Number(transaction.amount))),
      category: transaction.editedCategory || transaction.suggestedCategory || 'Shopping',
      date: transaction.date,
      description: transaction.description,
      type: transaction.type,
    });
  };

  const saveEditedTransaction = () => {
    if (editingTransaction === null) return;
    const amount = parseFloat(editForm.amount);
    if (Number.isNaN(amount) || amount <= 0) return;

    setParsedTransactions((current) => current.map((transaction, index) => {
      if (index !== editingTransaction) return transaction;
      const nextDescription = editForm.description.trim();
      const signedAmount = editForm.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
      return {
        ...transaction,
        amount: signedAmount,
        date: editForm.date,
        description: nextDescription,
        rawDescription: nextDescription,
        editedCategory: editForm.category,
        type: editForm.type,
      };
    }));
    setEditingTransaction(null);
  };

  const selectedCount = parsedTransactions.filter((transaction) => transaction.selected).length;

  const handleImport = async () => {
    const selectedTransactions = parsedTransactions.filter((transaction) => transaction.selected);
    if (!user) {
      toast.error('Please sign in to import transactions.');
      return;
    }
    if (selectedTransactions.length === 0) {
      toast.error('No transactions selected');
      return;
    }

    setImporting(true);
    try {
      try { await saveReminderPreference(); } catch (e) { console.warn('Reminder save skipped:', e); }

      const importedCount = await importParsedStatementTransactions({
        userId: user.id,
        accountId: account.id,
        accountName: account.name,
        institution: account.institution,
        bankId,
        filename: file?.name || 'statement.pdf',
        transactions: parsedTransactions,
      });

      toast.success(`Imported ${importedCount} transactions`);
      onClose();
    } catch (error: any) {
      console.error('Import upload error:', error);
      toast.error(getStatementUploadError(error));
    } finally {
      setImporting(false);
    }
  };

  const formatAmount = (amount: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Upload statement</h3>
            <p className="text-xs text-muted-foreground">{account.name} · {account.institution || 'Manual account'}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        {parsedTransactions.length === 0 ? (
          <div className="space-y-5">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="mb-2 text-sm font-medium">Manual Upload Mode</p>
              <p className="text-xs text-muted-foreground">Upload a PDF or CSV statement and Sonfi will use the imported data across transactions, budgets, Pulse, and chat.</p>
            </div>

            {selectedBank?.pdfHint && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <p className="text-[11px] text-primary">💡 {selectedBank.pdfHint}</p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">How often will you upload statements?</label>
              <div className="flex flex-wrap gap-2">
                {UPLOAD_FREQUENCIES.map((frequency) => (
                  <button
                    key={frequency.id}
                    onClick={() => setUploadFrequency(frequency.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${uploadFrequency === frequency.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {frequency.label}
                  </button>
                ))}
              </div>
            </div>

            {uploadFrequency === 'monthly' && (
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">Monthly upload day</label>
                <select value={monthlyDay} onChange={(event) => setMonthlyDay(Number(event.target.value))} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm">
                  {MONTH_DAYS.map((day) => (
                    <option key={day} value={day}>Every month on day {day}</option>
                  ))}
                </select>
              </div>
            )}

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/40'}`}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.pdf,application/pdf,text/csv" onChange={(event) => setFile(event.target.files?.[0] || null)} className="hidden" />
              {file ? (
                <div className="space-y-2">
                  <FileText size={24} className="mx-auto text-primary" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  <button onClick={(event) => { event.stopPropagation(); setFile(null); }} className="text-xs text-primary hover:underline">Remove file</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={24} className="mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drop your PDF or CSV bank statement here, or click to browse</p>
                  <p className="text-[11px] text-muted-foreground">Supported now: PDF, CSV</p>
                </div>
              )}
            </div>

            {parseError && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle size={14} />
                {parseError}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} className="flex-1">Not now</Button>
              <Button className="flex-1" onClick={handleParseFile} disabled={!file || parsing || loadingPreference}>
                {parsing ? <><Loader2 size={14} className="animate-spin" /> Analysing...</> : 'Upload & analyse'}
              </Button>
            </div>

            <div className="rounded-xl border p-3 opacity-60">
              <div className="flex items-center gap-2">
                <Wifi size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Bank Sync Mode</span>
                <UpcomingBadge />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {parseSummary && (
              <div className="flex flex-wrap gap-4 rounded-xl bg-muted/50 p-3 text-xs">
                <span>{parseSummary.total} transactions</span>
                <span className="amount-positive">In: {formatAmount(parseSummary.income)}</span>
                <span className="amount-negative">Out: {formatAmount(parseSummary.expenses)}</span>
                <span className="font-medium">Net: {formatAmount(parseSummary.income - parseSummary.expenses)}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {([['all', 'All'], ['review', 'Review needed'], ['income', 'Income'], ['expense', 'Expenses']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setReviewFilter(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${reviewFilter === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-[46vh] space-y-1 overflow-y-auto">
              {filteredTransactions.map((transaction) => {
                const index = parsedTransactions.indexOf(transaction);
                const confidence = transaction.confidence || 0;
                const confidenceClass = confidence >= 0.9 ? 'border-accent' : confidence >= 0.7 ? 'border-primary' : 'border-destructive';

                return (
                  <div key={`${transaction.date}-${transaction.description}-${transaction.amount}-${index}`} className={`flex items-center gap-2 rounded-lg border p-2 ${transaction.selected ? 'bg-background' : 'bg-muted/30 opacity-60'}`}>
                    <input type="checkbox" checked={transaction.selected} onChange={() => toggleTransaction(index)} className="rounded" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-medium">{transaction.description || 'Unknown'}</p>
                        <span className="flex-shrink-0 text-[10px] text-muted-foreground">{transaction.date}</span>
                      </div>
                      <p className="truncate text-[10px] text-muted-foreground">{transaction.rawDescription}</p>
                    </div>
                    <select
                      value={transaction.editedCategory || transaction.suggestedCategory || 'Shopping'}
                      onChange={(event) => setParsedTransactions((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, editedCategory: event.target.value } : row))}
                      className={`min-w-[108px] rounded-lg border-2 bg-background px-2 py-1 text-[11px] ${confidenceClass}`}
                    >
                      {STATEMENT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                    <button onClick={() => startEditTransaction(index)} className="rounded-lg border p-2 text-muted-foreground hover:bg-muted">
                      <Pencil size={12} />
                    </button>
                    <span className={`min-w-[72px] text-right text-xs font-medium ${transaction.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                      {formatAmount(transaction.amount)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <div className="flex gap-2">
                <button onClick={() => toggleAll(true)} className="text-xs text-primary hover:underline">Select all</button>
                <button onClick={() => toggleAll(false)} className="text-xs text-muted-foreground hover:underline">Deselect all</button>
              </div>
              <Button onClick={handleImport} disabled={importing || selectedCount === 0}>
                {importing ? <><Loader2 size={14} className="animate-spin" /> Importing...</> : <><CheckCircle2 size={14} /> Import {selectedCount}</>}
              </Button>
            </div>
          </div>
        )}

        {editingTransaction !== null && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setEditingTransaction(null)}>
            <div className="w-full max-w-md rounded-2xl border bg-card p-6" onClick={(event) => event.stopPropagation()}>
              <h4 className="mb-4 text-lg font-medium">Edit imported row</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(['expense', 'income'] as const).map((type) => (
                    <button key={type} onClick={() => setEditForm((current) => ({ ...current, type }))} className={`flex-1 rounded-xl border py-2 text-sm transition-colors ${editForm.type === type ? 'border-primary bg-primary text-primary-foreground' : 'bg-card'}`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <label className="label-text block">Date</label>
                <input type="date" value={editForm.date} onChange={(event) => setEditForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm" />
                <label className="label-text block">Description</label>
                <input value={editForm.description} onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm" />
                <label className="label-text block">Amount (£)</label>
                <input type="number" step="0.01" value={editForm.amount} onChange={(event) => setEditForm((current) => ({ ...current, amount: event.target.value }))} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm" />
                <label className="label-text block">Category</label>
                <select value={editForm.category} onChange={(event) => setEditForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm">
                  {STATEMENT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setEditingTransaction(null)} className="flex-1">Cancel</Button>
                  <Button className="flex-1" onClick={saveEditedTransaction}>Save row</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}