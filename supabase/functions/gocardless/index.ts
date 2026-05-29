import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const GC_BASE = 'https://bankaccountdata.gocardless.com/api/v2';

async function getAccessToken(): Promise<string> {
  const secretId = Deno.env.get('GOCARDLESS_SECRET_ID');
  const secretKey = Deno.env.get('GOCARDLESS_SECRET_KEY');
  if (!secretId || !secretKey) throw new Error('GoCardless credentials not configured');
  const r = await fetch(`${GC_BASE}/token/new/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ secret_id: secretId, secret_key: secretKey }),
  });
  if (!r.ok) throw new Error(`GoCardless token failed ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.access as string;
}

async function gcFetch(path: string, token: string, init: RequestInit = {}) {
  const r = await fetch(`${GC_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`GoCardless ${path} ${r.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    const token = await getAccessToken();

    if (action === 'list-institutions') {
      const country = body.country || 'GB';
      const list = await gcFetch(`/institutions/?country=${country}`, token);
      return jsonResponse({ institutions: list });
    }

    if (action === 'create-link') {
      // Creates an end-user agreement + requisition, returns the hosted link to redirect to
      const { institutionId, redirectUrl, userId } = body;
      if (!institutionId || !redirectUrl) return jsonResponse({ error: 'institutionId and redirectUrl required' }, 400);

      const agreement = await gcFetch('/agreements/enduser/', token, {
        method: 'POST',
        body: JSON.stringify({
          institution_id: institutionId,
          max_historical_days: 90,
          access_valid_for_days: 90,
          access_scope: ['balances', 'details', 'transactions'],
        }),
      });

      const reference = `sonfi-${userId || 'anon'}-${Date.now()}`;
      const requisition = await gcFetch('/requisitions/', token, {
        method: 'POST',
        body: JSON.stringify({
          redirect: redirectUrl,
          institution_id: institutionId,
          reference,
          agreement: agreement.id,
          user_language: 'EN',
        }),
      });

      return jsonResponse({
        link: requisition.link,
        requisitionId: requisition.id,
        reference,
      });
    }

    if (action === 'finalise') {
      // After redirect back: pull account IDs, balances, and transactions, then write to DB
      const { requisitionId, userId, institutionName } = body;
      if (!requisitionId || !userId) return jsonResponse({ error: 'requisitionId and userId required' }, 400);

      const requisition = await gcFetch(`/requisitions/${requisitionId}/`, token);
      if (!requisition.accounts || requisition.accounts.length === 0) {
        return jsonResponse({ error: 'Bank linking incomplete — no accounts returned' }, 400);
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );

      const summaries: Array<{ accountId: string; name: string; balance: number; imported: number }> = [];

      for (const gcAccountId of requisition.accounts) {
        const [details, balances, txns] = await Promise.all([
          gcFetch(`/accounts/${gcAccountId}/details/`, token).catch(() => null),
          gcFetch(`/accounts/${gcAccountId}/balances/`, token).catch(() => ({ balances: [] })),
          gcFetch(`/accounts/${gcAccountId}/transactions/`, token).catch(() => ({ transactions: { booked: [] } })),
        ]);

        const accountName = details?.account?.name || details?.account?.product || `${institutionName || 'Bank'} Account`;
        const balance = Number(balances?.balances?.[0]?.balanceAmount?.amount || 0);

        const { data: created, error: insertError } = await supabase
          .from('accounts')
          .insert({
            user_id: userId,
            name: accountName,
            type: 'current',
            institution: institutionName || 'Bank',
            balance,
            currency: details?.account?.currency || 'GBP',
            is_active: true,
          })
          .select('id, name')
          .single();
        if (insertError) throw insertError;

        const booked = txns?.transactions?.booked || [];
        const rows = booked.map((t: any) => {
          const amount = Number(t.transactionAmount?.amount || 0);
          const description = (t.remittanceInformationUnstructured || t.creditorName || t.debtorName || 'Transaction').toString().slice(0, 200);
          return {
            user_id: userId,
            account_id: created.id,
            date: t.bookingDate || t.valueDate || new Date().toISOString().slice(0, 10),
            payee: description,
            description,
            amount,
            type: amount >= 0 ? 'income' : 'expense',
            category: amount >= 0 ? 'Income' : 'Shopping',
          };
        });

        if (rows.length > 0) {
          // Dedupe within import + skip existing
          const seen = new Set<string>();
          const unique = rows.filter((r: any) => {
            const k = `${r.date}|${r.amount}|${r.payee?.toLowerCase()?.slice(0, 40)}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          });
          for (let i = 0; i < unique.length; i += 100) {
            const batch = unique.slice(i, i + 100);
            const { error } = await supabase.from('transactions').insert(batch);
            if (error) throw error;
          }
        }

        summaries.push({ accountId: created.id, name: created.name, balance, imported: rows.length });
      }

      return jsonResponse({ accounts: summaries });
    }

    return jsonResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (e: any) {
    console.error('gocardless error', e);
    return jsonResponse({ error: e?.message || 'GoCardless error' }, 500);
  }
});
