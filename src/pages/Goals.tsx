import { useState, useEffect } from 'react';
import { Plus, Target, MoreHorizontal, Pencil, Trash2, TrendingUp, Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/finance';
import { useGoals, useAccounts, useAddGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/useFinanceData';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { UpcomingBadge } from '@/components/UpcomingBadge';

const GOAL_TYPES = [
  { id: 'house', icon: '🏠', label: 'House deposit' },
  { id: 'holiday', icon: '✈️', label: 'Holiday fund' },
  { id: 'car', icon: '🚗', label: 'Car purchase' },
  { id: 'education', icon: '🎓', label: 'Education/uni' },
  { id: 'wedding', icon: '💍', label: 'Wedding' },
  { id: 'emergency', icon: '🛡️', label: 'Emergency fund' },
  { id: 'tech', icon: '📱', label: 'Tech purchase' },
  { id: 'retirement', icon: '🏖️', label: 'Retirement pot' },
  { id: 'custom', icon: '✏️', label: 'Custom goal' },
];
const COLOURS = ['#1D9E75', '#7F77DD', '#EF9F27', '#D85A30', '#378ADD', '#E24B4A'];
const PRIORITIES = ['Low', 'Medium', 'High'] as const;

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const { data: accounts } = useAccounts();
  const addGoal = useAddGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const demo = useDemoMode();

  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [goalType, setGoalType] = useState('');
  const [goalIcon, setGoalIcon] = useState('🎯');
  const [form, setForm] = useState({ name: '', target_amount: '', current_amount: '0', target_date: '', colour: '#1D9E75', priority: 'Medium' as typeof PRIORITIES[number] });
  const [linkedAccountId, setLinkedAccountId] = useState('');
  const [reminderFrequency, setReminderFrequency] = useState('monthly');
  const [reminderInApp, setReminderInApp] = useState(true);

  const [showFund, setShowFund] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundNote, setFundNote] = useState('');
  const [fundType, setFundType] = useState<'regular' | 'oneoff'>('oneoff');

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

  const resetAddForm = () => {
    setAddStep(1); setGoalType(''); setGoalIcon('🎯');
    setForm({ name: '', target_amount: '', current_amount: '0', target_date: '', colour: '#1D9E75', priority: 'Medium' });
    setLinkedAccountId(''); setReminderFrequency('monthly'); setReminderInApp(true);
  };

  const targetDate = form.target_date ? new Date(form.target_date) : null;
  const monthsAway = targetDate ? Math.max(0, Math.round((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))) : null;

  if (isLoading) return <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-4"><Skeleton className="h-8 w-32" /><Skeleton className="h-32 rounded-2xl" /></div>;

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Savings goals</h1>
        <Button size="sm" onClick={() => { resetAddForm(); setShowAdd(true); }}><Plus size={16} /> Add goal</Button>
      </div>

      {(!goals || goals.length === 0) ? (
        <div className="sonfi-card text-center py-12">
          <p className="text-lg font-medium mb-2">No goals yet</p>
          <p className="text-sm text-muted-foreground mb-4">Set your first savings goal</p>
          <Button onClick={() => { resetAddForm(); setShowAdd(true); }}>Add goal</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(g => {
            const pct = Number(g.target_amount) > 0 ? Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100) : 0;
            const remaining = Number(g.target_amount) - Number(g.current_amount);
            const gTargetDate = g.target_date ? new Date(g.target_date) : null;
            const gMonthsAway = gTargetDate ? Math.max(0, Math.round((gTargetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))) : null;
            const monthlyNeeded = gMonthsAway && gMonthsAway > 0 ? remaining / gMonthsAway : remaining;
            const status = pct >= 100 ? 'Complete' : gMonthsAway && monthlyNeeded <= 600 ? 'On track' : 'Behind';
            const statusColor = status === 'Complete' || status === 'On track' ? 'text-teal' : 'text-amber';

            // Mock monthly progress data
            const monthlyProgress = [
              { month: 'Jan', amount: 600 },
              { month: 'Feb', amount: 600 },
              { month: 'Mar', amount: 800 },
              { month: 'Apr', amount: 0 },
            ];
            const avgContribution = monthlyProgress.filter(m => m.amount > 0).reduce((s, m) => s + m.amount, 0) / Math.max(1, monthlyProgress.filter(m => m.amount > 0).length);

            return (
              <div key={g.id} className="sonfi-card">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ backgroundColor: (g.colour || '#1D9E75') + '20' }}>
                    {g.icon === 'shield' ? '🛡️' : g.icon === 'home' ? '🏠' : g.icon === 'plane' ? '✈️' : '🎯'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold">{g.name}</h3>
                    <div className="flex gap-2 items-center flex-wrap">
                      {gTargetDate && (
                        <span className="text-xs text-muted-foreground">
                          Target: {gTargetDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} ({gMonthsAway}mo)
                        </span>
                      )}
                      <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold" style={{ color: g.colour || '#1D9E75' }}>{pct}%</span>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === g.id ? null : g.id); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
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

                {/* Progress bar */}
                <div className="relative h-4 rounded-full bg-muted overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: g.colour || '#1D9E75' }} />
                  {[25, 50, 75].map(m => <div key={m} className="absolute top-0 h-full w-px bg-background/50" style={{ left: `${m}%` }} />)}
                </div>

                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium">{formatCurrency(Number(g.current_amount))} <span className="text-muted-foreground font-normal">of {formatCurrency(Number(g.target_amount))}</span></span>
                  <span className="text-muted-foreground">{formatCurrency(remaining)} to go</span>
                </div>

                {/* Monthly progress mini-bars */}
                <div className="border-t pt-3 mb-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Monthly progress</p>
                  <div className="flex gap-2">
                    {monthlyProgress.map(m => (
                      <div key={m.month} className="flex-1">
                        <div className="h-8 bg-muted rounded-md overflow-hidden flex items-end">
                          <div
                            className="w-full rounded-md transition-all"
                            style={{
                              height: `${Math.min((m.amount / 1000) * 100, 100)}%`,
                              backgroundColor: m.amount > 0 ? (g.colour || '#1D9E75') : 'transparent',
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-center mt-1 text-muted-foreground">{m.month}</p>
                        <p className="text-[10px] text-center font-medium">{m.amount > 0 ? `£${m.amount}` : '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats + action */}
                <div className="flex items-center justify-between pt-3 border-t text-xs">
                  <div className="space-y-1 text-muted-foreground">
                    <p className="flex items-center gap-1"><TrendingUp size={11} /> Avg: {formatCurrency(avgContribution)}/month</p>
                    <p className="flex items-center gap-1"><Target size={11} /> Need: {formatCurrency(monthlyNeeded)}/month</p>
                    {pct < 100 && gMonthsAway && avgContribution >= monthlyNeeded && (
                      <p className="text-teal font-medium">✅ You're ahead of schedule</p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => setShowFund(g.id)}>Add funds</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4-step Add Goal Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              {addStep > 1 && (
                <button onClick={() => setAddStep(addStep - 1)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-sm">←</span>
                </button>
              )}
              <div>
                <h3 className="text-lg font-semibold">Add goal</h3>
                <p className="text-xs text-muted-foreground">Step {addStep} of 4</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex gap-1 mb-5">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= addStep ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>

            {/* Step 1: Goal type */}
            {addStep === 1 && (
              <div>
                <p className="text-sm font-medium mb-3">What are you saving for?</p>
                <div className="grid grid-cols-3 gap-2">
                  {GOAL_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setGoalType(t.id);
                        setGoalIcon(t.icon);
                        setForm(f => ({ ...f, name: t.id === 'custom' ? '' : t.label }));
                        setAddStep(2);
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-xs font-medium text-center">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {addStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Goal details</p>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Goal name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="What are you saving for?" className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Target amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">£</span>
                    <input type="number" value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))} placeholder="0" className="w-full border rounded-xl pl-8 pr-4 py-3 text-lg font-medium bg-background" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Target date</label>
                  <input type="date" value={form.target_date} onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                  {monthsAway !== null && <p className="text-xs text-muted-foreground mt-1">That's {monthsAway} months away</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Already saved towards this</label>
                  <input type="number" value={form.current_amount} onChange={e => setForm(f => ({ ...f, current_amount: e.target.value }))} placeholder="0" className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {PRIORITIES.map(p => (
                      <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))} className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${form.priority === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Colour</label>
                  <div className="flex gap-2">
                    {COLOURS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, colour: c }))} className={`w-8 h-8 rounded-full border-2 ${form.colour === c ? 'border-foreground' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <Button className="w-full" onClick={() => setAddStep(3)} disabled={!form.name || !form.target_amount}>Continue</Button>
              </div>
            )}

            {/* Step 3: Where is the money going? */}
            {addStep === 3 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Which account are you saving into?</p>
                {savingsAccounts.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setLinkedAccountId(a.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${linkedAccountId === a.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: a.colour || '#7F77DD' }}>
                      {(a.institution?.[0] || 'A')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(Number(a.balance))}</p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setLinkedAccountId('other')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${linkedAccountId === 'other' ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">+</div>
                  <p className="text-sm font-medium">I'll save in a different account</p>
                </button>

                {/* UPCOMING savings pot */}
                <div className="w-full p-3 rounded-xl border-2 border-border opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">🏦</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Open a savings pot with interest</p>
                        <UpcomingBadge />
                      </div>
                      <p className="text-xs text-muted-foreground">Earn up to 4.8% AER on your savings goal</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-2" onClick={() => setAddStep(4)}>Continue</Button>
              </div>
            )}

            {/* Step 4: Reminders */}
            {addStep === 4 && (
              <div className="space-y-4">
                <p className="text-sm font-medium">How would you like to be reminded?</p>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Reminder frequency</label>
                  <div className="flex flex-wrap gap-2">
                    {['weekly', 'fortnightly', 'monthly', 'on_payday'].map(f => (
                      <button key={f} onClick={() => setReminderFrequency(f)} className={`px-3 py-2 text-xs rounded-xl border transition-colors ${reminderFrequency === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>
                        {f === 'on_payday' ? 'On payday' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Notification channels</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer">
                      <span className="text-sm">📱 In-app notification</span>
                      <input type="checkbox" checked={reminderInApp} onChange={e => setReminderInApp(e.target.checked)} className="rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer opacity-50">
                      <span className="text-sm">📧 Email</span>
                      <input type="checkbox" disabled className="rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border cursor-not-allowed opacity-40">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💬 SMS/Text</span>
                        <UpcomingBadge />
                      </div>
                      <input type="checkbox" disabled className="rounded" />
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Preview:</p>
                  <p>"Don't forget your {form.name || 'goal'}! You need {formatCurrency(Number(form.target_amount) - Number(form.current_amount))} more to stay on track. {monthsAway || '?'} months to go."</p>
                </div>

                <Button className="w-full" onClick={async () => {
                  if (demo) { toast.success('Goal created (demo)'); setShowAdd(false); return; }
                  await addGoal.mutateAsync({
                    name: form.name,
                    target_amount: parseFloat(form.target_amount),
                    current_amount: parseFloat(form.current_amount) || 0,
                    target_date: form.target_date || undefined,
                    colour: form.colour,
                    icon: goalIcon,
                  });
                  toast.success('Goal created! 🎯');
                  setShowAdd(false);
                }}>
                  Create goal
                </Button>
              </div>
            )}

            {addStep === 1 && <Button variant="ghost" onClick={() => setShowAdd(false)} className="w-full mt-3">Cancel</Button>}
          </div>
        </div>
      )}

      {/* Enhanced Fund Modal */}
      {showFund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowFund(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-1">Add to {goals?.find(g => g.id === showFund)?.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">How much did you save this time?</p>

            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">£</span>
              <input type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)} placeholder="0" className="w-full border rounded-xl pl-8 pr-4 py-3 text-lg font-medium bg-background" autoFocus />
            </div>

            {savingsAccounts.length > 0 && (
              <div className="mb-3">
                <label className="text-xs font-medium text-muted-foreground block mb-1">Source account</label>
                <select className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background">
                  {savingsAccounts.map(a => <option key={a.id} value={a.id}>{a.name} — {formatCurrency(Number(a.balance))}</option>)}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Type</label>
              <div className="flex gap-2">
                <button onClick={() => setFundType('regular')} className={`flex-1 py-2 text-xs rounded-xl border ${fundType === 'regular' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>Regular</button>
                <button onClick={() => setFundType('oneoff')} className={`flex-1 py-2 text-xs rounded-xl border ${fundType === 'oneoff' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}>One-off</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground block mb-1">Note (optional)</label>
              <input value={fundNote} onChange={e => setFundNote(e.target.value)} placeholder="e.g. Birthday money" className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setShowFund(null); setFundAmount(''); setFundNote(''); }} className="flex-1">Cancel</Button>
              <Button className="flex-1" disabled={!fundAmount} onClick={async () => {
                const goal = goals?.find(g => g.id === showFund);
                if (!goal) return;
                const amt = parseFloat(fundAmount);
                const newAmount = Number(goal.current_amount) + amt;
                const pct = Math.round((newAmount / Number(goal.target_amount)) * 100);

                if (demo) {
                  if (pct >= 100) toast.success(`🎉 Goal complete! You've reached your ${goal.name} target!`);
                  else if (pct >= 75) toast.success(`Almost there! 💪 ${pct}% of your ${goal.name} goal!`);
                  else if (pct >= 50) toast.success(`Halfway! 🚀 ${formatCurrency(amt)} added!`);
                  else if (pct >= 25) toast.success(`Quarter way there! 🎉 ${formatCurrency(amt)} added!`);
                  else toast.success(`${formatCurrency(amt)} added! You're now ${pct}% there.`);
                  setShowFund(null); setFundAmount(''); setFundNote('');
                  return;
                }

                await updateGoal.mutateAsync({ id: showFund!, current_amount: newAmount });

                if (pct >= 100) toast.success(`🎉 Goal complete! You've reached your ${goal.name} target!`);
                else if (pct >= 75) toast.success(`Almost there! 💪 ${pct}% of your ${goal.name} goal!`);
                else if (pct >= 50) toast.success(`Halfway! 🚀 ${formatCurrency(amt)} added!`);
                else if (pct >= 25) toast.success(`Quarter way there! 🎉 ${formatCurrency(amt)} added!`);
                else toast.success(`${formatCurrency(amt)} added! You're now ${pct}% there.`);

                setShowFund(null); setFundAmount(''); setFundNote('');
              }}>Save contribution</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingGoal(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">Edit goal</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground block mb-1">Goal name</label>
              <input value={editForm.name} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" /></div>
              <div><label className="text-xs font-medium text-muted-foreground block mb-1">Target amount (£)</label>
              <input type="number" value={editForm.target_amount} onChange={e => setEditForm((f: any) => ({ ...f, target_amount: parseFloat(e.target.value) }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" /></div>
              <div><label className="text-xs font-medium text-muted-foreground block mb-1">Current amount (£)</label>
              <input type="number" value={editForm.current_amount} onChange={e => setEditForm((f: any) => ({ ...f, current_amount: parseFloat(e.target.value) }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" /></div>
              <div><label className="text-xs font-medium text-muted-foreground block mb-1">Target date</label>
              <input type="date" value={editForm.target_date} onChange={e => setEditForm((f: any) => ({ ...f, target_date: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" /></div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Colour</label>
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

      {/* Delete confirmation */}
      {deletingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeletingGoal(null)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-2">Delete goal?</h3>
            <p className="text-sm text-muted-foreground mb-4">This will permanently delete <strong>{deletingGoal.name}</strong>.</p>
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
