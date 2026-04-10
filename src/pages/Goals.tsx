import { Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/finance';
import { sampleGoals } from '@/data/sample-data';

export default function GoalsPage() {
  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Savings goals</h1>
        <Button size="sm"><Plus size={16} /> Add goal</Button>
      </div>

      <div className="space-y-4">
        {sampleGoals.map(g => {
          const pct = Math.round((g.current_amount / g.target_amount) * 100);
          const targetDate = new Date(g.target_date);
          const now = new Date();
          const monthsAway = Math.max(0, Math.round((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
          const remaining = g.target_amount - g.current_amount;
          const monthlyNeeded = monthsAway > 0 ? remaining / monthsAway : remaining;

          return (
            <div key={g.id} className="clarifi-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: g.colour + '20' }}>
                  <Target size={20} style={{ color: g.colour }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium">{g.name}</h3>
                  <p className="text-xs text-muted-foreground">{monthsAway} months away</p>
                </div>
                <span className="text-2xl font-medium" style={{ color: g.colour }}>{pct}%</span>
              </div>

              <div className="h-3 rounded-full bg-muted overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: g.colour }} />
              </div>

              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">{formatCurrency(g.current_amount)} of {formatCurrency(g.target_amount)}</span>
                <span className="text-muted-foreground">{formatCurrency(remaining)} remaining</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(monthlyNeeded)}/month needed to reach target
                </p>
                <Button size="sm" variant="ghost">Add funds</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
