import { useEffect, useState } from 'react';
import { AlertTriangle, Lightbulb, TrendingUp, CheckCircle2, MessageSquare, Bell, Repeat } from 'lucide-react';
import { usePulseAlerts, useMarkAlertRead, useMarkAllAlertsRead } from '@/hooks/useFinanceData';
import { formatRelativeTime } from '@/lib/finance';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const tabs = ['All', 'Warnings', 'Insights', 'Tips', 'Success', 'Subscriptions'];

const typeConfig: Record<string, { icon: React.ElementType; color: string; border: string; bg: string }> = {
  warning: { icon: AlertTriangle, color: 'text-amber', border: 'border-l-amber', bg: 'bg-amber/5' },
  insight: { icon: Lightbulb, color: 'text-primary', border: 'border-l-primary', bg: 'bg-primary/5' },
  tip: { icon: TrendingUp, color: 'text-teal', border: 'border-l-teal', bg: 'bg-teal/5' },
  success: { icon: CheckCircle2, color: 'text-teal', border: 'border-l-teal', bg: 'bg-teal/5' },
};

export default function PulsePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [subs, setSubs] = useState<any[]>([]);
  const { data: alerts, isLoading } = usePulseAlerts();
  const markRead = useMarkAlertRead();
  const markAllRead = useMarkAllAlertsRead();

  useEffect(() => {
    if (!user || activeTab !== 'Subscriptions') return;
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('is_active', true)
      .then(({ data }) => setSubs(data || []));
  }, [user, activeTab]);

  const typeMap: Record<string, string> = { Warnings: 'warning', Insights: 'insight', Tips: 'tip', Success: 'success' };
  const filtered = activeTab === 'All' ? alerts : alerts?.filter(a => a.type === typeMap[activeTab]);
  const totalMonthly = subs.reduce((s, x) => s + Number(x.amount || 0), 0);

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

      {activeTab === 'Subscriptions' ? (
        subs.length === 0 ? (
          <div className="sonfi-card text-center py-12"><Repeat className="mx-auto mb-3 text-muted-foreground" size={32} /><p className="text-lg font-medium mb-2">No subscriptions detected yet</p><p className="text-sm text-muted-foreground">Import a statement or autosync a bank — Sonfi will spot recurring charges automatically.</p></div>
        ) : (
          <div className="space-y-3">
            <div className="sonfi-card flex items-center justify-between">
              <div><p className="label-text">Estimated monthly spend</p><p className="text-2xl font-semibold">£{totalMonthly.toFixed(2)}</p></div>
              <div className="text-right"><p className="label-text">Active</p><p className="text-2xl font-semibold">{subs.length}</p></div>
            </div>
            {subs.map(s => (
              <div key={s.id} className="sonfi-card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0"><Repeat size={16} className="text-primary flex-shrink-0" /><div className="min-w-0"><p className="text-sm font-medium truncate">{s.service_name}</p><p className="text-xs text-muted-foreground">{s.billing_frequency} · {s.usage_status}</p></div></div>
                <p className="text-sm font-semibold">£{Number(s.amount).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )
      ) : (!filtered || filtered.length === 0) ? (
        <div className="sonfi-card text-center py-12"><Bell className="mx-auto mb-3 text-muted-foreground" size={32} /><p className="text-lg font-medium mb-2">No alerts</p><p className="text-sm text-muted-foreground">Sonfi will notify you when something needs attention</p></div>
      ) : (
        <div className="space-y-3">

          {filtered.map(a => {
            const config = typeConfig[a.type] || typeConfig.insight;
            const Icon = config.icon;
            return (
              <div key={a.id} className={`sonfi-card border-l-4 ${config.border} ${!a.is_read ? config.bg : ''}`} onClick={() => !a.is_read && markRead.mutate(a.id)}>
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
                        <Button variant="ghost" size="sm" className="text-xs h-7"><MessageSquare size={12} className="mr-1" /> Ask Sonfi</Button>
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
