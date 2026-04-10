import { useState, useMemo } from 'react';
import { useScheduledTransactions, useAccounts } from '@/hooks/useFinanceData';
import { Calendar, Plus, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, getDay } from 'date-fns';

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Every Day',
  weekly: 'Every Week',
  biweekly: 'Every 2 Weeks',
  monthly: 'Every Month',
  quarterly: 'Every 3 Months',
  annual: 'Every Year',
};

const CATEGORY_COLORS: Record<string, string> = {
  Bills: '#E24B4A',
  Income: '#1D9E75',
  Entertainment: '#7F77DD',
  Health: '#EF9F27',
  Transport: '#378ADD',
  'Food & Drink': '#D85A30',
  Shopping: '#378ADD',
  Savings: '#059669',
};

export default function ScheduledPage() {
  const { data: scheduled } = useScheduledTransactions();
  const { data: accounts } = useAccounts();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const accountMap = useMemo(() => {
    const m: Record<string, string> = {};
    accounts?.forEach(a => { m[a.id] = a.name; });
    return m;
  }, [accounts]);

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month to align with weekday
  const startDayOfWeek = getDay(monthStart); // 0=Sun
  const paddingDays = startDayOfWeek;

  // Map scheduled items to dates in this month
  const scheduledByDate = useMemo(() => {
    const map: Record<string, typeof scheduled> = {};
    scheduled?.forEach(item => {
      const nextDate = new Date(item.next_date);
      // For monthly items, show on same day-of-month
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

  // Summary calculations
  const totalExpenses = scheduled?.filter(s => s.type === 'expense').reduce((sum, s) => sum + Math.abs(s.amount), 0) || 0;
  const totalIncome = scheduled?.filter(s => s.type === 'income').reduce((sum, s) => sum + s.amount, 0) || 0;

  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedItems = selectedDateKey ? (scheduledByDate[selectedDateKey] || []) : [];

  // Sort scheduled by next_date for the list view
  const sortedScheduled = useMemo(() => {
    return [...(scheduled || [])].sort((a, b) => new Date(a.next_date).getTime() - new Date(b.next_date).getTime());
  }, [scheduled]);

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Scheduled</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Recurring bills, subscriptions & income</p>
        </div>
        <Button size="sm" className="flex items-center gap-1.5">
          <Plus size={14} /> Add scheduled
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="clarifi-card">
          <p className="text-xs text-muted-foreground mb-1">Monthly expenses</p>
          <p className="text-lg font-semibold text-coral">-£{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="clarifi-card">
          <p className="text-xs text-muted-foreground mb-1">Monthly income</p>
          <p className="text-lg font-semibold text-teal">+£{totalIncome.toFixed(2)}</p>
        </div>
        <div className="clarifi-card">
          <p className="text-xs text-muted-foreground mb-1">Net monthly</p>
          <p className={`text-lg font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-teal' : 'text-coral'}`}>
            {totalIncome - totalExpenses >= 0 ? '+' : ''}£{(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </div>
        <div className="clarifi-card">
          <p className="text-xs text-muted-foreground mb-1">Active items</p>
          <p className="text-lg font-semibold">{scheduled?.length || 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Calendar */}
        <div className="clarifi-card">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* Padding */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}

            {calendarDays.map(day => {
              const key = format(day, 'yyyy-MM-dd');
              const items = scheduledByDate[key] || [];
              const hasItems = items.length > 0;
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs transition-all relative
                    ${isToday(day) ? 'ring-1 ring-primary' : ''}
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                  `}
                >
                  <span className={`font-medium ${isToday(day) && !isSelected ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {hasItems && (
                    <div className="flex gap-0.5 absolute bottom-1">
                      {items.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: isSelected ? 'currentColor' : (item.amount > 0 ? '#1D9E75' : '#E24B4A') }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date detail */}
          {selectedDate && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{format(selectedDate, 'EEEE, d MMMM yyyy')}</p>
              {selectedItems.length === 0 ? (
                <p className="text-xs text-muted-foreground">No scheduled transactions on this date</p>
              ) : (
                selectedItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/50">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#7F77DD' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.payee} · {accountMap[item.account_id] || 'Account'}</p>
                    </div>
                    <span className={`text-sm font-medium ${item.amount > 0 ? 'text-teal' : 'text-coral'}`}>
                      {item.amount > 0 ? '+' : ''}£{Math.abs(item.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Upcoming list */}
        <div className="space-y-3">
          <div className="clarifi-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Expenses</h3>
              <span className="text-xs text-muted-foreground">{format(currentMonth, 'MMMM')}</span>
            </div>
            <div className="space-y-1">
              {sortedScheduled.filter(s => s.type === 'expense').map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-muted/50 transition-colors group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
                    style={{ backgroundColor: (CATEGORY_COLORS[item.category] || '#7F77DD') + '18', color: CATEGORY_COLORS[item.category] || '#7F77DD' }}>
                    {item.category === 'Bills' ? '🏠' : item.category === 'Entertainment' ? '🎬' : item.category === 'Health' ? '💪' : '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {accountMap[item.account_id] || 'Account'} · {FREQUENCY_LABELS[item.frequency] || item.frequency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-coral">-£{Math.abs(item.amount).toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">{format(new Date(item.next_date), 'd MMM')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="clarifi-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Income</h3>
            </div>
            <div className="space-y-1">
              {sortedScheduled.filter(s => s.type === 'income').map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
                    style={{ backgroundColor: '#1D9E7518', color: '#1D9E75' }}>
                    💰
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {accountMap[item.account_id] || 'Account'} · {FREQUENCY_LABELS[item.frequency] || item.frequency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-teal">+£{item.amount.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">{format(new Date(item.next_date), 'd MMM')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="clarifi-card bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">Next week's forecast</p>
            <div className="space-y-1.5">
              {sortedScheduled
                .filter(s => {
                  const d = new Date(s.next_date);
                  const now = new Date();
                  const weekFromNow = new Date(now);
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return d >= now && d <= weekFromNow;
                })
                .map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span>{item.name}</span>
                    <span className={item.amount > 0 ? 'text-teal' : 'text-coral'}>
                      {item.amount > 0 ? '+' : ''}£{Math.abs(item.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              }
              {sortedScheduled.filter(s => {
                const d = new Date(s.next_date);
                const now = new Date();
                const weekFromNow = new Date(now);
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                return d >= now && d <= weekFromNow;
              }).length === 0 && (
                <p className="text-xs text-muted-foreground">No bills due this week</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
