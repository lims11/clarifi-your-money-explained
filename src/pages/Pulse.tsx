import { useState } from 'react';
import { AlertTriangle, Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';
import { samplePulseAlerts } from '@/data/sample-data';
import { formatRelativeTime } from '@/lib/finance';
import { Button } from '@/components/ui/button';

const tabs = ['All', 'Warnings', 'Insights', 'Tips', 'Success'];

const typeConfig: Record<string, { icon: React.ElementType; color: string; border: string; bg: string }> = {
  warning: { icon: AlertTriangle, color: 'text-amber', border: 'border-l-amber', bg: 'bg-amber/5' },
  insight: { icon: Lightbulb, color: 'text-primary', border: 'border-l-primary', bg: 'bg-primary/5' },
  tip: { icon: TrendingUp, color: 'text-teal', border: 'border-l-teal', bg: 'bg-teal/5' },
  success: { icon: CheckCircle2, color: 'text-teal', border: 'border-l-teal', bg: 'bg-teal/5' },
};

export default function PulsePage() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? samplePulseAlerts
    : samplePulseAlerts.filter(a => a.type === activeTab.toLowerCase().replace('s', '').replace('warning', 'warning'));

  const getFiltered = () => {
    if (activeTab === 'All') return samplePulseAlerts;
    const typeMap: Record<string, string> = { Warnings: 'warning', Insights: 'insight', Tips: 'tip', Success: 'success' };
    return samplePulseAlerts.filter(a => a.type === typeMap[activeTab]);
  };

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Pulse</h1>
        <Button variant="ghost" size="sm">Mark all read</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {getFiltered().map(a => {
          const config = typeConfig[a.type];
          const Icon = config.icon;
          return (
            <div key={a.id} className={`clarifi-card border-l-4 ${config.border} ${!a.is_read ? config.bg : ''}`}>
              <div className="flex items-start gap-3">
                <Icon size={18} className={`${config.color} mt-0.5 flex-shrink-0`} />
                <div className="flex-1">
                  <p className="label-text mb-0.5">{a.type}</p>
                  <h3 className="text-sm font-medium mb-1">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatRelativeTime(a.created_at)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
