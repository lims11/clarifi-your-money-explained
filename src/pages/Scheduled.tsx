import { useState, useMemo } from 'react';
import { useScheduledTransactions, useAccounts } from '@/hooks/useFinanceData';
import { Calendar, Plus, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpcomingBadge } from '@/components/UpcomingBadge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { formatCurrency } from '@/lib/finance';
import { toast } from 'sonner';

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Every Day', weekly: 'Every Week', biweekly: 'Every 2 Weeks',
  monthly: 'Every Month', quarterly: 'Every 3 Months', annual: 'Every Year',
};

const CATEGORY_COLORS: Record<string, string> = {
  Bills: '#E24B4A', Income: '#1D9E75', Entertainment: '#7F77DD',
  Health: '#EF9F27', Transport: '#378ADD', 'Food & Drink': '#D85A30',
  Shopping: '#378ADD', Savings: '#059669',
};

const POPULAR_SUBS = ['Netflix', 'Spotify', 'Disney+', 'Amazon Prime', 'Adobe', 'iCloud', 'Gym', 'Sky', 'Xbox Game Pass', 'PS Plus', 'Dropbox', 'YouTube Premium'];

// Mock subscription data for demo
const MOCK_SUBSCRIPTIONS = [
  { id: '1', service_name: 'Netflix', amount: 17.99, billing_day: 18, usage_status: 'actively_using', last_survey_date: '2026-04-12' },
  { id: '2', service_name: 'Spotify', amount: 10.99, billing_day: 5, usage_status: 'actively_using', last_survey_date: '2026-04-12' },
  { id: '3', service_name: 'Adobe Creative Cloud', amount: 54.99, billing_day: 12, usage_status: 'rarely_using', last_survey_date: '2026-04-01' },
  { id: '4', service_name: 'Disney+', amount: 14.99, billing_day: 22, usage_status: 'not_using', last_survey_date: '2026-03-15' },
  { id: '5', service_name: 'Amazon Prime', amount: 8.99, billing_day: 1, usage_status: 'actively_using', last_survey_date: '2026-04-10' },
  { id: '6', service_name: 'Gym Membership', amount: 29.99, billing_day: 1, usage_status: 'fairly_using', last_survey_date: '2026-04-05' },
];

const USAGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  actively_using: { label: 'Actively using', color: '#1D9E75', bg: '#DCFCE7' },
  fairly_using: { label: 'Fairly using', color: '#EF9F27', bg: '#FEF9C3' },
  rarely_using: { label: 'Rarely using', color: '#D85A30', bg: '#FEE2E2' },
  not_using: { label: 'Not using', color: '#6B7280', bg: '#F3F4F6' },
  unknown: { label: 'Unknown', color: '#9CA3AF', bg: '#F9FAFB' },
};

export default function ScheduledPage() {
  const { data: scheduled } = useScheduledTransactions();
  const { data: accounts } = useAccounts();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showManageSubs, setShowManageSubs] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');
  const [newSubDate, setNewSubDate] = useState('');
  const [showUsageSurvey, setShowUsageSurvey] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});

  const accountMap = useMemo(() => {
    const m: Record<string, string> = {};
    accounts?.forEach(a => { m[a.id] = a.name; });
    return m;
  }, [accounts]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const paddingDays = getDay(monthStart);

  const scheduledByDate = useMemo(() => {
    const map: Record<string, typeof scheduled> = {};
    scheduled?.forEach(item => {
      const nextDate = new Date(item.next_date);
      const dayOfMonth = nextDate.getDate();
      const dateInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayOfMonth);
      if (isSameMonth(dateInMonth, currentMonth)) {
        const key = format(dateInMonth, 'yyyy-MM-dd');
        if (!map[key]) map[key] = [];
        map[key]!.push(item);
      }
    });
    return map;
  }, [scheduled, currentMonth]);

  const totalExpenses = scheduled?.filter(s => s.type === 'expense').reduce((sum, s) => sum + Math.abs(s.amount), 0) || 0;
  const totalIncome = scheduled?.filter(s => s.type === 'income').reduce((sum, s) => sum + s.amount, 0) || 0;
  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedItems = selectedDateKey ? (scheduledByDate[selectedDateKey] || []) : [];

  const sortedScheduled = useMemo(() => {
    return [...(scheduled || [])].sort((a, b) => new Date(a.next_date).getTime() - new Date(b.next_date).getTime());
  }, [scheduled]);

  // Subscription stats
  const activeSubs = MOCK_SUBSCRIPTIONS.filter(s => s.usage_status === 'actively_using');
  const rarelySubs = MOCK_SUBSCRIPTIONS.filter(s => s.usage_status === 'rarely_using' || s.usage_status === 'fairly_using');
  const notUsingSubs = MOCK_SUBSCRIPTIONS.filter(s => s.usage_status === 'not_using');
  const totalSubsCost = MOCK_SUBSCRIPTIONS.reduce((s, sub) => s + sub.amount, 0);

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Scheduled</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Recurring bills, subscriptions & income</p>
        </div>
        <Button size="sm"><Plus size={14} /> Add scheduled</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sonfi-card"><p className="text-xs text-muted-foreground mb-1">Monthly out</p><p className="text-lg font-semibold text-coral">-{formatCurrency(totalExpenses)}</p></div>
        <div className="sonfi-card"><p className="text-xs text-muted-foreground mb-1">Monthly in</p><p className="text-lg font-semibold text-teal">+{formatCurrency(totalIncome)}</p></div>
        <div className="sonfi-card"><p className="text-xs text-muted-foreground mb-1">Net monthly</p><p className={`text-lg font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-teal' : 'text-coral'}`}>{totalIncome - totalExpenses >= 0 ? '+' : ''}{formatCurrency(totalIncome - totalExpenses)}</p></div>
        <div className="sonfi-card"><p className="text-xs text-muted-foreground mb-1">Active items</p><p className="text-lg font-semibold">{scheduled?.length || 0}</p></div>
      </div>

      {/* SECTION 1: SUBSCRIPTIONS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Subscriptions</h2>
          <Button size="sm" variant="outline" onClick={() => setShowManageSubs(true)}>Manage subscriptions</Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="sonfi-card border-teal/20">
            <p className="text-xs text-teal font-medium mb-1">✅ Active</p>
            <p className="text-lg font-semibold">{activeSubs.length}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(activeSubs.reduce((s, sub) => s + sub.amount, 0))}/month</p>
          </div>
          <div className="sonfi-card border-amber/20">
            <p className="text-xs text-amber font-medium mb-1">⚠️ Rarely used</p>
            <p className="text-lg font-semibold">{rarelySubs.length}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(rarelySubs.reduce((s, sub) => s + sub.amount, 0))}/month</p>
          </div>
          <div className="sonfi-card border-coral/20">
            <p className="text-xs text-coral font-medium mb-1">❌ Not using</p>
            <p className="text-lg font-semibold">{notUsingSubs.length}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(notUsingSubs.reduce((s, sub) => s + sub.amount, 0))}/month</p>
          </div>
        </div>

        {/* Subscription cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {MOCK_SUBSCRIPTIONS.map(sub => {
            const usage = USAGE_CONFIG[sub.usage_status];
            return (
              <div key={sub.id} className="sonfi-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {sub.service_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{sub.service_name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(sub.amount)}/month · {sub.billing_day}th</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ color: usage.color, backgroundColor: usage.bg }}>
                    {usage.label}
                  </span>
                  {sub.last_survey_date && (
                    <span className="text-[10px] text-muted-foreground">
                      Survey: {new Date(sub.last_survey_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">Annual: {formatCurrency(sub.amount * 12)}</p>
              </div>
            );
          })}
        </div>

        <Button size="sm" variant="ghost" onClick={() => setShowUsageSurvey(true)} className="text-xs">
          📋 Quick usage check — takes 30 seconds
        </Button>
      </div>

      {/* SECTION 2: BILLS */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Bills</h2>
        <div className="sonfi-card">
          <div className="space-y-1">
            {sortedScheduled.filter(s => s.type === 'expense' && s.category === 'Bills').map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: '#E24B4A18', color: '#E24B4A' }}>🏠</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{accountMap[item.account_id] || 'Account'} · {FREQUENCY_LABELS[item.frequency]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-coral">-{formatCurrency(Math.abs(item.amount))}</p>
                  <p className="text-[10px] text-muted-foreground">{format(new Date(item.next_date), 'd MMM')}</p>
                </div>
              </div>
            ))}
            {sortedScheduled.filter(s => s.type === 'expense' && s.category !== 'Bills').map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: (CATEGORY_COLORS[item.category] || '#7F77DD') + '18', color: CATEGORY_COLORS[item.category] || '#7F77DD' }}>
                  {item.category === 'Entertainment' ? '🎬' : item.category === 'Health' ? '💪' : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{accountMap[item.account_id] || 'Account'} · {FREQUENCY_LABELS[item.frequency]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-coral">-{formatCurrency(Math.abs(item.amount))}</p>
                  <p className="text-[10px] text-muted-foreground">{format(new Date(item.next_date), 'd MMM')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: INCOME */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Income</h2>
        <div className="sonfi-card">
          <div className="space-y-1">
            {sortedScheduled.filter(s => s.type === 'income').map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: '#1D9E7518', color: '#1D9E75' }}>💰</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{accountMap[item.account_id] || 'Account'} · {FREQUENCY_LABELS[item.frequency]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-teal">+{formatCurrency(item.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">{format(new Date(item.next_date), 'd MMM')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: CALENDAR */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Calendar</h2>
        <div className="sonfi-card">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted"><ChevronLeft size={16} /></button>
            <h3 className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: paddingDays }).map((_, i) => <div key={`pad-${i}`} className="aspect-square" />)}
            {calendarDays.map(day => {
              const key = format(day, 'yyyy-MM-dd');
              const items = scheduledByDate[key] || [];
              const hasItems = items.length > 0;
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              return (
                <button key={key} onClick={() => setSelectedDate(isSelected ? null : day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs transition-all relative ${isToday(day) ? 'ring-1 ring-primary' : ''} ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  <span className={`font-medium ${isToday(day) && !isSelected ? 'text-primary' : ''}`}>{format(day, 'd')}</span>
                  {hasItems && (
                    <div className="flex gap-0.5 absolute bottom-1">
                      {items.slice(0, 3).map((item, i) => (
                        <span key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: isSelected ? 'currentColor' : (item.amount > 0 ? '#1D9E75' : '#E24B4A') }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{format(selectedDate, 'EEEE, d MMMM yyyy')}</p>
              {selectedItems.length === 0 ? (
                <p className="text-xs text-muted-foreground">No scheduled transactions on this date</p>
              ) : selectedItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/50">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#7F77DD' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">{item.payee} · {accountMap[item.account_id] || 'Account'}</p>
                  </div>
                  <span className={`text-sm font-medium ${item.amount > 0 ? 'text-teal' : 'text-coral'}`}>
                    {item.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manage Subscriptions Modal */}
      {showManageSubs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowManageSubs(false)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-1">Your Subscriptions</h3>
            <p className="text-sm text-muted-foreground mb-4">Enter each subscription manually — this takes 2 minutes.</p>
            <p className="text-xs text-muted-foreground mb-4">You've added {MOCK_SUBSCRIPTIONS.length} subscriptions. Most people have 8-12.</p>

            <div className="border rounded-xl p-4 mb-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Service name</label>
                <input value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="e.g. Netflix" className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SUBS.map(s => (
                  <button key={s} onClick={() => setNewSubName(s)} className="text-[11px] px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                    {s}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Monthly cost (£)</label>
                  <input type="number" value={newSubAmount} onChange={e => setNewSubAmount(e.target.value)} placeholder="0.00" className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Next billing date</label>
                  <input type="date" value={newSubDate} onChange={e => setNewSubDate(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                </div>
              </div>
              <Button size="sm" disabled={!newSubName || !newSubAmount} onClick={() => {
                toast.success(`${newSubName} added`);
                setNewSubName(''); setNewSubAmount(''); setNewSubDate('');
              }}>
                Add subscription
              </Button>
            </div>

            {/* Current list */}
            <div className="space-y-2">
              {MOCK_SUBSCRIPTIONS.map(sub => (
                <div key={sub.id} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/50">
                  <span className="text-sm font-medium flex-1">{sub.service_name}</span>
                  <span className="text-sm">{formatCurrency(sub.amount)}</span>
                  <span className="text-xs text-muted-foreground">{sub.billing_day}th</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between text-sm">
              <span className="font-medium">Total</span>
              <span className="font-semibold">{formatCurrency(totalSubsCost)}/month · {formatCurrency(totalSubsCost * 12)}/year</span>
            </div>

            <Button variant="ghost" onClick={() => setShowManageSubs(false)} className="w-full mt-4">Save & close</Button>
          </div>
        </div>
      )}

      {/* Usage Survey Modal */}
      {showUsageSurvey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowUsageSurvey(false)}>
          <div className="bg-card rounded-2xl border p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-1">📋 Quick check — your subscriptions</h3>
            <p className="text-sm text-muted-foreground mb-4">Takes 30 seconds · Helps Sonfi save you money</p>

            <p className="text-sm mb-4">In the last 30 days, how often did you use...</p>

            <div className="space-y-3">
              {MOCK_SUBSCRIPTIONS.map(sub => (
                <div key={sub.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{sub.service_name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(sub.amount)}</p>
                  </div>
                  <div className="flex gap-1">
                    {['daily', 'weekly', 'occasionally', 'never'].map(level => (
                      <button
                        key={level}
                        onClick={() => setSurveyAnswers(prev => ({ ...prev, [sub.id]: level }))}
                        className={`px-2 py-1 text-[10px] rounded-lg border transition-colors ${
                          surveyAnswers[sub.id] === level
                            ? level === 'never' ? 'bg-coral/10 border-coral text-coral' : 'bg-primary/10 border-primary text-primary'
                            : 'bg-card hover:bg-muted'
                        }`}
                      >
                        {level === 'occasionally' ? 'Once/twice' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-5"
              onClick={() => {
                const neverUsed = Object.entries(surveyAnswers).filter(([_, v]) => v === 'never');
                if (neverUsed.length > 0) {
                  const names = neverUsed.map(([id]) => MOCK_SUBSCRIPTIONS.find(s => s.id === id)?.service_name).join(', ');
                  toast.info(`Consider cancelling: ${names}. You said you haven't used them in 30 days.`);
                } else {
                  toast.success('Survey submitted! All your subscriptions look well-used.');
                }
                setShowUsageSurvey(false);
                setSurveyAnswers({});
              }}
            >
              Submit answers →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
