import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal, Pencil, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/finance';
import { useAccounts, useTransactions, useAddAccount, useAddTransaction, useUpdateAccount, useDeleteAccount } from '@/hooks/useFinanceData';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { AddAccountModal } from '@/components/accounts/AddAccountModal';
import { StatementUploadModal } from '@/components/accounts/StatementUploadModal';

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
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const addTransaction = useAddTransaction();
  const demo = useDemoMode();

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTxn, setShowAddTxn] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'current', institution: '', balance: '', colour: '#7F77DD' });
  const [txnForm, setTxnForm] = useState({ payee: '', amount: '', type: 'expense', category: 'Shopping', date: new Date().toISOString().split('T')[0], description: '' });
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [deletingAccount, setDeletingAccount] = useState<any>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [uploadingAccount, setUploadingAccount] = useState<{ id: string; name: string; institution?: string | null } | null>(null);

  useEffect(() => {
    const handleClick = () => setMenuOpen(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Single account view
  if (id && accounts) {
    const account = accounts.find(a => a.id === id);
    if (!account) return <div className="p-8 text-center text-muted-foreground">Account not found</div>;
    const accountTxns = allTransactions?.filter(t => t.account_id === id) ?? [];
    const logo = institutionLogos[account.institution || ''];

    return (
      <div className="p-5 lg:p-8 max-w-4xl mx-auto">
        <Link to="/accounts" className="text-xs text-primary hover:underline mb-4 block">← All accounts</Link>
        <div className="sonfi-card mb-6">
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

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium">Transactions</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUploadingAccount({ id: account.id, name: account.name, institution: account.institution })}
            >
              <Upload size={14} /> Upload statement
            </Button>
            <Button size="sm" onClick={() => setShowAddTxn(true)}><Plus size={14} /> Add</Button>
          </div>
        </div>
        {accountTxns.length > 0 ? (
          <div className="sonfi-card divide-y">
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
          <div className="sonfi-card text-center py-8">
            <p className="text-muted-foreground text-sm">No transactions for this account</p>
          </div>
        )}

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
                <input placeholder="Payee" value={txnForm.payee} onChange={e => setTxnForm(f => ({ ...f, payee: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                <input placeholder="Amount" type="number" step="0.01" value={txnForm.amount} onChange={e => setTxnForm(f => ({ ...f, amount: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                <input type="date" value={txnForm.date} onChange={e => setTxnForm(f => ({ ...f, date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                <select value={txnForm.category} onChange={e => setTxnForm(f => ({ ...f, category: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background">
                  {['Food & Drink', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Travel', 'Income', 'Personal'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setShowAddTxn(false)} className="flex-1">Cancel</Button>
                  <Button className="flex-1" disabled={!txnForm.payee || !txnForm.amount} onClick={async () => {
                    if (demo) { toast.success('Transaction added (demo)'); setShowAddTxn(false); return; }
                    const amt = parseFloat(txnForm.amount);
                    await addTransaction.mutateAsync({
                      account_id: id!,
                      amount: txnForm.type === 'expense' ? -Math.abs(amt) : Math.abs(amt),
                      type: txnForm.type, category: txnForm.category, payee: txnForm.payee, date: txnForm.date, description: txnForm.description,
                    });
                    toast.success('Transaction added'); setShowAddTxn(false);
                  }}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {uploadingAccount && (
          <StatementUploadModal
            account={uploadingAccount}
            onClose={() => setUploadingAccount(null)}
          />
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
        <div className="sonfi-card text-center py-12">
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
                    const spark = Array.from({ length: 7 }, (_, i) => ({ v: Number(a.balance) + (Math.random() - 0.5) * 200 * (7 - i) }));

                    return (
                      <div key={a.id} className="sonfi-card hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <Link to={`/accounts/${a.id}`} className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium flex-shrink-0"
                            style={{ backgroundColor: logo?.bg || a.colour || '#7F77DD', color: logo?.dark ? '#1A1A1A' : '#fff' }}>
                            {logo?.letter || (a.institution?.[0] || 'A')}
                          </Link>
                          <Link to={`/accounts/${a.id}`} className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{a.name}</p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{a.type.replace('_', ' ')}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{a.institution || 'Manual'} · •••• {Math.floor(Math.random() * 9000 + 1000)}</p>
                          </Link>
                          <div className="w-20 h-8 hidden sm:block">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={spark}>
                                <Line type="monotone" dataKey="v" stroke="#7F77DD" strokeWidth={1.5} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <p className={`text-base font-medium ${Number(a.balance) >= 0 ? 'amount-positive' : 'amount-negative'}`}>{formatCurrency(Number(a.balance))}</p>
                          <div className="relative">
                            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setMenuOpen(menuOpen === a.id ? null : a.id); }} className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                              <MoreHorizontal size={16} />
                            </button>
                            {menuOpen === a.id && (
                              <div className="absolute right-0 top-8 bg-card border rounded-xl shadow-lg z-10 py-1 w-40">
                                <button onClick={() => { setEditingAccount(a); setEditForm({ name: a.name, institution: a.institution || '', balance: Number(a.balance), colour: a.colour || '#7F77DD' }); setMenuOpen(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors">
                                  <Pencil size={12} /> Edit account
                                </button>
                                <button onClick={() => { setDeletingAccount(a); setMenuOpen(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-coral hover:bg-coral/5 transition-colors">
                                  <Trash2 size={12} /> Delete account
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3 text-xs">
                          <span className="flex items-center gap-1 amount-positive"><ArrowUpRight size={12} /> {formatCurrency(monthIncome)}</span>
                          <span className="flex items-center gap-1 amount-negative"><ArrowDownRight size={12} /> {formatCurrency(monthExpenses)}</span>
                          <div className="ml-auto flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => setUploadingAccount({ id: a.id, name: a.name, institution: a.institution })}
                            >
                              <Upload size={12} /> Upload statement
                            </Button>
                            <Link to={`/accounts/${a.id}`} className="text-primary">View transactions →</Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add account modal — new 3-step flow */}
      {showAddAccount && (
        <AddAccountModal
          onClose={() => setShowAddAccount(false)}
          onSave={async (data) => {
            if (demo) return;
            await addAccount.mutateAsync(data);
          }}
        />
      )}

      {uploadingAccount && (
        <StatementUploadModal
          account={uploadingAccount}
          onClose={() => setUploadingAccount(null)}
        />
      )}

      {/* Edit account modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingAccount(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Edit account</h3>
            <div className="space-y-3">
              <label className="label-text block">Account name</label>
              <input value={editForm.name} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Institution</label>
              <input value={editForm.institution} onChange={e => setEditForm((f: any) => ({ ...f, institution: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Current balance (£)</label>
              <input type="number" step="0.01" value={editForm.balance} onChange={e => setEditForm((f: any) => ({ ...f, balance: parseFloat(e.target.value) }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Type</label>
              <input value={editingAccount.type.replace('_', ' ')} readOnly className="w-full border rounded-xl px-4 py-2.5 text-sm bg-muted text-muted-foreground" />
              <div>
                <label className="label-text block mb-1.5">Colour</label>
                <div className="flex gap-2">
                  {colours.map(c => (
                    <button key={c} onClick={() => setEditForm((f: any) => ({ ...f, colour: c }))} className={`w-8 h-8 rounded-full border-2 ${editForm.colour === c ? 'border-foreground' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditingAccount(null)} className="flex-1">Cancel</Button>
                <Button className="flex-1" onClick={async () => {
                  if (demo) { toast.success('Account updated (demo)'); setEditingAccount(null); return; }
                  await updateAccount.mutateAsync({ id: editingAccount.id, ...editForm });
                  toast.success('Account updated'); setEditingAccount(null);
                }}>Save changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete account confirmation */}
      {deletingAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setDeletingAccount(null); setDeleteConfirmName(''); }}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-2">Delete account?</h3>
            <p className="text-sm text-muted-foreground mb-3">This will permanently delete <strong>{deletingAccount.name}</strong> and all its transactions. This cannot be undone.</p>
            <label className="label-text block mb-1.5">Type "{deletingAccount.name}" to confirm</label>
            <input value={deleteConfirmName} onChange={e => setDeleteConfirmName(e.target.value)} placeholder={deletingAccount.name} className="w-full border rounded-xl px-4 py-2.5 text-sm mb-4 bg-background" />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setDeletingAccount(null); setDeleteConfirmName(''); }} className="flex-1">Cancel</Button>
              <Button variant="destructive" className="flex-1" disabled={deleteConfirmName !== deletingAccount.name} onClick={async () => {
                if (demo) { toast.success('Account deleted (demo)'); setDeletingAccount(null); setDeleteConfirmName(''); return; }
                await deleteAccount.mutateAsync(deletingAccount.id);
                toast.success('Account deleted'); setDeletingAccount(null); setDeleteConfirmName('');
              }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
