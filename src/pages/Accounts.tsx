import { Link } from 'react-router-dom';
import { Plus, Landmark, PiggyBank, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/finance';
import { sampleAccounts } from '@/data/sample-data';

const typeIcons: Record<string, React.ReactNode> = {
  current: <Landmark size={18} />,
  savings: <PiggyBank size={18} />,
  credit_card: <CreditCard size={18} />,
};

const typeLabels: Record<string, string> = {
  current: 'Current accounts',
  savings: 'Savings accounts',
  credit_card: 'Credit cards',
  loan: 'Loans & mortgages',
  investment: 'Investments',
  crypto: 'Crypto',
  cash: 'Cash',
};

export default function AccountsPage() {
  const grouped = sampleAccounts.reduce((acc, a) => {
    if (!acc[a.type]) acc[a.type] = [];
    acc[a.type].push(a);
    return acc;
  }, {} as Record<string, typeof sampleAccounts>);

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Accounts</h1>
        <Button size="sm"><Plus size={16} /> Add account</Button>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([type, accounts]) => (
          <div key={type}>
            <h2 className="label-text mb-3">{typeLabels[type] || type}</h2>
            <div className="space-y-2">
              {accounts.map(a => (
                <Link
                  key={a.id}
                  to={`/accounts/${a.id}`}
                  className="clarifi-card flex items-center gap-4 hover:border-primary/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground" style={{ backgroundColor: a.colour }}>
                    {typeIcons[a.type] || <Landmark size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.institution}</p>
                  </div>
                  <p className={`text-base font-medium ${a.balance >= 0 ? 'amount-positive' : 'amount-negative'}`}>
                    {formatCurrency(a.balance)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
