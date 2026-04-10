import { Link } from 'react-router-dom';
import { Bell, TrendingUp, TrendingDown, ArrowRight, Target } from 'lucide-react';
import { formatCurrency, categoryIcons, categoryColours } from '@/lib/finance';
import { sampleAccounts, sampleTransactions, sampleBudgets, sampleGoals, samplePulseAlerts, sampleScheduled, netWorthHistory } from '@/data/sample-data';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const totalAssets = sampleAccounts.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
const totalLiabilities = Math.abs(sampleAccounts.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0));
const netWorth = totalAssets - totalLiabilities;
const monthIncome = sampleTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
const monthExpenses = Math.abs(sampleTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
const totalBudget = sampleBudgets.reduce((s, b) => s + b.amount, 0);
const totalSpent = sampleBudgets.reduce((s, b) => s + b.spent, 0);

const spendingByCategory = Object.entries(
  sampleTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>)
).map(([name, value]) => ({ name, value, fill: categoryColours[name] || '#7F77DD' }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 6);

const pulseTypeConfig: Record<string, { color: string; border: string }> = {
  warning: { color: 'text-amber', border: 'border-l-amber' },
  insight: { color: 'text-primary', border: 'border-l-primary' },
  tip: { color: 'text-teal', border: 'border-l-teal' },
  success: { color: 'text-teal', border: 'border-l-teal' },
};

export default function DashboardPage() {
  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Good morning, James</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Link to="/pulse" className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
            2
          </span>
        </Link>
      </div>

      {/* Net worth card */}
      <div className="clarifi-card">
        <p className="label-text mb-1">Net worth</p>
        <p className="text-3xl font-medium">{formatCurrency(netWorth)}</p>
        <div className="flex gap-6 mt-3 text-sm">
          <div><span className="label-text">Assets</span><p className="amount-positive font-medium">{formatCurrency(totalAssets)}</p></div>
          <div><span className="label-text">Liabilities</span><p className="amount-negative font-medium">{formatCurrency(totalLiabilities)}</p></div>
          <div><span className="label-text">This month</span><p className="amount-positive font-medium flex items-center gap-1"><TrendingUp size={14} /> +£207.50</p></div>
        </div>
        <div className="h-20 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netWorthHistory}>
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7F77DD" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#7F77DD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#7F77DD" fill="url(#nwGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chat bar */}
      <Link to="/chat" className="clarifi-card flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-xs">✨</span>
        </div>
        <span className="text-sm text-muted-foreground flex-1">Ask Clarifi anything... e.g. "Am I spending too much on eating out?"</span>
        <ArrowRight size={16} className="text-primary" />
      </Link>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="clarifi-card">
          <p className="label-text mb-1">Income</p>
          <p className="text-lg font-medium amount-positive">{formatCurrency(monthIncome)}</p>
        </div>
        <div className="clarifi-card">
          <p className="label-text mb-1">Expenses</p>
          <p className="text-lg font-medium amount-negative">{formatCurrency(monthExpenses)}</p>
        </div>
        <div className="clarifi-card">
          <p className="label-text mb-1">Budget left</p>
          <p className="text-lg font-medium text-primary">{formatCurrency(totalBudget - totalSpent)}</p>
        </div>
        <div className="clarifi-card">
          <p className="label-text mb-1">Emergency Fund</p>
          <p className="text-lg font-medium text-teal">{Math.round((sampleGoals[0].current_amount / sampleGoals[0].target_amount) * 100)}%</p>
        </div>
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left */}
        <div className="lg:col-span-3 space-y-5">
          {/* Recent transactions */}
          <div className="clarifi-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Recent transactions</h2>
              <Link to="/transactions" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-1">
              {sampleTransactions.slice(0, 8).map(t => (
                <div key={t.id} className="flex items-center gap-3 py-2.5 border-b last:border-0">
                  <span className="text-lg">{categoryIcons[t.category] || '💳'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.payee}</p>
                    <p className="text-xs text-muted-foreground">{t.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${t.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                      {formatCurrency(t.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spending chart */}
          <div className="clarifi-card">
            <h2 className="text-sm font-medium mb-4">Spending by category</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingByCategory} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tickFormatter={(v) => `£${v}`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {spendingByCategory.map((entry) => (
                      <rect key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-5">
          {/* Pulse */}
          <div className="clarifi-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Pulse</h2>
              <Link to="/pulse" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {samplePulseAlerts.map(a => {
                const config = pulseTypeConfig[a.type];
                return (
                  <div key={a.id} className={`p-3 rounded-xl border border-l-4 ${config.border} ${!a.is_read ? 'bg-primary-light/30' : ''}`}>
                    <p className="label-text mb-0.5">{a.type}</p>
                    <p className="text-sm font-medium leading-snug">{a.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goals */}
          <div className="clarifi-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Savings goals</h2>
              <Link to="/goals" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {sampleGoals.map(g => {
              const pct = Math.round((g.current_amount / g.target_amount) * 100);
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-1.5"><Target size={14} className="text-teal" /> {g.name}</span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(g.current_amount)} of {formatCurrency(g.target_amount)}</p>
                </div>
              );
            })}
          </div>

          {/* Upcoming bills */}
          <div className="clarifi-card">
            <h2 className="text-sm font-medium mb-4">Upcoming bills</h2>
            <div className="space-y-2.5">
              {sampleScheduled.filter(s => s.amount < 0).map(s => (
                <div key={s.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.next_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <p className="amount-negative font-medium">{formatCurrency(s.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
