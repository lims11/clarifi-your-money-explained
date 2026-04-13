import { useState, useEffect } from 'react';
import { Plus, Target, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/finance';
import { useGoals, useAccounts, useAddGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/useFinanceData';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const GOAL_ICONS = ['🛡️', '🏠', '🚗', '✈️', '🎓', '💍', '🏥', '💰', '🌍', '🎯', '🏖️', '💻', '🎁'];
const COLOURS = ['#1D9E75', '#7F77DD', '#EF9F27', '#D85A30', '#378ADD', '#E24B4A'];

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const { data: accounts } = useAccounts();
  const addGoal = useAddGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const demo = useDemoMode();
  const [showAdd, setShowAdd] = useState(false);
  const [showFund, setShowFund] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', target_amount: '', current_amount: '0', target_date: '', colour: '#1D9E75', icon: '🎯' });
  const [fundAmount, setFundAmount] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [deletingGoal, setDeletingGoal] = useState<any>(null);

  useEffect(() => {
    const handleClick = () => setMenuOpen(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const savingsAccounts = accounts?.filter(a => a.type === 'savings' || a.type === 'current') || [];

  if (isLoading) return <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-4"><Skeleton className="h-8 w-32" /><Skeleton className="h-32 rounded-2xl" /></div>;

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Savings goals</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add goal</Button>
      </div>

      {(!goals || goals.length === 0) ? (
        <div className="sonfi-card text-center py-12"><p className="text-lg font-medium mb-2">No goals yet</p><p className="text-sm text-muted-foreground mb-4">Set your first savings goal</p><Button onClick={() => setShowAdd(true)}>Add goal</Button></div>
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
              <div key={g.id} className="sonfi-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: (g.colour || '#1D9E75') + '20' }}>
                    {g.icon === 'shield' ? '🛡️' : g.icon === 'home' ? '🏠' : g.icon === 'plane' ? '✈️' : '🎯'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{g.name}</h3>
                    <div className="flex gap-2 items-center">
                      {targetDate && <span className="text-xs text-muted-foreground">Target: {targetDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} ({monthsAway}mo)</span>}
                      <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
                    </div>
                  </div>
                  <span className="text-2xl font-medium" style={{ color: g.colour || '#1D9E75' }}>{pct}%</span>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === g.id ? null : g.id); }} className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                      <MoreHorizontal size={16} />
                    </button>
                    {menuOpen === g.id && (
                      <div className="absolute right-0 top-8 bg-card border rounded-xl shadow-lg z-10 py-1 w-36">
                        <button onClick={() => { setEditingGoal(g); setEditForm({ name: g.name, target_amount: Number(g.target_amount), current_amount: Number(g.current_amount), target_date: g.target_date || '', colour: g.colour || '#1D9E75' }); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors">
                          <Pencil size={12} /> Edit goal
                        </button>
                        <button onClick={() => { setDeletingGoal(g); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-coral hover:bg-coral/5 transition-colors">
                          <Trash2 size={12} /> Delete goal
                        </button>
                      </div>
                    )}
                  </div>
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
              <input placeholder="Goal name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <input placeholder="Target amount (£)" type="number" value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <input placeholder="Already saved (£)" type="number" value={form.current_amount} onChange={e => setForm(f => ({ ...f, current_amount: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <input type="date" value={form.target_date} onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <div>
                <label className="label-text block mb-1.5">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {GOAL_ICONS.map(icon => (
                    <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border-2 ${form.icon === icon ? 'border-primary' : 'border-transparent bg-muted'}`}>{icon}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-text block mb-1.5">Colour</label>
                <div className="flex gap-2">
                  {COLOURS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, colour: c }))} className={`w-8 h-8 rounded-full border-2 ${form.colour === c ? 'border-foreground' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
                <Button className="flex-1" disabled={!form.name || !form.target_amount} onClick={async () => {
                  if (demo) { toast.success('Goal created (demo)'); setShowAdd(false); return; }
                  await addGoal.mutateAsync({ name: form.name, target_amount: parseFloat(form.target_amount), current_amount: parseFloat(form.current_amount) || 0, target_date: form.target_date || undefined, colour: form.colour });
                  toast.success('Goal created'); setShowAdd(false); setForm({ name: '', target_amount: '', current_amount: '0', target_date: '', colour: '#1D9E75', icon: '🎯' });
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
            <h3 className="text-lg font-medium mb-2">Add funds</h3>
            <p className="text-sm text-muted-foreground mb-4">Adding to: {goals?.find(g => g.id === showFund)?.name}</p>
            <input placeholder="Amount (£)" type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm mb-3 bg-background" autoFocus />
            {savingsAccounts.length > 0 && (
              <>
                <label className="label-text block mb-1.5">From account</label>
                <select id="fund-source-account" className="w-full border rounded-xl px-4 py-2.5 text-sm mb-4 bg-background">
                  {savingsAccounts.map(a => <option key={a.id} value={a.id}>{a.name} — {formatCurrency(Number(a.balance))}</option>)}
                </select>
              </>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setShowFund(null)} className="flex-1">Cancel</Button>
              <Button className="flex-1 bg-teal hover:bg-teal/90" disabled={!fundAmount} onClick={async () => {
                const goal = goals?.find(g => g.id === showFund);
                if (!goal) return;
                const amt = parseFloat(fundAmount);
                const newAmount = Number(goal.current_amount) + amt;
                if (demo) {
                  const pct = Math.round((newAmount / Number(goal.target_amount)) * 100);
                  toast.success(`${formatCurrency(amt)} added! You're now ${pct}% there.`);
                  setShowFund(null); setFundAmount(''); return;
                }
                await updateGoal.mutateAsync({ id: showFund!, current_amount: newAmount });
                const pct = Math.round((newAmount / Number(goal.target_amount)) * 100);
                if (pct >= 100) {
                  toast.success(`🎉 Goal complete! You've reached your ${goal.name} target!`);
                } else {
                  toast.success(`${formatCurrency(amt)} added! You're now ${pct}% there.`);
                }
                setShowFund(null); setFundAmount('');
              }}>Add funds</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit goal modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingGoal(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Edit goal</h3>
            <div className="space-y-3">
              <label className="label-text block">Goal name</label>
              <input value={editForm.name} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Target amount (£)</label>
              <input type="number" value={editForm.target_amount} onChange={e => setEditForm((f: any) => ({ ...f, target_amount: parseFloat(e.target.value) }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Current amount (£)</label>
              <input type="number" value={editForm.current_amount} onChange={e => setEditForm((f: any) => ({ ...f, current_amount: parseFloat(e.target.value) }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <label className="label-text block">Target date</label>
              <input type="date" value={editForm.target_date} onChange={e => setEditForm((f: any) => ({ ...f, target_date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              <div>
                <label className="label-text block mb-1.5">Colour</label>
                <div className="flex gap-2">
                  {COLOURS.map(c => (
                    <button key={c} onClick={() => setEditForm((f: any) => ({ ...f, colour: c }))} className={`w-8 h-8 rounded-full border-2 ${editForm.colour === c ? 'border-foreground' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditingGoal(null)} className="flex-1">Cancel</Button>
                <Button className="flex-1" onClick={async () => {
                  if (demo) { toast.success('Goal updated (demo)'); setEditingGoal(null); return; }
                  await updateGoal.mutateAsync({ id: editingGoal.id, ...editForm });
                  toast.success('Goal updated'); setEditingGoal(null);
                }}>Save changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete goal confirmation */}
      {deletingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeletingGoal(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-2">Delete goal?</h3>
            <p className="text-sm text-muted-foreground mb-4">This will permanently delete <strong>{deletingGoal.name}</strong>. Your linked transactions won't be affected.</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDeletingGoal(null)} className="flex-1">Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={async () => {
                if (demo) { toast.success('Goal deleted (demo)'); setDeletingGoal(null); return; }
                await deleteGoal.mutateAsync(deletingGoal.id);
                toast.success('Goal deleted'); setDeletingGoal(null);
              }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
