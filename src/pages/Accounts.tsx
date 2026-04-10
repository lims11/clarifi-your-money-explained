import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/finance';
import { useAccounts, useTransactions, useAddAccount, useAddTransaction } from '@/hooks/useFinanceData';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

const institutionLogos: Record<string, { bg: string; letter: string; dark?: boolean }> = {
  'Barclays': { bg: '#00AEEF', letter: 'B' },
  'HSBC': { bg: '#DB0011', letter: 'H' },
  'NatWest': { bg: '#4A0E8F', letter: 'N' },
  'Lloyds': { bg: '#006A4D', letter: 'L' },
  'Santander': { bg: '#EC0000', letter: 'S' },
  'Monzo': { bg: '#FF3464', letter: 'M' },
  'Starling': { bg: '#6935D3', letter: 'S' },
  'Chase UK': { bg: '#117ACA', letter: 'C' },
  'Halifax': { bg: '#005EB8', letter: 'H' },
  'American Express': { bg: '#007BC1', letter: 'A' },
  'Goldman Sachs': { bg: '#1A1A1A', letter: 'G' },
  'Coinbase': { bg: '#0052FF', letter: 'C' },
  'Binance': { bg: '#F3BA2F', letter: 'B', dark: true },
  'Vanguard': { bg: '#961A1A', letter: 'V' },
};

const typeLabels: Record<string, string> = {
  current: 'Current accounts', savings: 'Savings accounts', credit_card: 'Credit cards',
  loan: 'Loans', mortgage: 'Mortgages', investment: 'Investments', crypto: 'Crypto', cash: 'Cash',
};

const typeOrder = ['current', 'savings', 'credit_card', 'investment', 'crypto', 'loan', 'mortgage', 'cash'];

const accountTypes = ['current', 'savings', 'credit_card', 'loan', 'mortgage', 'investment', 'crypto', 'cash'];
const colours = ['#7F77DD', '#1D9E75', '#D85A30', '#EF9F27', '#378ADD', '#E24B4A'];

export default function AccountsPage() {
  const { id } = useParams();
  const { data: accounts, isLoading } = useAccounts();
  const { data: allTransactions } = useTransactions({});
  const addAccount = useAddAccount();
  const addTransaction = useAddTransaction();

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTxn, setShowAddTxn] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'current', institution: '', balance: '', colour: '#7F77DD' });
  const [txnForm, setTxnForm] = useState({ payee: '', amount: '', type: 'expense', category: 'Shopping', date: new Date().toISOString().split('T')[0], description: '' });

  // Single account view
  if (id && accounts) {
    const account = accounts.find(a => a.id === id);
    if (!account) return <div className="p-8 text-center text-muted-foreground">Account not found</div>;
    const accountTxns = allTransactions?.filter(t => t.account_id === id) ?? [];
    const logo = institutionLogos[account.institution || ''];

    return (
      <div className="p-5 lg:p-8 max-w-4xl mx-auto">
        <Link to="/accounts" className="text-xs text-primary hover:underline mb-4 block">← All accounts</Link>
        <div className="clarifi-card mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium"
              style={{ backgroundColor: logo?.bg || account.colour || '#7F77DD', color: logo?.dark ? '#1A1A1A' : '#fff' }}>
              {logo?.letter || (account.institution?.[0] || 'A')}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-medium">{account.name}</h1>
              <p className="text-sm text-muted-foreground">{account.institution} · {account.type.replace('_', ' ')}</p>
            </div>
            <p className={`text-2xl font-medium ${Number(account.balance) >= 0 ? 'amount-positive' : 'amount-negative'}`}>{formatCurrency(Number(account.balance))}</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium">Transactions</h2>
          <Button size="sm" onClick={() => setShowAddTxn(true)}><Plus size={14} /> Add</Button>
        </div>
        {accountTxns.length > 0 ? (
          <div className="clarifi-card divide-y">
            {accountTxns.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: Number(t.amount) > 0 ? '#1D9E75' : '#D85A30' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.payee || t.category}</p>
                  <p className="text-xs text-muted-foreground">{t.category}{t.subcategory ? ` > ${t.subcategory}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${Number(t.amount) > 0 ? 'amount-positive' : 'amount-negative'}`}>{formatCurrency(Number(t.amount))}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="clarifi-card text-center py-8">
            <p className="text-muted-foreground text-sm">No transactions for this account</p>
          </div>
        )}

        {/* Add transaction modal */}
        {showAddTxn && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddTxn(false)}>
            <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-medium mb-4">Add transaction</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {['expense', 'income'].map(t => (
                    <button key={t} onClick={() => setTxnForm(f => ({ ...f, type: t }))} className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${txnForm.type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
                <input placeholder="Payee" value={txnForm.payee} onChange={e => setTxnForm(f => ({ ...f, payee: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                <input placeholder="Amount" type="number" step="0.01" value={txnForm.amount} onChange={e => setTxnForm(f => ({ ...f, amount: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                <input type="date" value={txnForm.date} onChange={e => setTxnForm(f => ({ ...f, date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                <select value={txnForm.category} onChange={e => setTxnForm(f => ({ ...f, category: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm">
                  {['Food & Drink', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Travel', 'Income', 'Personal'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setShowAddTxn(false)} className="flex-1">Cancel</Button>
                  <Button className="flex-1" disabled={!txnForm.payee || !txnForm.amount} onClick={async () => {
                    const amt = parseFloat(txnForm.amount);
                    await addTransaction.mutateAsync({
                      account_id: id!,
                      amount: txnForm.type === 'expense' ? -Math.abs(amt) : Math.abs(amt),
                      type: txnForm.type,
                      category: txnForm.category,
                      payee: txnForm.payee,
                      date: txnForm.date,
                      description: txnForm.description,
                    });
                    toast.success('Transaction added');
                    setShowAddTxn(false);
                    setTxnForm({ payee: '', amount: '', type: 'expense', category: 'Shopping', date: new Date().toISOString().split('T')[0], description: '' });
                  }}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Accounts list
  if (isLoading) {
    return (
      <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
      </div>
    );
  }

  const grouped = (accounts || []).reduce((acc, a) => {
    if (!acc[a.type]) acc[a.type] = [];
    acc[a.type].push(a);
    return acc;
  }, {} as Record<string, typeof accounts>);

  const sortedTypes = typeOrder.filter(t => grouped[t]);

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Accounts</h1>
        <Button size="sm" onClick={() => setShowAddAccount(true)}><Plus size={16} /> Add account</Button>
      </div>

      {(!accounts || accounts.length === 0) ? (
        <div className="clarifi-card text-center py-12">
          <p className="text-lg font-medium mb-2">No accounts yet</p>
          <p className="text-sm text-muted-foreground mb-4">Add your first account to start tracking</p>
          <Button onClick={() => setShowAddAccount(true)}>Add account</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedTypes.map(type => {
            const typeAccounts = grouped[type]!;
            const total = typeAccounts.reduce((s, a) => s + Number(a.balance), 0);
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="label-text">{typeLabels[type] || type}</h2>
                  <span className="text-xs text-muted-foreground">{typeAccounts.length} · {formatCurrency(total)}</span>
                </div>
                <div className="space-y-2">
                  {typeAccounts.map(a => {
                    const logo = institutionLogos[a.institution || ''];
                    const monthIncome = allTransactions?.filter(t => t.account_id === a.id && t.type === 'income').reduce((s, t) => s + Number(t.amount), 0) ?? 0;
                    const monthExpenses = Math.abs(allTransactions?.filter(t => t.account_id === a.id && t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0) ?? 0);
                    // Fake sparkline data
                    const spark = Array.from({ length: 7 }, (_, i) => ({ v: Number(a.balance) + (Math.random() - 0.5) * 200 * (7 - i) }));

                    return (
                      <Link key={a.id} to={`/accounts/${a.id}`} className="clarifi-card hover:border-primary/20 transition-colors block">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium"
                            style={{ backgroundColor: logo?.bg || a.colour || '#7F77DD', color: logo?.dark ? '#1A1A1A' : '#fff' }}>
                            {logo?.letter || (a.institution?.[0] || 'A')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{a.name}</p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{a.type.replace('_', ' ')}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{a.institution || 'Manual'} · •••• {Math.floor(Math.random() * 9000 + 1000)}</p>
                          </div>
                          <div className="w-20 h-8 hidden sm:block">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={spark}>
                                <Line type="monotone" dataKey="v" stroke="#7F77DD" strokeWidth={1.5} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <p className={`text-base font-medium ${Number(a.balance) >= 0 ? 'amount-positive' : 'amount-negative'}`}>{formatCurrency(Number(a.balance))}</p>
                        </div>
                        <div className="flex gap-4 mt-3 pt-3 border-t text-xs">
                          <span className="flex items-center gap-1 amount-positive"><ArrowUpRight size={12} /> {formatCurrency(monthIncome)}</span>
                          <span className="flex items-center gap-1 amount-negative"><ArrowDownRight size={12} /> {formatCurrency(monthExpenses)}</span>
                          <span className="ml-auto text-primary">View transactions →</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add account modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddAccount(false)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Add account</h3>
            <div className="space-y-3">
              <input placeholder="Account name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm">
                {accountTypes.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
              <input placeholder="Institution (e.g. Barclays)" value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              <input placeholder="Opening balance" type="number" step="0.01" value={form.balance} onChange={e => setForm(f => ({ ...f, balance: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              <div className="flex gap-2">
                {colours.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, colour: c }))} className={`w-8 h-8 rounded-full border-2 ${form.colour === c ? 'border-foreground' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowAddAccount(false)} className="flex-1">Cancel</Button>
                <Button className="flex-1" disabled={!form.name} onClick={async () => {
                  await addAccount.mutateAsync({ name: form.name, type: form.type, institution: form.institution, balance: parseFloat(form.balance) || 0, colour: form.colour });
                  toast.success('Account added');
                  setShowAddAccount(false);
                  setForm({ name: '', type: 'current', institution: '', balance: '', colour: '#7F77DD' });
                }}>Add account</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
