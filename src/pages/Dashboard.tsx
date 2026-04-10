import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, TrendingUp, TrendingDown, ArrowRight, Target, ArrowUpRight, ArrowDownRight, Sparkles, Heart } from 'lucide-react';
import { formatCurrency, categoryIcons, categoryColours } from '@/lib/finance';
import { useAccounts, useMonthTransactions, useBudgets, useGoals, usePulseAlerts, useScheduledTransactions, useUnreadAlertCount } from '@/hooks/useFinanceData';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { netWorthHistory } from '@/data/sample-data';

export default function DashboardPage() {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const { data: transactions, isLoading: loadingTxns } = useMonthTransactions();
  const { data: budgets } = useBudgets();
  const { data: goals } = useGoals();
  const { data: alerts } = usePulseAlerts();
  const { data: scheduled } = useScheduledTransactions();
  const { data: unreadCount } = useUnreadAlertCount();
  const { data: profile } = useProfile();

  const stats = useMemo(() => {
    if (!accounts || !transactions) return null;
    const totalAssets = accounts.filter(a => Number(a.balance) > 0).reduce((s, a) => s + Number(a.balance), 0);
    const totalLiabilities = Math.abs(accounts.filter(a => Number(a.balance) < 0).reduce((s, a) => s + Number(a.balance), 0));
    const netWorth = totalAssets - totalLiabilities;
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0));
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const totalBudget = budgets?.reduce((s, b) => s + Number(b.amount), 0) ?? 0;

    const spendingByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const cat = t.category;
        acc[cat] = (acc[cat] || 0) + Math.abs(Number(t.amount));
        return acc;
      }, {} as Record<string, number>);

    const categoryData = Object.entries(spendingByCategory)
      .map(([name, value]) => ({ name, value, fill: DOUGHNUT_COLOURS[name] || '#888780' }))
      .sort((a, b) => b.value - a.value);

    return { totalAssets, totalLiabilities, netWorth, income, expenses, savingsRate, totalBudget, categoryData };
  }, [accounts, transactions, budgets]);

  // Update the last net worth history point dynamically
  const chartData = useMemo(() => {
    if (!stats) return netWorthHistory;
    const d = [...netWorthHistory];
    d[d.length - 1] = { ...d[d.length - 1], value: stats.netWorth };
    return d;
  }, [stats]);

  const topGoal = goals?.[0];
  const topGoalPct = topGoal ? Math.round((Number(topGoal.current_amount) / Number(topGoal.target_amount)) * 100) : 0;

  // Health score
  const healthScore = useMemo(() => {
    if (!stats || !budgets || !goals || !accounts) return 0;
    let score = 0;
    // Savings rate (25pts)
    score += Math.min(25, Math.round((stats.savingsRate / 20) * 25));
    // Budget adherence (25pts)
    const budgetsOnTrack = budgets.filter(b => {
      const spent = stats.categoryData.find(c => c.name === b.category)?.value ?? 0;
      return spent <= Number(b.amount);
    }).length;
    score += budgets.length > 0 ? Math.round((budgetsOnTrack / budgets.length) * 25) : 25;
    // Debt ratio (25pts)
    const debtRatio = stats.totalAssets > 0 ? stats.totalLiabilities / stats.totalAssets : 1;
    score += Math.max(0, Math.round((1 - debtRatio) * 25));
    // Emergency fund (25pts)
    if (topGoal) score += Math.min(25, Math.round(topGoalPct / 4));
    return Math.min(100, score);
  }, [stats, budgets, goals, accounts, topGoalPct, topGoal]);

  const healthColor = healthScore >= 75 ? 'text-teal' : healthScore >= 50 ? 'text-amber' : 'text-coral';
  const healthBg = healthScore >= 75 ? 'bg-teal' : healthScore >= 50 ? 'bg-amber' : 'bg-coral';

  if (loadingAccounts || loadingTxns) {
    return (
      <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!stats) return null;

  const totalSpent = stats.categoryData.reduce((s, c) => s + c.value, 0);

  const pulseTypeConfig: Record<string, { border: string }> = {
    warning: { border: 'border-l-amber' },
    insight: { border: 'border-l-primary' },
    tip: { border: 'border-l-teal' },
    success: { border: 'border-l-teal' },
  };

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Good morning, {profile?.full_name || 'there'}</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link to="/pulse" className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell size={20} />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-primary-foreground text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>
          )}
        </Link>
      </div>

      {/* Net worth card */}
      <div className="clarifi-card">
        <p className="label-text mb-1">Net worth</p>
        <p className="text-3xl font-medium">{formatCurrency(stats.netWorth)}</p>
        <div className="flex gap-6 mt-3 text-sm">
          <div><span className="label-text">Assets</span><p className="amount-positive font-medium">{formatCurrency(stats.totalAssets)}</p></div>
          <div><span className="label-text">Liabilities</span><p className="amount-negative font-medium">{formatCurrency(stats.totalLiabilities)}</p></div>
          <div><span className="label-text">This month</span><p className="amount-positive font-medium flex items-center gap-1"><TrendingUp size={14} /> +{formatCurrency(stats.income - stats.expenses)}</p></div>
        </div>
        <div className="h-24 mt-4" role="img" aria-label="Net worth trend over last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7F77DD" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#7F77DD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9B9B9B' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '8px 12px', fontSize: 13 }}
                formatter={(value: number) => [formatCurrency(value), 'Net worth']}
              />
              <Area type="monotone" dataKey="value" stroke="#7F77DD" fill="url(#nwGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health score */}
      <div className="clarifi-card flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Heart size={20} className={healthColor} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Financial health score</span>
              <span className={`text-lg font-medium ${healthColor}`}>{healthScore}/100</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${healthBg}`} style={{ width: `${healthScore}%` }} />
            </div>
          </div>
        </div>
        <Link to="/chat?q=What+affects+my+score?" className="text-xs text-primary hover:underline whitespace-nowrap">What affects my score?</Link>
      </div>

      {/* Chat bar */}
      <Link to="/chat" className="clarifi-card flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles size={14} className="text-primary-foreground" />
        </div>
        <span className="text-sm text-muted-foreground flex-1">Ask Clarifi anything... e.g. "Am I spending too much on eating out?"</span>
        <ArrowRight size={16} className="text-primary" />
      </Link>

      {/* Stats row - 6 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="clarifi-card">
          <p className="label-text mb-1">Income</p>
          <p className="text-lg font-medium amount-positive">{formatCurrency(stats.income)}</p>
        </div>
        <div className="clarifi-card">
          <p className="label-text mb-1">Expenses</p>
          <p className="text-lg font-medium amount-negative">{formatCurrency(stats.expenses)}</p>
        </div>
        <div className="clarifi-card">
          <p className="label-text mb-1">Budget left</p>
          <p className="text-lg font-medium text-primary">{formatCurrency(stats.totalBudget - stats.expenses)}</p>
        </div>
        <div className="clarifi-card">
          <p className="label-text mb-1">Savings goal</p>
          <p className="text-lg font-medium text-teal">{topGoalPct}%</p>
        </div>
        <div className="clarifi-card">
          <p className="label-text mb-1">Savings rate</p>
          <p className={`text-lg font-medium ${stats.savingsRate >= 20 ? 'text-teal' : stats.savingsRate >= 10 ? 'text-amber' : 'text-coral'}`}>
            {stats.savingsRate.toFixed(0)}%
          </p>
        </div>
        <div className="clarifi-card">
          <p className="label-text mb-1">Net change</p>
          <p className={`text-lg font-medium flex items-center gap-1 ${stats.income - stats.expenses >= 0 ? 'amount-positive' : 'amount-negative'}`}>
            {stats.income - stats.expenses >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {formatCurrency(Math.abs(stats.income - stats.expenses))}
          </p>
        </div>
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-5">
          {/* Recent transactions */}
          <div className="clarifi-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Recent transactions</h2>
              <Link to="/transactions" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-1">
                {transactions.slice(0, 8).map(t => (
                  <div key={t.id} className="flex items-center gap-3 py-2.5 border-b last:border-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: (DOUGHNUT_COLOURS[t.category] || '#888780') + '20' }}>
                      {categoryIcons[t.category] || '💳'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.payee || t.category}</p>
                      <p className="text-xs text-muted-foreground">{t.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${Number(t.amount) > 0 ? 'amount-positive' : 'amount-negative'}`}>{formatCurrency(Number(t.amount))}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No transactions yet</p>
                <Link to="/transactions" className="text-xs text-primary hover:underline mt-1 block">Add your first transaction</Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          {/* Spending doughnut */}
          {stats.categoryData.length > 0 && (
            <div className="clarifi-card">
              <h2 className="text-sm font-medium mb-4">Spending this month</h2>
              <div className="flex items-center justify-center" role="img" aria-label="Spending by category doughnut chart">
                <div className="relative w-44 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.categoryData} innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={0}>
                        {stats.categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-muted-foreground">This month</span>
                    <span className="text-base font-medium">{formatCurrency(totalSpent)}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4">
                {stats.categoryData.slice(0, 6).map(c => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.fill }} />
                    <span className="truncate text-muted-foreground">{c.name}</span>
                    <span className="ml-auto font-medium">{formatCurrency(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pulse */}
          <div className="clarifi-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Pulse</h2>
              <Link to="/pulse" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {alerts && alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.slice(0, 3).map(a => (
                  <div key={a.id} className={`p-3 rounded-xl border border-l-4 ${pulseTypeConfig[a.type]?.border || 'border-l-primary'} ${!a.is_read ? 'bg-primary-light/30' : ''}`}>
                    <p className="label-text mb-0.5">{a.type}</p>
                    <p className="text-sm font-medium leading-snug">{a.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No alerts yet</p>
            )}
          </div>

          {/* Goals */}
          <div className="clarifi-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Savings goals</h2>
              <Link to="/goals" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {goals && goals.length > 0 ? goals.map(g => {
              const pct = Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100);
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-1.5"><Target size={14} className="text-teal" /> {g.name}</span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(Number(g.current_amount))} of {formatCurrency(Number(g.target_amount))}</p>
                </div>
              );
            }) : <p className="text-sm text-muted-foreground text-center py-4">No goals yet</p>}
          </div>

          {/* Upcoming bills */}
          <div className="clarifi-card">
            <h2 className="text-sm font-medium mb-4">Upcoming bills</h2>
            {scheduled && scheduled.filter(s => Number(s.amount) < 0).length > 0 ? (
              <div className="space-y-2.5">
                {scheduled.filter(s => Number(s.amount) < 0).slice(0, 5).map(s => (
                  <div key={s.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(s.next_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <p className="amount-negative font-medium">{formatCurrency(Number(s.amount))}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-4">No upcoming bills</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
