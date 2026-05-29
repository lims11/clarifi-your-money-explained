import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { detectSubscriptionsAndAlert } from '@/lib/detect-subscriptions';

export default function AutosyncCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [message, setMessage] = useState('Linking your bank…');
  const [summary, setSummary] = useState<any[]>([]);

  useEffect(() => {
    const requisitionId = params.get('requisitionId') || params.get('ref');
    const institutionName = sessionStorage.getItem('sonfi:autosync:bank') || 'Bank';
    if (!requisitionId || !user) return;

    (async () => {
      try {
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        const r = await fetch(`${baseUrl}/functions/v1/gocardless`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({ action: 'finalise', requisitionId, userId: user.id, institutionName }),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || 'Linking failed');
        setSummary(data.accounts || []);
        setStatus('done');
        setMessage('Bank linked successfully');
        try { await detectSubscriptionsAndAlert(user.id); } catch {}
        ['accounts', 'transactions', 'budgets', 'pulse_alerts', 'subscriptions'].forEach(k =>
          queryClient.invalidateQueries({ queryKey: [k] })
        );
      } catch (e: any) {
        setStatus('error');
        setMessage(e?.message || 'Unable to finish linking');
      }
    })();
  }, [params, user, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full rounded-2xl border bg-card p-6 text-center space-y-4">
        {status === 'loading' && <Loader2 size={32} className="mx-auto animate-spin text-primary" />}
        {status === 'done' && <CheckCircle2 size={32} className="mx-auto text-accent" />}
        {status === 'error' && <AlertCircle size={32} className="mx-auto text-destructive" />}
        <h1 className="text-lg font-semibold">{message}</h1>
        {summary.length > 0 && (
          <div className="text-left text-xs space-y-1 bg-muted/30 rounded-xl p-3">
            {summary.map((s) => (
              <div key={s.accountId} className="flex justify-between">
                <span>{s.name}</span>
                <span className="font-mono">{s.imported} txns</span>
              </div>
            ))}
          </div>
        )}
        <Button className="w-full" onClick={() => navigate('/accounts')}>Go to Accounts</Button>
      </div>
    </div>
  );
}
