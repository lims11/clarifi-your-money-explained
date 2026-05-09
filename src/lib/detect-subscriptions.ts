import { supabase } from '@/integrations/supabase/client';

interface TxnLite {
  date: string;
  amount: number;
  payee?: string | null;
  description?: string | null;
  account_id?: string | null;
}

const KNOWN_SUBS = ['netflix', 'spotify', 'disney', 'amazon prime', 'apple', 'icloud', 'youtube', 'hulu', 'now tv', 'audible', 'github', 'chatgpt', 'openai', 'dropbox', 'notion', 'figma', 'gym', 'adobe', 'microsoft', 'paramount'];

function normaliseName(raw?: string | null): string {
  if (!raw) return '';
  return raw.toLowerCase().replace(/\d+/g, '').replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);
}

/**
 * Detects recurring (subscription-like) charges and writes them into
 * the `subscriptions` table + emits a Pulse alert summarising findings.
 * Safe to call after every import — uses upsert-like de-duping.
 */
export async function detectSubscriptionsAndAlert(userId: string) {
  // Pull last 120 days of expense transactions
  const since = new Date();
  since.setDate(since.getDate() - 120);
  const { data: txns, error } = await supabase
    .from('transactions')
    .select('date, amount, payee, description, account_id')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .gte('date', since.toISOString().slice(0, 10));
  if (error || !txns?.length) return { detected: 0 };

  // Group by normalised payee
  const groups = new Map<string, TxnLite[]>();
  for (const t of txns as TxnLite[]) {
    const key = normaliseName(t.payee || t.description);
    if (!key) continue;
    const arr = groups.get(key) || [];
    arr.push(t);
    groups.set(key, arr);
  }

  const found: { name: string; amount: number; account_id: string | null }[] = [];
  for (const [name, items] of groups) {
    if (items.length < 2) continue;
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    const amount = Math.abs(Number(sorted[sorted.length - 1].amount));
    const known = KNOWN_SUBS.some(s => name.includes(s));
    // Recurring if either: known sub OR similar amount (±10%) AND 25–35 day cadence between two recent
    let recurring = known;
    if (!recurring && sorted.length >= 2) {
      const last = sorted[sorted.length - 1];
      const prev = sorted[sorted.length - 2];
      const days = (new Date(last.date).getTime() - new Date(prev.date).getTime()) / 86400000;
      const amtClose = Math.abs(Math.abs(Number(last.amount)) - Math.abs(Number(prev.amount))) / Math.max(1, Math.abs(Number(last.amount))) < 0.1;
      if (amtClose && days >= 25 && days <= 35) recurring = true;
    }
    if (!recurring) continue;
    found.push({ name: name.replace(/\b\w/g, c => c.toUpperCase()), amount, account_id: sorted[sorted.length - 1].account_id || null });
  }

  if (found.length === 0) return { detected: 0 };

  // De-dupe vs existing
  const { data: existing } = await supabase.from('subscriptions').select('service_name').eq('user_id', userId);
  const existingSet = new Set((existing || []).map(s => s.service_name.toLowerCase()));
  const toInsert = found.filter(f => !existingSet.has(f.name.toLowerCase())).map(f => ({
    user_id: userId,
    service_name: f.name,
    amount: f.amount,
    account_id: f.account_id,
    billing_frequency: 'monthly',
    is_active: true,
    usage_status: 'unknown',
  }));

  if (toInsert.length > 0) {
    await supabase.from('subscriptions').insert(toInsert);
  }

  // Emit a single Pulse alert summarising the finding
  if (found.length > 0) {
    const totalMonthly = found.reduce((s, f) => s + f.amount, 0);
    await supabase.from('pulse_alerts').insert({
      user_id: userId,
      type: 'insight',
      title: `Found ${found.length} recurring subscription${found.length === 1 ? '' : 's'}`,
      body: `Sonfi detected ~£${totalMonthly.toFixed(2)}/mo across ${found.map(f => f.name).slice(0, 4).join(', ')}${found.length > 4 ? '…' : ''}. Review them in Settings.`,
      action_label: 'Review subscriptions',
      is_read: false,
    });
  }

  return { detected: found.length, inserted: toInsert.length };
}
