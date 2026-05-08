import { useEffect, useState } from 'react';
import { CalendarClock, Settings2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';

interface UploadReminderLabelProps {
  accountId: string;
  onManage: () => void;
}

function computeNextDate(frequency: string, dayOfMonth?: number | null): Date {
  const now = new Date();
  const day = dayOfMonth ?? 2;

  if (frequency === 'weekly') {
    const next = new Date(now);
    next.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
    return next;
  }

  if (frequency === 'quarterly') {
    const quarterMonth = Math.floor(now.getMonth() / 3) * 3 + 3;
    const next = new Date(now.getFullYear(), quarterMonth, day);
    if (next <= now) next.setMonth(next.getMonth() + 3);
    return next;
  }

  // monthly (default)
  const next = new Date(now.getFullYear(), now.getMonth(), day);
  if (next <= now) next.setMonth(next.getMonth() + 1);
  return next;
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function UploadReminderLabel({ accountId, onManage }: UploadReminderLabelProps) {
  const { user } = useAuth();
  const demo = useDemoMode();
  const [reminder, setReminder] = useState<{ frequency: string; payday_date: number | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user || demo || !UUID_PATTERN.test(accountId)) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('reminder_preferences')
        .select('frequency, payday_date')
        .eq('user_id', user.id)
        .eq('entity_type', 'statement_upload')
        .eq('entity_id', accountId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!mounted) return;
      if (!error && data?.[0]) setReminder(data[0]);
      setLoading(false);
    };

    void load();
    return () => { mounted = false; };
  }, [accountId, demo, user]);

  if (loading || !reminder) return null;

  const nextDate = computeNextDate(reminder.frequency, reminder.payday_date);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground mt-1.5">
      <span className="flex items-center gap-1">
        <CalendarClock size={11} />
        Next upload: <span className="font-medium text-foreground">{formatShortDate(nextDate)}</span>
      </span>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onManage(); }}
        className="flex items-center gap-1 text-primary hover:underline"
      >
        <Settings2 size={10} /> Manage reminder
      </button>
    </div>
  );
}