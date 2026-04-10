import { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, categoryIcons } from '@/lib/finance';
import { sampleTransactions } from '@/data/sample-data';

const dateFilters = ['This month', 'Last month', 'Last 3 months', 'All'];
const typeFilters = ['All', 'Income', 'Expense', 'Transfer'];

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('This month');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = sampleTransactions.filter(t => {
    if (search && !t.payee.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'All' && t.type !== typeFilter.toLowerCase()) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {} as Record<string, typeof sampleTransactions>);

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Transactions</h1>
        <Button variant="ghost" size="sm"><Download size={16} /> Export</Button>
      </div>

      {/* Filters */}
      <div className="clarifi-card mb-5 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search payee or description..."
            className="w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {dateFilters.map(f => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${dateFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {f}
            </button>
          ))}
          <span className="w-px bg-border mx-1" />
          {typeFilters.map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${typeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped list */}
      <div className="space-y-4">
        {Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).map(([date, txns]) => (
          <div key={date}>
            <p className="label-text mb-2">{new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <div className="clarifi-card divide-y">
              {txns.map(t => (
                <div key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-lg">{categoryIcons[t.category] || '💳'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.payee}</p>
                    <p className="text-xs text-muted-foreground">{t.category}{t.subcategory ? ` > ${t.subcategory}` : ''}</p>
                  </div>
                  <p className={`text-sm font-medium ${t.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                    {formatCurrency(t.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
