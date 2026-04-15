import { useState, useEffect, useMemo } from 'react';
import { Plus, MoreHorizontal, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, categoryIcons } from '@/lib/finance';
import { useBudgets, useTransactions, useAddBudget, useUpdateBudget, useDeleteBudget } from '@/hooks/useFinanceData';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

function DataSourceBadge({ source }: { source: 'statement' | 'manual' | 'mixed' }) {
  const config = {
    statement: { label: 'From statement', icon: '📄', cls: 'bg-teal/10 text-teal border-teal/20' },
    manual: { label: 'Manual entries', icon: '✏️', cls: 'bg-amber/10 text-amber border-amber/20' },
    mixed: { label: 'Statement + manual', icon: '🔀', cls: 'bg-primary/10 text-primary border-primary/20' },
  };
  const c = config[source];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${c.cls}`}>
      {c.icon} {c.label}
    </span>
  );
}

const CATEGORIES = ['Food & Drink', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Travel', 'Personal', 'Education'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = [
  'hsl(var(--primary))', '#1D9E75', '#EF9F27', '#D85A30', '#534AB7',
  '#7F77DD', '#00AEEF', '#FF3464', '#117ACA', '#961A1A',
];

function getMonthRange(year: number, month: number) {
  const start = new Date(year, month, 1).toISOString().split('T')[0];
  const end = new Date(year, month + 1, 0).toISOString().split('T')[0];
  return { start, end };
}

export default function BudgetsPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const { data: budgets, isLoading } = useBudgets();
  const { data: allTransactions } = useTransactions();
  const addBudget = useAddBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const demo = useDemoMode();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
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

  const isCurrentMonth = selectedMonth === currentMonth;
  const { start: monthStart, end: monthEnd } = getMonthRange(currentYear, selectedMonth);
  const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
  const dayOfMonth = isCurrentMonth ? now.getDate() : daysInMonth;
  const daysLeft = isCurrentMonth ? daysInMonth - dayOfMonth : 0;

  // Filter transactions for selected month
  const monthTransactions = useMemo(() =>
    (allTransactions || []).filter(t => t.date >= monthStart && t.date <= monthEnd),
    [allTransactions, monthStart, monthEnd]
  );

  const incomeTransactions = monthTransactions.filter(t => t.type === 'income');
  const expenseTransactions = monthTransactions.filter(t => t.type === 'expense');
  const totalIncome = incomeTransactions.reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
  const totalExpenses = expenseTransactions.reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  const spendByCategory = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(Number(t.amount));
    return acc;
  }, {} as Record<string, number>);

  const incomeByCategory = incomeTransactions.reduce((acc, t) => {
    const cat = t.subcategory || t.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Math.abs(Number(t.amount));
    return acc;
  }, {} as Record<string, number>);

  const budgetsWithSpend = (budgets || []).map(b => {
    const spent = spendByCategory[b.category] || 0;
    const pct = Number(b.amount) > 0 ? Math.round((spent / Number(b.amount)) * 100) : 0;
    return { ...b, spent, remaining: Number(b.amount) - spent, pct };
  });

  const totalPlannedExpenses = budgetsWithSpend.reduce((s, b) => s + Number(b.amount), 0);
  const onTrack = budgetsWithSpend.filter(b => b.pct < 80).length;
  const overBudget = budgetsWithSpend.filter(b => b.pct >= 100).length;

  // Savings
  const savedAmount = totalIncome - totalExpenses;
  const savingsPercent = totalIncome > 0 ? Math.round((savedAmount / totalIncome) * 100) : 0;

  // Pie data for expenses
  const expensePieData = Object.entries(spendByCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Month tabs (Jan → current month)
  const months = MONTH_NAMES.slice(0, currentMonth + 1);

  if (isLoading) return <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-4"><Skeleton className="h-8 w-32" /><Skeleton className="h-48 rounded-2xl" /></div>;

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Budgets</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add budget</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="sonfi-card text-center"><p className="text-2xl font-medium text-teal">{onTrack}</p><p className="label-text mt-1">On track</p></div>
        <div className="sonfi-card text-center"><p className="text-2xl font-medium text-coral">{overBudget}</p><p className="label-text mt-1">Over budget</p></div>
        <div className="sonfi-card text-center"><p className="text-2xl font-medium text-muted-foreground">{isCurrentMonth ? daysLeft : '—'}</p><p className="label-text mt-1">{isCurrentMonth ? 'Days left' : 'Completed'}</p></div>
      </div>

      {/* Spending Breakdown donut */}
      {expensePieData.length > 0 && (
        <div className="sonfi-card mb-6">
          <h2 className="text-sm font-medium mb-4">{MONTH_NAMES[selectedMonth]} Spending Breakdown</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-52 w-52 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expensePieData} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {expensePieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
              {expensePieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="truncate flex-1">{d.name}</span>
                  <span className="font-medium">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Monthly income</p>
              <p className="text-lg font-bold text-teal">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Savings amount</p>
              <p className={`text-lg font-bold ${savedAmount >= 0 ? 'text-teal' : 'text-coral'}`}>{formatCurrency(savedAmount)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Month navigation */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {months.map((m, i) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(i)}
            className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
              selectedMonth === i
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Monthly overview — Start/End Balance & Savings */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Planned vs Actual bars */}
        <div className="sonfi-card">
          <h2 className="text-sm font-medium mb-4">
            {MONTH_NAMES[selectedMonth]} — {isCurrentMonth ? 'Planned vs Actual' : 'Planned vs Spent'}
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Expenses */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Expenses</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Planned</span>
                    <span>{formatCurrency(totalPlannedExpenses)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary/30" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{isCurrentMonth ? 'Actual' : 'Spent'}</span>
                    <span>{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${totalExpenses > totalPlannedExpenses ? 'bg-coral' : 'bg-primary'}`}
                      style={{ width: `${totalPlannedExpenses > 0 ? Math.min((totalExpenses / totalPlannedExpenses) * 100, 100) : 0}%` }} />
                  </div>
                </div>
              </div>
              {totalExpenses > totalPlannedExpenses && (
                <p className="text-xs text-coral mt-2">Over by {formatCurrency(totalExpenses - totalPlannedExpenses)}</p>
              )}
            </div>
            {/* Income */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Income</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Planned</span>
                    <span>{formatCurrency(totalIncome)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-teal/30" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{isCurrentMonth ? 'Actual' : 'Received'}</span>
                    <span>{formatCurrency(totalIncome)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-teal" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings card */}
        <div className="sonfi-card flex flex-col items-center justify-center text-center">
          <p className={`text-3xl font-bold ${savedAmount >= 0 ? 'text-teal' : 'text-coral'}`}>
            {savedAmount >= 0 ? '+' : ''}{savingsPercent}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">{savedAmount >= 0 ? 'Increase in savings' : 'Overspent'}</p>
          <div className="border-t border-dashed border-border my-3 w-2/3" />
          <p className={`text-2xl font-bold ${savedAmount >= 0 ? 'text-teal' : 'text-coral'}`}>
            {formatCurrency(Math.abs(savedAmount))}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{savedAmount >= 0 ? 'Saved this month' : 'Deficit this month'}</p>
        </div>
      </div>

      {/* Side-by-side breakdown: Expenses & Income */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Expenses breakdown */}
        <div className="sonfi-card">
          <h2 className="text-sm font-medium mb-3 text-coral">Expenses</h2>
          <div className="border-b border-border pb-2 mb-2 flex justify-between text-xs text-muted-foreground font-medium">
            <span>Category</span>
            <div className="flex gap-6">
              <span className="w-16 text-right">Planned</span>
              <span className="w-16 text-right">{isCurrentMonth ? 'Actual' : 'Spent'}</span>
              <span className="w-14 text-right">Diff.</span>
            </div>
          </div>
          {budgetsWithSpend.length > 0 ? budgetsWithSpend.map(b => {
            const diff = Number(b.amount) - b.spent;
            return (
              <div key={b.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-base">{categoryIcons[b.category] || '📊'}</span>
                  <span className="truncate max-w-[100px]">{b.category}</span>
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-4">
                    <button className="w-16 text-right text-muted-foreground hover:text-primary group" title="Edit planned">{formatCurrency(Number(b.amount))} <Pencil size={8} className="inline opacity-0 group-hover:opacity-100" /></button>
                    <button className="w-16 text-right hover:text-primary group" title="Edit actual">{formatCurrency(b.spent)} <Pencil size={8} className="inline opacity-0 group-hover:opacity-100" /></button>
                    <span className={`w-14 text-right font-medium ${diff >= 0 ? 'text-teal' : 'text-coral'}`}>
                      {diff >= 0 ? '' : '-'}{formatCurrency(Math.abs(diff))}
                    </span>
                  </div>
                  <span className={`w-3 text-center ${diff >= 0 ? 'text-teal' : 'text-coral'}`}>{diff >= 0 ? '🟢' : '🔴'}</span>
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No budgets set</p>
          )}
          <div className="flex justify-between items-center pt-3 mt-2 border-t border-border text-sm font-medium">
            <span>Total</span>
            <div className="flex gap-6">
              <span className="w-16 text-right">{formatCurrency(totalPlannedExpenses)}</span>
              <span className="w-16 text-right">{formatCurrency(totalExpenses)}</span>
              <span className={`w-14 text-right ${totalPlannedExpenses - totalExpenses >= 0 ? 'text-teal' : 'text-coral'}`}>
                {totalPlannedExpenses - totalExpenses >= 0 ? '' : '-'}{formatCurrency(Math.abs(totalPlannedExpenses - totalExpenses))}
              </span>
            </div>
          </div>
        </div>

        {/* Income breakdown */}
        <div className="sonfi-card">
          <h2 className="text-sm font-medium mb-3 text-teal">Income</h2>
          <div className="border-b border-border pb-2 mb-2 flex justify-between text-xs text-muted-foreground font-medium">
            <span>Source</span>
            <div className="flex gap-6">
              <span className="w-16 text-right">Planned</span>
              <span className="w-16 text-right">{isCurrentMonth ? 'Actual' : 'Received'}</span>
              <span className="w-14 text-right">Diff.</span>
            </div>
          </div>
          {Object.entries(incomeByCategory).length > 0 ? Object.entries(incomeByCategory).map(([cat, amount]) => (
            <div key={cat} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 text-sm">
              <span className="flex items-center gap-2">
                <span className="text-base">💰</span>
                <span className="truncate max-w-[120px]">{cat}</span>
              </span>
              <div className="flex gap-6">
                <span className="w-16 text-right text-muted-foreground">{formatCurrency(amount)}</span>
                <span className="w-16 text-right">{formatCurrency(amount)}</span>
                <span className="w-14 text-right text-teal">{formatCurrency(0)}</span>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No income recorded</p>
          )}
          <div className="flex justify-between items-center pt-3 mt-2 border-t border-border text-sm font-medium">
            <span>Total</span>
            <div className="flex gap-6">
              <span className="w-16 text-right">{formatCurrency(totalIncome)}</span>
              <span className="w-16 text-right">{formatCurrency(totalIncome)}</span>
              <span className="w-14 text-right text-teal">{formatCurrency(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget cards */}
      {budgetsWithSpend.length === 0 ? (
        <div className="sonfi-card text-center py-12"><p className="text-lg font-medium mb-2">No budgets yet</p><p className="text-sm text-muted-foreground mb-4">Create your first budget to track spending</p><Button onClick={() => setShowAdd(true)}>Add budget</Button></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {budgetsWithSpend.map(b => {
            const barColor = b.pct >= 100 ? 'bg-coral' : b.pct >= 80 ? 'bg-amber' : b.pct >= 50 ? 'bg-primary' : 'bg-teal';
            const projected = daysLeft > 0 ? (b.spent / Math.max(1, dayOfMonth)) * daysInMonth : b.spent;
            return (
              <div key={b.id} className="sonfi-card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{categoryIcons[b.category] || '📊'}</span>
                  <h3 className="text-sm font-medium flex-1">{b.name}</h3>
                  {isCurrentMonth && <span className="text-xs text-muted-foreground">{daysLeft}d left</span>}
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
                {isCurrentMonth && (
                  <>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Avg: {formatCurrency(b.spent / Math.max(1, dayOfMonth))}/day</span>
                      <span>Projected: {formatCurrency(projected)}</span>
                    </div>
                    <p className="text-xs text-primary">{b.pct < 50 ? "You're on track — keep it up!" : b.pct < 80 ? `${formatCurrency(b.remaining)} left for the rest of the month.` : b.pct >= 100 ? `Over budget by ${formatCurrency(Math.abs(b.remaining))}` : `⚠ Tracking to overspend by ${formatCurrency(projected - Number(b.amount))}`}</p>
                  </>
                )}
                {/* Data source footer */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-dashed">
                  <DataSourceBadge source={b.spent > 0 ? 'mixed' : 'manual'} />
                  <button className="text-[11px] text-primary hover:underline" onClick={() => toast.info('Edit spending data coming soon')}>
                    Edit spending data
                  </button>
                </div>
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
