import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UK_BANKS, getBankById } from '@/data/ukBanks';
import { useDemoMode } from '@/hooks/useDemoMode';
import { UpcomingBadge } from '@/components/UpcomingBadge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Search, Upload, Wifi, CreditCard, Landmark, PiggyBank, Home, TrendingUp, Bitcoin, Wallet, Briefcase, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getStatementUploadError, importParsedStatementTransactions, STATEMENT_CATEGORIES, uploadBankStatementFile, type ParsedStatementTransaction } from '@/lib/bank-statement-upload';
import { detectSubscriptionsAndAlert } from '@/lib/detect-subscriptions';
import { BankLogo } from '@/components/BankLogo';
import { useQueryClient } from '@tanstack/react-query';

const ACCOUNT_TYPES = [
  { id: 'current', label: 'Current Account', icon: Landmark, desc: 'Everyday spending' },
  { id: 'savings', label: 'Savings Account', icon: PiggyBank, desc: 'Grow your money' },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard, desc: 'Track credit spending' },
  { id: 'mortgage', label: 'Mortgage / Loan', icon: Home, desc: 'Track repayments' },
  { id: 'investment', label: 'Investment / ISA', icon: TrendingUp, desc: 'Stocks, funds, ISAs' },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin, desc: 'Digital currencies' },
  { id: 'cash', label: 'Cash Wallet', icon: Wallet, desc: 'Physical cash tracking' },
  { id: 'business', label: 'Business Account', icon: Briefcase, desc: 'Business finances' },
];

const UPLOAD_FREQUENCIES = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly (recommended)' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'adhoc', label: 'Ad hoc' },
];

type ParsedTransaction = ParsedStatementTransaction;

interface AddAccountModalProps {
  onClose: () => void;
  onSave: (data: { name: string; type: string; institution: string; balance: number; colour: string }) => void;
}

export function AddAccountModal({ onClose, onSave }: AddAccountModalProps) {
  const { user } = useAuth();
  const demo = useDemoMode();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Step navigation
  const [step, setStep] = useState(1);

  // Step 1: Account type
  const [accountType, setAccountType] = useState('');

  // Step 2: Bank + details
  const [bankId, setBankId] = useState('');
  const [customBankName, setCustomBankName] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [nickname, setNickname] = useState('');
  const [balance, setBalance] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [interestRate, setInterestRate] = useState('');

  // Step 3: Upload
  const [uploadFrequency, setUploadFrequency] = useState('monthly');
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  // Step 4: Review parsed transactions
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [parseSummary, setParseSummary] = useState<{ total: number; income: number; expenses: number } | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'review' | 'income' | 'expense'>('all');
  const [importing, setImporting] = useState(false);
  const [savedAccountId, setSavedAccountId] = useState<string | null>(null);

  const selectedBank = getBankById(bankId);
  const bankName = bankId === 'other' ? customBankName : (selectedBank?.name || '');

  const filteredBanks = UK_BANKS.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleSelectType = (typeId: string) => {
    setAccountType(typeId);
    setStep(2);
  };

  const handleSelectBank = (id: string) => {
    setBankId(id);
    const bank = getBankById(id);
    const typeLabel = ACCOUNT_TYPES.find(t => t.id === accountType)?.label || accountType;
    if (bank && id !== 'other') {
      setNickname(`${bank.name} ${typeLabel}`);
    }
  };

  // Save account first, then proceed to upload
  const handleSaveAndUpload = async () => {
    if (demo) {
      toast.success('Account added');
      setStep(3);
      return;
    }
    try {
      const accountData = {
        name: nickname || `${bankName} ${accountType}`,
        type: accountType === 'business' ? 'current' : accountType,
        institution: bankName,
        balance: parseFloat(balance) || 0,
        colour: selectedBank?.colour || '#7F77DD',
      };
      // Save the account
      const { data, error } = await supabase.from('accounts').insert({
        ...accountData,
        user_id: user!.id,
      }).select().single();
      if (error) throw error;
      setSavedAccountId(data.id);
      toast.success('Account created');
      setStep(3);
    } catch (err) {
      toast.error('Failed to create account');
      console.error(err);
    }
  };

  // Save account without upload (skip)
  const handleSaveSkip = async () => {
    if (demo) {
      toast.success('Account added');
      onClose();
      return;
    }
    if (!savedAccountId) {
      const accountData = {
        name: nickname || `${bankName} ${accountType}`,
        type: accountType === 'business' ? 'current' : accountType,
        institution: bankName,
        balance: parseFloat(balance) || 0,
        colour: selectedBank?.colour || '#7F77DD',
      };
      onSave(accountData);
    }
    toast.success('Account added — you can upload statements later');
    onClose();
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleParseFile = async () => {
    if (!file) return;
    setParsing(true);
    setParseError('');

    try {
      const result = await uploadBankStatementFile(file, bankId);
      setParsedTransactions(result.transactions);
      setParseSummary(result.summary);
      setStep(4);
    } catch (err: any) {
      console.error(err);
      setParseError(getStatementUploadError(err));
    } finally {
      setParsing(false);
    }
  };

  const toggleTransaction = (idx: number) => {
    setParsedTransactions(prev => prev.map((t, i) => i === idx ? { ...t, selected: !t.selected } : t));
  };

  const toggleAll = (selected: boolean) => {
    setParsedTransactions(prev => prev.map(t => ({ ...t, selected })));
  };

  const updateCategory = (idx: number, category: string) => {
    setParsedTransactions(prev => prev.map((t, i) => i === idx ? { ...t, editedCategory: category } : t));
  };

  const filteredReview = parsedTransactions.filter(t => {
    if (reviewFilter === 'review') return (t.confidence || 0) < 0.8;
    if (reviewFilter === 'income') return t.type === 'income';
    if (reviewFilter === 'expense') return t.type === 'expense';
    return true;
  });

  const selectedCount = parsedTransactions.filter(t => t.selected).length;

  const handleImport = async () => {
    const toImport = parsedTransactions.filter(t => t.selected);
    if (toImport.length === 0) { toast.error('No transactions selected'); return; }

    setImporting(true);
    try {
      if (!savedAccountId || !user) throw new Error('Create an account before importing this statement.');
      const importedCount = await importParsedStatementTransactions({
        userId: user.id,
        accountId: savedAccountId,
        accountName: nickname || `${bankName} ${accountType}`,
        institution: bankName,
        bankId,
        filename: file?.name || 'statement.csv',
        transactions: parsedTransactions,
      });

      toast.success(`Imported ${importedCount} transactions!`);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(getStatementUploadError(err));
    } finally {
      setImporting(false);
    }
  };

  const CATEGORIES = STATEMENT_CATEGORIES;

  const fmt = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          {step > 1 && (
            <button onClick={() => setStep(step === 4 ? 3 : step - 1)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h3 className="text-lg font-semibold">
              {step === 4 ? 'Review transactions' : 'Add account'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {step === 4 ? `${parsedTransactions.length} transactions found` : `Step ${step} of 3`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {step <= 3 && (
          <div className="flex gap-1 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        )}

        {/* STEP 1: Choose type */}
        {step === 1 && (
          <div>
            <p className="text-sm font-medium mb-4">What type of account is this?</p>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelectType(t.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <t.icon size={18} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Choose bank + details */}
        {step === 2 && (
          <div>
            {!bankId ? (
              <>
                <p className="text-sm font-medium mb-3">Choose your bank</p>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input placeholder="Search banks..." value={bankSearch} onChange={e => setBankSearch(e.target.value)} className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-background" />
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-[40vh] overflow-y-auto">
                  {filteredBanks.map(bank => (
                    <button key={bank.id} onClick={() => handleSelectBank(bank.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <BankLogo bankId={bank.id} size={40} />
                      <span className="text-[11px] font-medium text-center leading-tight">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/50">
                  <BankLogo bankId={bankId} size={40} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{bankId === 'other' ? 'Custom bank' : selectedBank?.name}</p>
                    <p className="text-[11px] text-muted-foreground">{ACCOUNT_TYPES.find(t => t.id === accountType)?.label}</p>
                  </div>
                  <button onClick={() => setBankId('')} className="text-xs text-primary hover:underline">Change</button>
                </div>

                <div className="space-y-3">
                  {bankId === 'other' && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Bank name</label>
                      <input placeholder="Enter your bank name" value={customBankName} onChange={e => setCustomBankName(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Account nickname</label>
                    <input placeholder="e.g. Barclays Current" value={nickname} onChange={e => setNickname(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Current balance (£)</label>
                    <input type="number" step="0.01" placeholder="0.00" value={balance} onChange={e => setBalance(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                  </div>
                  {accountType === 'credit_card' && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Credit limit (£)</label>
                      <input type="number" placeholder="e.g. 5000" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                    </div>
                  )}
                  {(accountType === 'savings' || accountType === 'mortgage') && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Interest rate % (optional)</label>
                      <input type="number" step="0.01" placeholder="e.g. 4.5" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                    </div>
                  )}
                </div>

                <Button className="w-full mt-4" onClick={handleSaveAndUpload} disabled={!nickname && bankId === 'other' && !customBankName}>
                  Continue to upload
                </Button>
              </>
            )}
          </div>
        )}

        {/* STEP 3: Upload statement */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-medium">Upload your {bankName} statement</p>
            <p className="text-xs text-muted-foreground">Upload a PDF or CSV file from your bank. Sonfi will read and categorise your transactions automatically using AI.</p>

            {selectedBank?.pdfHint && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <p className="text-[11px] text-primary">💡 {selectedBank.pdfHint}</p>
              </div>
            )}

            {/* Supported formats */}
            <div className="flex flex-wrap gap-1">
              {['PDF', 'CSV'].map(f => (
                <span key={f} className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">{f}</span>
              ))}
            </div>

            {/* File drop zone */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.pdf,application/pdf,text/csv" onChange={handleFileChange} className="hidden" />
              {file ? (
                <div className="space-y-2">
                  <FileText size={24} className="mx-auto text-primary" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-primary hover:underline">Remove</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={24} className="mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drop your statement here or click to browse</p>
                  <p className="text-[11px] text-muted-foreground">PDF and CSV files supported</p>
                </div>
              )}
            </div>

            {parseError && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg p-3">
                <AlertCircle size={14} />
                {parseError}
              </div>
            )}

            {/* Upload frequency */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">How often will you upload statements?</label>
              <div className="flex flex-wrap gap-2">
                {UPLOAD_FREQUENCIES.map(f => (
                  <button key={f.id} onClick={() => setUploadFrequency(f.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${uploadFrequency === f.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="ghost" onClick={handleSaveSkip} className="flex-1">
                Skip — add later
              </Button>
              <Button className="flex-1" onClick={handleParseFile} disabled={!file || parsing}>
                {parsing ? <><Loader2 size={14} className="animate-spin" /> Analysing...</> : 'Upload & Analyse'}
              </Button>
            </div>

            {/* Bank sync upcoming */}
            <div className="w-full p-3 rounded-xl border opacity-50 mt-2">
              <div className="flex items-center gap-2">
                <Wifi size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Or connect directly to {bankName || 'your bank'}</span>
                <UpcomingBadge />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review parsed transactions */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Summary bar */}
            {parseSummary && (
              <div className="flex flex-wrap gap-4 text-xs p-3 rounded-xl bg-muted/50">
                <span>{parseSummary.total} transactions</span>
                <span className="amount-positive">In: {fmt(parseSummary.income)}</span>
                <span className="amount-negative">Out: {fmt(parseSummary.expenses)}</span>
                <span className="font-medium">Net: {fmt(parseSummary.income - parseSummary.expenses)}</span>
              </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-2">
              {([['all', 'All'], ['review', 'Review needed'], ['income', 'Income'], ['expense', 'Expenses']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setReviewFilter(key)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${reviewFilter === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {label}
                  {key === 'review' && ` (${parsedTransactions.filter(t => (t.confidence || 0) < 0.8).length})`}
                </button>
              ))}
            </div>

            {/* Transaction list */}
            <div className="max-h-[40vh] overflow-y-auto space-y-1">
              {filteredReview.map((t, idx) => {
                const realIdx = parsedTransactions.indexOf(t);
                const conf = t.confidence || 0;
                const confColor = conf >= 0.9 ? 'border-green-400' : conf >= 0.7 ? 'border-amber-400' : 'border-red-400';
                return (
                  <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg border ${t.selected ? 'bg-background' : 'bg-muted/30 opacity-60'}`}>
                    <input type="checkbox" checked={t.selected} onChange={() => toggleTransaction(realIdx)} className="rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium truncate">{t.description || 'Unknown'}</p>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">{t.date}</span>
                      </div>
                      {t.rawDescription !== t.description && (
                        <p className="text-[10px] text-muted-foreground truncate">raw: {t.rawDescription}</p>
                      )}
                    </div>
                    <select
                      value={t.editedCategory || t.suggestedCategory || 'Shopping'}
                      onChange={e => updateCategory(realIdx, e.target.value)}
                      className={`text-[11px] border-2 rounded-lg px-2 py-1 bg-background ${confColor} min-w-[90px]`}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className={`text-xs font-medium min-w-[70px] text-right ${t.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                      {fmt(t.amount)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Confidence legend */}
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-green-400 rounded" /> High confidence</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-amber-400 rounded" /> Medium</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-red-400 rounded" /> Needs review</span>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex gap-2">
                <button onClick={() => toggleAll(true)} className="text-xs text-primary hover:underline">Select all</button>
                <button onClick={() => toggleAll(false)} className="text-xs text-muted-foreground hover:underline">Deselect all</button>
              </div>
              <Button onClick={handleImport} disabled={importing || selectedCount === 0}>
                {importing ? <><Loader2 size={14} className="animate-spin" /> Importing...</> : (
                  <><CheckCircle2 size={14} /> Import {selectedCount} transactions</>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <Button variant="ghost" onClick={onClose} className="w-full mt-4">Cancel</Button>
        )}
      </div>
    </div>
  );
}
