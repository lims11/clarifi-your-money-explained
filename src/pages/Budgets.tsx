import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, categoryIcons } from '@/lib/finance';
import { useBudgets, useMonthTransactions, useAddBudget, useUpdateBudget, useDeleteBudget } from '@/hooks/useFinanceData';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CATEGORIES = ['Food & Drink', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Travel', 'Personal', 'Education'];

export default function BudgetsPage() {
  const { data: budgets, isLoading } = useBudgets();
  const { data: transactions } = useMonthTransactions();
  const addBudget = useAddBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const demo = useDemoMode();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Food & Drink', amount: '', period: 'monthly', colour: '#7F77DD' });
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [deletingBudget, setDeletingBudget] = useState<any>(null);

  useEffect(() => {
    const handleClick = () => setMenuOpen(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const spendByCategory = (transactions || []).filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(Number(t.amount));
    return acc;
  }, {} as Record<string, number>);

  const budgetsWithSpend = (budgets || []).map(b => {
    const spent = spendByCategory[b.category] || 0;
    const pct = Number(b.amount) > 0 ? Math.round((spent / Number(b.amount)) * 100) : 0;
    return { ...b, spent, remaining: Number(b.amount) - spent, pct };
  });

  const onTrack = budgetsWithSpend.filter(b => b.pct < 80).length;
  const overBudget = budgetsWithSpend.filter(b => b.pct >= 100).length;
  const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
  const chartData = budgetsWithSpend.map(b => ({ name: b.name, Budget: Number(b.amount), Spent: b.spent }));

  if (isLoading) return <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-4"><Skeleton className="h-8 w-32" /><Skeleton className="h-48 rounded-2xl" /></div>;

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Budgets</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add budget</Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="clarifi-card text-center"><p className="text-2xl font-medium text-teal">{onTrack}</p><p className="label-text mt-1">On track</p></div>
        <div className="clarifi-card text-center"><p className="text-2xl font-medium text-coral">{overBudget}</p><p className="label-text mt-1">Over budget</p></div>
        <div className="clarifi-card text-center"><p className="text-2xl font-medium text-muted-foreground">{daysLeft}</p><p className="label-text mt-1">Days left</p></div>
      </div>

      {chartData.length > 0 && (
        <div className="clarifi-card mb-6">
          <h2 className="text-sm font-medium mb-4">Budget vs Spent</h2>
          <div className="h-48"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tickFormatter={v => `£${v}`} tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => formatCurrency(v)} /><Bar dataKey="Budget" fill="#7F77DD" opacity={0.3} radius={[4,4,0,0]} /><Bar dataKey="Spent" fill="#7F77DD" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer></div>
        </div>
      )}

      {budgetsWithSpend.length === 0 ? (
        <div className="clarifi-card text-center py-12"><p className="text-lg font-medium mb-2">No budgets yet</p><p className="text-sm text-muted-foreground mb-4">Create your first budget to track spending</p><Button onClick={() => setShowAdd(true)}>Add budget</Button></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {budgetsWithSpend.map(b => {
            const barColor = b.pct >= 100 ? 'bg-coral' : b.pct >= 80 ? 'bg-amber' : b.pct >= 50 ? 'bg-primary' : 'bg-teal';
            const projected = daysLeft > 0 ? (b.spent / (new Date().getDate())) * new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() : b.spent;
            return (
              <div key={b.id} className="clarifi-card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{categoryIcons[b.category] || '📊'}</span>
                  <h3 className="text-sm font-medium flex-1">{b.name}</h3>
                  <span className="text-xs text-muted-foreground">{daysLeft}d left</span>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === b.id ? null : b.id); }} className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                      <MoreHorizontal size={16} />
                    </button>
                    {menuOpen === b.id && (
                      <div className="absolute right-0 top-8 bg-card border rounded-xl shadow-lg z-10 py-1 w-36">
                        <button onClick={() => { setEditingBudget(b); setEditForm({ name: b.name, category: b.category, amount: Number(b.amount), period: b.period }); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors">
                          <Pencil size={12} /> Edit budget
                        </button>
                        <button onClick={() => { setDeletingBudget(b); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-coral hover:bg-coral/5 transition-colors">
                          <Trash2 size={12} /> Delete budget
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden mb-2">
                  <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(b.pct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{formatCurrency(b.spent)} of {formatCurrency(Number(b.amount))}</span>
                  <span className={b.pct >= 100 ? 'amount-negative' : 'text-muted-foreground'}>{b.pct}%</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Avg: {formatCurrency(b.spent / Math.max(1, new Date().getDate()))}/day</span>
                  <span>Projected: {formatCurrency(projected)}</span>
                </div>
                <p className="text-xs text-primary">{b.pct < 50 ? "You're on track — keep it up!" : b.pct < 80 ? `${formatCurrency(b.remaining)} left for the rest of the month.` : b.pct >= 100 ? `Over budget by ${formatCurrency(Math.abs(b.remaining))}` : `⚠ Tracking to overspend by ${formatCurrency(projected - Number(b.amount))}`}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Add budget modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Add budget</h3>
            <div className="space-y-3">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, name: f.name || e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="Budget name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <input placeholder="Amount (£)" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <div className="flex gap-2">
                {['monthly', 'annual'].map(p => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, period: p }))} className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${form.period === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
                <Button className="flex-1" disabled={!form.name || !form.amount} onClick={async () => {
                  if (demo) { toast.success('Budget created (demo)'); setShowAdd(false); return; }
                  await addBudget.mutateAsync({ name: form.name, category: form.category, amount: parseFloat(form.amount), period: form.period, colour: form.colour });
                  toast.success('Budget created'); setShowAdd(false); setForm({ name: '', category: 'Food & Drink', amount: '', period: 'monthly', colour: '#7F77DD' });
                }}>Add</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit budget modal */}
      {editingBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingBudget(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Edit budget</h3>
            <div className="space-y-3">
              <label className="label-text block">Budget name</label>
              <input value={editForm.name} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Category</label>
              <select value={editForm.category} onChange={e => setEditForm((f: any) => ({ ...f, category: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label className="label-text block">Amount (£)</label>
              <input type="number" value={editForm.amount} onChange={e => setEditForm((f: any) => ({ ...f, amount: parseFloat(e.target.value) }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <div className="flex gap-2">
                {['monthly', 'annual'].map(p => (
                  <button key={p} onClick={() => setEditForm((f: any) => ({ ...f, period: p }))} className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${editForm.period === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditingBudget(null)} className="flex-1">Cancel</Button>
                <Button className="flex-1" onClick={async () => {
                  if (demo) { toast.success('Budget updated (demo)'); setEditingBudget(null); return; }
                  await updateBudget.mutateAsync({ id: editingBudget.id, ...editForm });
                  toast.success('Budget updated'); setEditingBudget(null);
                }}>Save changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete budget confirmation */}
      {deletingBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeletingBudget(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-2">Delete budget?</h3>
            <p className="text-sm text-muted-foreground mb-4">This will permanently delete the <strong>{deletingBudget.name}</strong> budget. Your transactions won't be affected.</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDeletingBudget(null)} className="flex-1">Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={async () => {
                if (demo) { toast.success('Budget deleted (demo)'); setDeletingBudget(null); return; }
                await deleteBudget.mutateAsync(deletingBudget.id);
                toast.success('Budget deleted'); setDeletingBudget(null);
              }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
