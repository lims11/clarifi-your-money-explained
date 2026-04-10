import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, categoryIcons } from '@/lib/finance';
import { sampleBudgets } from '@/data/sample-data';

export default function BudgetsPage() {
  const onTrack = sampleBudgets.filter(b => (b.spent / b.amount) < 0.8).length;
  const overBudget = sampleBudgets.filter(b => b.spent > b.amount).length;

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Budgets</h1>
        <Button size="sm"><Plus size={16} /> Add budget</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="clarifi-card text-center">
          <p className="text-2xl font-medium text-teal">{onTrack}</p>
          <p className="label-text mt-1">On track</p>
        </div>
        <div className="clarifi-card text-center">
          <p className="text-2xl font-medium text-coral">{overBudget}</p>
          <p className="label-text mt-1">Over budget</p>
        </div>
        <div className="clarifi-card text-center">
          <p className="text-2xl font-medium text-muted-foreground">0</p>
          <p className="label-text mt-1">Not started</p>
        </div>
      </div>

      {/* Budget cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {sampleBudgets.map(b => {
          const pct = Math.round((b.spent / b.amount) * 100);
          const barColor = pct >= 100 ? 'bg-coral' : pct >= 80 ? 'bg-amber' : 'bg-teal';
          const daysLeft = 30 - new Date().getDate();
          return (
            <div key={b.id} className="clarifi-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{categoryIcons[b.category] || '📊'}</span>
                <h3 className="text-sm font-medium flex-1">{b.name}</h3>
                <span className="text-xs text-muted-foreground">{daysLeft} days left</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{formatCurrency(b.spent)} of {formatCurrency(b.amount)}</span>
                <span className={pct >= 100 ? 'amount-negative' : 'amount-positive'}>{pct}%</span>
              </div>
              <p className="text-xs text-primary mt-2">
                {pct < 50 ? "You're on track — keep it up!" : pct < 80 ? "Getting closer, watch your spending." : pct >= 100 ? "Over budget — review your spending." : "Almost at your limit."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
