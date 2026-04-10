import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/finance';
import { useGoals, useAddGoal, useUpdateGoal } from '@/hooks/useFinanceData';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const addGoal = useAddGoal();
  const updateGoal = useUpdateGoal();
  const [showAdd, setShowAdd] = useState(false);
  const [showFund, setShowFund] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', target_amount: '', current_amount: '0', target_date: '', colour: '#1D9E75' });
  const [fundAmount, setFundAmount] = useState('');

  if (isLoading) return <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-4"><Skeleton className="h-8 w-32" /><Skeleton className="h-32 rounded-2xl" /></div>;

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Savings goals</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add goal</Button>
      </div>

      {(!goals || goals.length === 0) ? (
        <div className="clarifi-card text-center py-12"><p className="text-lg font-medium mb-2">No goals yet</p><p className="text-sm text-muted-foreground mb-4">Set your first savings goal</p><Button onClick={() => setShowAdd(true)}>Add goal</Button></div>
      ) : (
        <div className="space-y-4">
          {goals.map(g => {
            const pct = Number(g.target_amount) > 0 ? Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100) : 0;
            const remaining = Number(g.target_amount) - Number(g.current_amount);
            const targetDate = g.target_date ? new Date(g.target_date) : null;
            const monthsAway = targetDate ? Math.max(0, Math.round((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))) : null;
            const monthlyNeeded = monthsAway && monthsAway > 0 ? remaining / monthsAway : remaining;
            const status = pct >= 100 ? 'Complete' : monthsAway && monthlyNeeded <= 600 ? 'On track' : 'Behind';
            const statusColor = status === 'Complete' || status === 'On track' ? 'text-teal' : 'text-amber';

            return (
              <div key={g.id} className="clarifi-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: (g.colour || '#1D9E75') + '20' }}>
                    <Target size={24} style={{ color: g.colour || '#1D9E75' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{g.name}</h3>
                    <div className="flex gap-2 items-center">
                      {targetDate && <span className="text-xs text-muted-foreground">Target: {targetDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} ({monthsAway}mo)</span>}
                      <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
                    </div>
                  </div>
                  <span className="text-2xl font-medium" style={{ color: g.colour || '#1D9E75' }}>{pct}%</span>
                </div>

                <div className="relative h-4 rounded-full bg-muted overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: g.colour || '#1D9E75' }} />
                  {[25, 50, 75].map(m => <div key={m} className="absolute top-0 h-full w-px bg-background/50" style={{ left: `${m}%` }} />)}
                </div>

                <div className="flex justify-between text-sm mb-3">
                  <span>{formatCurrency(Number(g.current_amount))} of {formatCurrency(Number(g.target_amount))}</span>
                  <span className="text-muted-foreground">{formatCurrency(remaining)} remaining</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t text-xs">
                  <div className="space-y-1 text-muted-foreground">
                    <p>{formatCurrency(monthlyNeeded)}/month needed</p>
                    {monthsAway && monthlyNeeded <= 600 && <p className="text-teal">At ~£600/mo: {monthsAway > 0 ? `done in ~${Math.ceil(remaining / 600)} months` : 'on target'}</p>}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setShowFund(g.id)}>Add funds</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add goal modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Add goal</h3>
            <div className="space-y-3">
              <input placeholder="Goal name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              <input placeholder="Target amount (£)" type="number" value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              <input placeholder="Already saved (£)" type="number" value={form.current_amount} onChange={e => setForm(f => ({ ...f, current_amount: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              <input type="date" value={form.target_date} onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
                <Button className="flex-1" disabled={!form.name || !form.target_amount} onClick={async () => {
                  await addGoal.mutateAsync({ name: form.name, target_amount: parseFloat(form.target_amount), current_amount: parseFloat(form.current_amount) || 0, target_date: form.target_date || undefined, colour: form.colour });
                  toast.success('Goal created'); setShowAdd(false); setForm({ name: '', target_amount: '', current_amount: '0', target_date: '', colour: '#1D9E75' });
                }}>Add goal</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fund modal */}
      {showFund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFund(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Add funds</h3>
            <input placeholder="Amount (£)" type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm mb-4" />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setShowFund(null)} className="flex-1">Cancel</Button>
              <Button className="flex-1" disabled={!fundAmount} onClick={async () => {
                const goal = goals?.find(g => g.id === showFund);
                if (!goal) return;
                const newAmount = Number(goal.current_amount) + parseFloat(fundAmount);
                await updateGoal.mutateAsync({ id: showFund!, current_amount: newAmount });
                const pct = Math.round((newAmount / Number(goal.target_amount)) * 100);
                toast.success(`${formatCurrency(parseFloat(fundAmount))} added! You're now ${pct}% there.`);
                setShowFund(null); setFundAmount('');
              }}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
