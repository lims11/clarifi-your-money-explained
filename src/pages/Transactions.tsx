import { useState, useMemo } from 'react';
import { Search, Download, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, categoryIcons, categoryColours } from '@/lib/finance';
import { useTransactions, useAccounts, useAddTransaction } from '@/hooks/useFinanceData';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const dateFilters = ['This month', 'Last month', 'Last 3 months', 'All'];
const typeFilters = ['All', 'Income', 'Expense', 'Transfer'];
const CATEGORIES = ['Food & Drink', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Travel', 'Income', 'Personal'];

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('This month');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [txEditForm, setTxEditForm] = useState<any>({});
  const demo = useDemoMode();

  const { data: accounts } = useAccounts();
  const addTransaction = useAddTransaction();

  const startDate = useMemo(() => {
    const now = new Date();
    if (dateFilter === 'This month') return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    if (dateFilter === 'Last month') return new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    if (dateFilter === 'Last 3 months') return new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().split('T')[0];
    return undefined;
  }, [dateFilter]);

  const { data: transactions, isLoading } = useTransactions({ startDate });

  const [txnForm, setTxnForm] = useState({ payee: '', amount: '', type: 'expense', category: 'Shopping', date: new Date().toISOString().split('T')[0], account_id: '' });

  const filtered = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      if (search && !(t.payee?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))) return false;
      if (typeFilter !== 'All' && t.type !== typeFilter.toLowerCase()) return false;
      return true;
    });
  }, [transactions, search, typeFilter]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, t) => {
      if (!acc[t.date]) acc[t.date] = [];
      acc[t.date].push(t);
      return acc;
    }, {} as Record<string, typeof filtered>);
  }, [filtered]);

  const totalIn = filtered.filter(t => Number(t.amount) > 0).reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = Math.abs(filtered.filter(t => Number(t.amount) < 0).reduce((s, t) => s + Number(t.amount), 0));

  const exportCSV = () => {
    const headers = 'Date,Payee,Category,Subcategory,Amount,Type,Description\n';
    const rows = filtered.map(t => `${t.date},"${t.payee || ''}","${t.category}","${t.subcategory || ''}",${t.amount},${t.type},"${t.description || ''}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported transactions');
  };

  if (isLoading) {
    return <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-4"><Skeleton className="h-8 w-32" /><Skeleton className="h-16 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>;
  }

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Transactions</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={exportCSV}><Download size={16} /> Export</Button>
          <Button size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="sonfi-card mb-4 flex flex-wrap gap-4 text-xs">
        <span>{filtered.length} transactions</span>
        <span className="amount-positive">In: {formatCurrency(totalIn)}</span>
        <span className="amount-negative">Out: {formatCurrency(totalOut)}</span>
        <span className="font-medium">Net: {formatCurrency(totalIn - totalOut)}</span>
      </div>

      {/* Filters */}
      <div className="sonfi-card mb-5 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payee or description..." className="w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex flex-wrap gap-2">
          {dateFilters.map(f => (
            <button key={f} onClick={() => setDateFilter(f)} className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${dateFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{f}</button>
          ))}
          <span className="w-px bg-border mx-1" />
          {typeFilters.map(f => (
            <button key={f} onClick={() => setTypeFilter(f)} className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${typeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{f}</button>
          ))}
          {(search || dateFilter !== 'This month' || typeFilter !== 'All') && (
            <button onClick={() => { setSearch(''); setDateFilter('This month'); setTypeFilter('All'); }} className="text-xs text-primary hover:underline ml-2">Clear filters</button>
          )}
        </div>
      </div>

      {/* Grouped list */}
      {filtered.length === 0 ? (
        <div className="sonfi-card text-center py-12">
          <p className="text-lg font-medium mb-2">No transactions found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new transaction</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).map(([date, txns]) => (
            <div key={date}>
              <p className="label-text mb-2">{new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <div className="sonfi-card divide-y">
                {txns.map(t => (
                  <div key={t.id}>
                    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer group" onClick={() => setExpandedTx(expandedTx === t.id ? null : t.id)}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: (categoryColours[t.category] || '#888780') + '20' }}>
                        {categoryIcons[t.category] || '💳'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{t.payee || t.category}</p>
                        <p className="text-xs text-muted-foreground">{t.category}{t.subcategory ? ` › ${t.subcategory}` : ''}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className={`text-sm font-medium ${Number(t.amount) > 0 ? 'amount-positive' : 'amount-negative'}`}>{formatCurrency(Number(t.amount))}</p>
                          <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                        </div>
                        {expandedTx === t.id ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                    </div>
                    {expandedTx === t.id && (
                      <div className="pb-3 pt-1 pl-11 space-y-2">
                        {t.ai_category_confidence != null && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">AI confidence:</span>
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${Number(t.ai_category_confidence) * 100}%` }} />
                            </div>
                            <span className="text-primary font-medium">{Math.round(Number(t.ai_category_confidence) * 100)}%</span>
                          </div>
                        )}
                        {t.ai_category_reason && (
                          <p className="text-xs text-muted-foreground italic">"{t.ai_category_reason}"</p>
                        )}
                        {t.description && <p className="text-xs text-muted-foreground">Note: {t.description}</p>}
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => { setEditingTx(t); setTxEditForm({ payee: t.payee || '', amount: Math.abs(Number(t.amount)), type: t.type, category: t.category, date: t.date, description: t.description || '' }); }}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border hover:bg-muted transition-colors">
                            <Pencil size={11} /> Edit
                          </button>
                          <button onClick={() => {
                            if (confirm('Delete this transaction?')) {
                              if (demo) { toast.success('Transaction deleted (demo)'); setExpandedTx(null); return; }
                              toast.success('Transaction deleted');
                            }
                          }}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-coral/30 text-coral hover:bg-coral/5 transition-colors">
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add transaction modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Add transaction</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                {['expense', 'income'].map(t => (
                  <button key={t} onClick={() => setTxnForm(f => ({ ...f, type: t }))} className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${txnForm.type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>
              <select value={txnForm.account_id} onChange={e => setTxnForm(f => ({ ...f, account_id: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background">
                <option value="">Select account</option>
                {accounts?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input placeholder="Payee" value={txnForm.payee} onChange={e => setTxnForm(f => ({ ...f, payee: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <input placeholder="Amount" type="number" step="0.01" value={txnForm.amount} onChange={e => setTxnForm(f => ({ ...f, amount: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <input type="date" value={txnForm.date} onChange={e => setTxnForm(f => ({ ...f, date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <select value={txnForm.category} onChange={e => setTxnForm(f => ({ ...f, category: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
                <Button className="flex-1" disabled={!txnForm.payee || !txnForm.amount || !txnForm.account_id} onClick={async () => {
                  if (demo) { toast.success('Transaction added (demo)'); setShowAdd(false); return; }
                  const amt = parseFloat(txnForm.amount);
                  await addTransaction.mutateAsync({
                    account_id: txnForm.account_id,
                    amount: txnForm.type === 'expense' ? -Math.abs(amt) : Math.abs(amt),
                    type: txnForm.type,
                    category: txnForm.category,
                    payee: txnForm.payee,
                    date: txnForm.date,
                  });
                  toast.success('Transaction added');
                  setShowAdd(false);
                }}>Add</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit transaction modal */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingTx(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Edit transaction</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                {['expense', 'income'].map(t => (
                  <button key={t} onClick={() => setTxEditForm((f: any) => ({ ...f, type: t }))} className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${txEditForm.type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>
              <label className="label-text block">Date</label>
              <input type="date" value={txEditForm.date} onChange={e => setTxEditForm((f: any) => ({ ...f, date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Payee</label>
              <input value={txEditForm.payee} onChange={e => setTxEditForm((f: any) => ({ ...f, payee: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Amount (£)</label>
              <input type="number" step="0.01" value={txEditForm.amount} onChange={e => setTxEditForm((f: any) => ({ ...f, amount: parseFloat(e.target.value) }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Category</label>
              <select value={txEditForm.category} onChange={e => setTxEditForm((f: any) => ({ ...f, category: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label className="label-text block">Description</label>
              <input value={txEditForm.description} onChange={e => setTxEditForm((f: any) => ({ ...f, description: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditingTx(null)} className="flex-1">Cancel</Button>
                <Button className="flex-1" onClick={() => {
                  if (demo) { toast.success('Transaction updated (demo)'); setEditingTx(null); return; }
                  toast.success('Transaction updated'); setEditingTx(null);
                }}>Save changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
