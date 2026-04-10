import { useState } from 'react';
import { AlertTriangle, Lightbulb, TrendingUp, CheckCircle2, MessageSquare, Bell } from 'lucide-react';
import { usePulseAlerts, useMarkAlertRead, useMarkAllAlertsRead } from '@/hooks/useFinanceData';
import { formatRelativeTime } from '@/lib/finance';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const tabs = ['All', 'Warnings', 'Insights', 'Tips', 'Success'];
const typeConfig: Record<string, { icon: React.ElementType; color: string; border: string; bg: string }> = {
  warning: { icon: AlertTriangle, color: 'text-amber', border: 'border-l-amber', bg: 'bg-amber/5' },
  insight: { icon: Lightbulb, color: 'text-primary', border: 'border-l-primary', bg: 'bg-primary/5' },
  tip: { icon: TrendingUp, color: 'text-teal', border: 'border-l-teal', bg: 'bg-teal/5' },
  success: { icon: CheckCircle2, color: 'text-teal', border: 'border-l-teal', bg: 'bg-teal/5' },
};

export default function PulsePage() {
  const [activeTab, setActiveTab] = useState('All');
  const { data: alerts, isLoading } = usePulseAlerts();
  const markRead = useMarkAlertRead();
  const markAllRead = useMarkAllAlertsRead();

  const typeMap: Record<string, string> = { Warnings: 'warning', Insights: 'insight', Tips: 'tip', Success: 'success' };
  const filtered = activeTab === 'All' ? alerts : alerts?.filter(a => a.type === typeMap[activeTab]);

  if (isLoading) return <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-4"><Skeleton className="h-8 w-32" />{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>;

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Pulse</h1>
        <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()}>Mark all read</Button>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{tab}</button>
        ))}
      </div>
      {(!filtered || filtered.length === 0) ? (
        <div className="clarifi-card text-center py-12"><Bell className="mx-auto mb-3 text-muted-foreground" size={32} /><p className="text-lg font-medium mb-2">No alerts</p><p className="text-sm text-muted-foreground">Clarifi will notify you when something needs attention</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const config = typeConfig[a.type] || typeConfig.insight;
            const Icon = config.icon;
            return (
              <div key={a.id} className={`clarifi-card border-l-4 ${config.border} ${!a.is_read ? config.bg : ''}`} onClick={() => !a.is_read && markRead.mutate(a.id)}>
                <div className="flex items-start gap-3">
                  <Icon size={18} className={`${config.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="label-text mb-0.5">{a.type}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(a.created_at)}</p>
                    </div>
                    <h3 className="text-sm font-medium mb-1">{a.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                    <div className="flex gap-2 mt-3">
                      <Link to={`/chat?q=${encodeURIComponent(a.title)}`}>
                        <Button variant="ghost" size="sm" className="text-xs h-7"><MessageSquare size={12} className="mr-1" /> Ask Clarifi</Button>
                      </Link>
                    </div>
                  </div>
                  {!a.is_read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
