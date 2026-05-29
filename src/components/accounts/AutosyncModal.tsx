import { useMemo, useState } from 'react';
import { Loader2, Search, ShieldCheck, Wifi, CheckCircle2, ArrowLeft, AlertCircle, Landmark, PiggyBank, CreditCard, TrendingUp, Bitcoin, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UK_BANKS, getBankById } from '@/data/ukBanks';
import { BankLogo } from '@/components/BankLogo';
import { ProgressStepper, type StepDef } from '@/components/ProgressStepper';
import { importParsedStatementTransactions, STATEMENT_CATEGORIES, type ParsedStatementTransaction } from '@/lib/bank-statement-upload';
import { detectSubscriptionsAndAlert } from '@/lib/detect-subscriptions';
import { toast } from 'sonner';


const ACCOUNT_TYPES = [
  { id: 'current', label: 'Current Account', icon: Landmark },
  { id: 'savings', label: 'Savings Account', icon: PiggyBank },
  { id: 'isa', label: 'ISA', icon: TrendingUp },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
  { id: 'investment', label: 'Investment', icon: TrendingUp },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin },
  { id: 'cash', label: 'Cash', icon: Wallet },
] as const;

type Step = 'bank' | 'type' | 'linking' | 'review';

const SAMPLE_PAYEES = [
  { name: 'Tesco', cat: 'Food & Drink', amt: [-9, -65] },
  { name: 'Sainsburys', cat: 'Food & Drink', amt: [-12, -55] },
  { name: 'TfL Travel', cat: 'Transport', amt: [-2.8, -7.5] },
  { name: 'Uber', cat: 'Transport', amt: [-6, -25] },
  { name: 'Pret a Manger', cat: 'Food & Drink', amt: [-4, -12] },
  { name: 'Amazon', cat: 'Shopping', amt: [-8, -120] },
  { name: 'Netflix', cat: 'Entertainment', amt: [-10.99, -10.99] },
  { name: 'Spotify', cat: 'Entertainment', amt: [-11.99, -11.99] },
  { name: 'EE Mobile', cat: 'Bills', amt: [-22, -22] },
  { name: 'Octopus Energy', cat: 'Bills', amt: [-78, -78] },
  { name: 'Salary — Acme Ltd', cat: 'Income', amt: [2400, 2400], type: 'income' as const },
];

function generateSampleTransactions(days = 90): Omit<ParsedStatementTransaction, 'selected'>[] {
  const out: Omit<ParsedStatementTransaction, 'selected'>[] = [];
  const today = new Date();
  for (let d = 0; d < days; d += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const iso = date.toISOString().slice(0, 10);
    // 0–3 transactions per day
    const n = Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i += 1) {
      const p = SAMPLE_PAYEES[Math.floor(Math.random() * SAMPLE_PAYEES.length)];
      const [lo, hi] = p.amt;
      const amount = +(lo + Math.random() * (hi - lo)).toFixed(2);
      out.push({
        date: iso,
        description: p.name,
        rawDescription: p.name.toUpperCase(),
        amount,
        type: (p as any).type === 'income' || amount > 0 ? 'income' : 'expense',
        suggestedCategory: p.cat,
        confidence: 0.92,
      });
    }
    // Monthly salary on the 28th-ish
    if (date.getDate() === 28) {
      out.push({
        date: iso,
        description: 'Salary — Acme Ltd',
        rawDescription: 'BACS CR ACME LTD SALARY',
        amount: 2400,
        type: 'income',
        suggestedCategory: 'Income',
        confidence: 0.99,
      });
    }
  }
  return out;
}

interface AutosyncModalProps {
  onClose: () => void;
}

export function AutosyncModal({ onClose }: AutosyncModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>('bank');
  const [bankId, setBankId] = useState('');
  const [customBankName, setCustomBankName] = useState('');
  const [accountType, setAccountType] = useState<string>('current');
  const [search, setSearch] = useState('');
  const [linking, setLinking] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState<ParsedStatementTransaction[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string>('');

  const selectedBank = getBankById(bankId);
  const bankName = bankId === 'other' ? (customBankName || 'My bank') : (selectedBank?.name || '');

  const filteredBanks = useMemo(
    () => UK_BANKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const handleConnect = async () => {
    if (!user) { toast.error('Please sign in'); return; }
    setError('');
    setLinking(true);
    setStep('linking');

    try {
      // Simulate the OAuth-style hop
      await new Promise(r => setTimeout(r, 1400));

      const nick = `${bankName} ${ACCOUNT_TYPES.find(t => t.id === accountType)?.label || ''}`.trim();
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .insert({
          user_id: user.id,
          name: nick,
          type: accountType === 'isa' ? 'investment' : accountType,
          institution: bankName,
          balance: 0,
          colour: selectedBank?.colour || '#7F77DD',
          is_active: true,
        })
        .select('id, name')
        .single();
      if (accountError) throw accountError;

      setAccountId(account.id);
      setAccountName(account.name);

      // Generate fake transactions to mimic a real bank pull
      await new Promise(r => setTimeout(r, 700));
      const generated = generateSampleTransactions(90).map(t => ({ ...t, selected: true }));
      setParsed(generated);
      setStep('review');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Could not link account');
      setStep('type');
    } finally {
      setLinking(false);
    }
  };

  const toggle = (i: number) => setParsed(p => p.map((t, idx) => idx === i ? { ...t, selected: !t.selected } : t));
  const toggleAll = (sel: boolean) => setParsed(p => p.map(t => ({ ...t, selected: sel })));
  const selectedCount = parsed.filter(t => t.selected).length;

  const handleImport = async () => {
    if (!user || !accountId) return;
    setImporting(true);
    try {
      const result: any = await importParsedStatementTransactions({
        userId: user.id,
        accountId,
        accountName,
        institution: bankName,
        bankId: bankId || 'other',
        filename: `autosync-${bankId}.json`,
        transactions: parsed,
      });
      const imported = typeof result === 'number' ? result : result?.imported ?? 0;
      const skipped = typeof result === 'number' ? 0 : result?.skipped ?? 0;
      if (skipped > 0) toast.success(`Imported ${imported} (${skipped} duplicates skipped)`);
      else toast.success(`Imported ${imported} transactions from ${bankName}`);
      try { await detectSubscriptionsAndAlert(user.id); } catch (e) { console.warn('Subscription scan skipped', e); }
      ['accounts', 'transactions', 'budgets', 'pulse_alerts', 'chat_messages', 'subscriptions'].forEach(k =>
        queryClient.invalidateQueries({ queryKey: [k] })
      );
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };


  const fmt = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-start gap-3">
          {step !== 'bank' && step !== 'linking' && (
            <button onClick={() => setStep(step === 'review' ? 'type' : 'bank')} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
              <ArrowLeft size={16} />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Wifi size={16} className="text-primary" />
              <h3 className="text-lg font-semibold">Autosync — connect your bank</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Open Banking · read-only · simulated demo connection</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

        <ProgressStepper
          steps={[
            { id: 'bank', label: 'Bank', status: step === 'bank' ? 'active' : 'done' },
            { id: 'type', label: 'Account', status: step === 'type' ? 'active' : (step === 'bank' ? 'pending' : 'done') },
            { id: 'linking', label: 'Connect', status: step === 'linking' ? 'active' : (['review'].includes(step) ? 'done' : 'pending') },
            { id: 'review', label: 'Review', status: step === 'review' ? 'active' : 'pending' },
            { id: 'import', label: 'Import', status: 'pending' },
          ] as StepDef[]}
        />

        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 flex items-start gap-2">
          <ShieldCheck size={14} className="mt-0.5 text-amber-700 dark:text-amber-400 flex-shrink-0" />
          <p className="text-[11px] text-amber-900 dark:text-amber-200">
            <strong>Demo Autosync:</strong> live GoCardless Open Banking is configured at the backend. The UI currently links via the simulated flow; click <em>Connect with real bank</em> on the bank step to start the GoCardless hosted flow.
          </p>
        </div>


        {/* STEP: pick bank */}
        {step === 'bank' && (
          <>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search banks…" value={search} onChange={e => setSearch(e.target.value)} className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-background" />
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-[44vh] overflow-y-auto">
              {filteredBanks.map(bank => (
                <button key={bank.id} onClick={() => { setBankId(bank.id); setStep('type'); }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <BankLogo bankId={bank.id} size={40} />
                  <span className="text-[11px] font-medium text-center leading-tight">{bank.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP: account type */}
        {step === 'type' && (
          <>
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/50">
              <BankLogo bankId={bankId} size={40} />
              <div className="flex-1">
                <p className="text-sm font-medium">{bankId === 'other' ? 'Custom bank' : selectedBank?.name}</p>
                <p className="text-[11px] text-muted-foreground">Choose what to link</p>
              </div>
              <button onClick={() => setStep('bank')} className="text-xs text-primary hover:underline">Change</button>
            </div>

            {bankId === 'other' && (
              <input placeholder="Enter your bank name" value={customBankName} onChange={e => setCustomBankName(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background mb-3" />
            )}

            <p className="text-xs font-medium text-muted-foreground mb-2">Account type</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {ACCOUNT_TYPES.map(t => (
                <button key={t.id} onClick={() => setAccountType(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${accountType === t.id ? 'border-primary bg-primary/5' : 'hover:border-primary/30'}`}>
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <t.icon size={16} />
                  </div>
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg p-3 mb-3">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <Button className="w-full" onClick={handleConnectReal} disabled={(bankId === 'other' && !customBankName) || linking}>
                {linking ? <><Loader2 size={14} className="animate-spin" /> Opening secure bank link…</> : <><ShieldCheck size={14} /> Connect with real bank (GoCardless)</>}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleConnect} disabled={bankId === 'other' && !customBankName}>
                <Wifi size={14} /> Use simulated demo
              </Button>
            </div>

          </>
        )}

        {/* STEP: linking */}
        {step === 'linking' && (
          <div className="py-12 flex flex-col items-center gap-4 text-center">
            <BankLogo bankId={bankId} size={64} />
            <Loader2 size={20} className="animate-spin text-primary" />
            <p className="text-sm font-medium">Securely connecting to {bankName}…</p>
            <p className="text-xs text-muted-foreground max-w-xs">Authorising read-only access · creating account · pulling 90 days of transactions</p>
          </div>
        )}

        {/* STEP: review */}
        {step === 'review' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
              <p className="font-medium">Importing into</p>
              <p className="text-muted-foreground">
                {accountName} <span className="font-mono opacity-70">· {accountId?.slice(0, 8)}…</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-4 rounded-xl bg-muted/50 p-3 text-xs">
              <span>{parsed.length} transactions</span>
              <span className="amount-positive">In: {fmt(parsed.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0))}</span>
              <span className="amount-negative">Out: {fmt(parsed.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0))}</span>
            </div>

            <div className="max-h-[40vh] space-y-1 overflow-y-auto">
              {parsed.map((t, i) => (
                <div key={i} className={`flex items-center gap-2 rounded-lg border p-2 ${t.selected ? 'bg-background' : 'bg-muted/30 opacity-60'}`}>
                  <input type="checkbox" checked={t.selected} onChange={() => toggle(i)} className="rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium">{t.description}</p>
                    <p className="text-[10px] text-muted-foreground">{t.date}</p>
                  </div>
                  <select
                    value={t.editedCategory || t.suggestedCategory || 'Shopping'}
                    onChange={e => setParsed(p => p.map((row, idx) => idx === i ? { ...row, editedCategory: e.target.value } : row))}
                    className="min-w-[108px] rounded-lg border bg-background px-2 py-1 text-[11px]"
                  >
                    {STATEMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className={`min-w-[72px] text-right text-xs font-medium ${t.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>{fmt(t.amount)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex gap-2">
                <button onClick={() => toggleAll(true)} className="text-xs text-primary hover:underline">Select all</button>
                <button onClick={() => toggleAll(false)} className="text-xs text-muted-foreground hover:underline">Deselect all</button>
              </div>
              <Button onClick={handleImport} disabled={importing || selectedCount === 0}>
                {importing ? <><Loader2 size={14} className="animate-spin" /> Importing…</> : <><CheckCircle2 size={14} /> Import {selectedCount}</>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
