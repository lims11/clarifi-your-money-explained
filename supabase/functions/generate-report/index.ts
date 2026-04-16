const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { data, reportType, periodStart, periodEnd } = await req.json()

    const fmt = (n: number) =>
      new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n)

    const formatDate = (d: string) =>
      new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

    const categoryRows = (data.categories || [])
      .map(
        (cat: any) => `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;font-size:12px;">
        <span style="min-width:120px;color:#444;">${cat.name}</span>
        <div style="flex:1;height:8px;background:#F0EEF8;border-radius:4px;overflow:hidden;">
          <div style="height:100%;border-radius:4px;background:${cat.colour || '#7F77DD'};width:${cat.pct || 0}%;"></div>
        </div>
        <span style="min-width:70px;text-align:right;font-weight:500;color:#D85A30;">${fmt(cat.amount)}</span>
      </div>`
      )
      .join('')

    const txRows = (data.transactions || [])
      .map(
        (tx: any) => `
      <tr>
        <td>${formatDate(tx.date)}</td>
        <td>${tx.payee || tx.description || '-'}</td>
        <td>${tx.category}</td>
        <td>${tx.accountName || '-'}</td>
        <td class="${tx.amount > 0 ? 'amount-positive' : 'amount-negative'}">${tx.amount > 0 ? '+' : ''}${fmt(tx.amount)}</td>
      </tr>`
      )
      .join('')

    const goalCards = (data.goals || [])
      .map((g: any) => {
        const pct = Math.round(((g.current || 0) / (g.target || 1)) * 100)
        return `
      <div style="background:#F9F8F6;border-radius:10px;padding:16px;margin-bottom:12px;border:1px solid #E5E3DE;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-weight:600;font-size:13px;">${g.icon || '🎯'} ${g.name}</span>
          <span style="font-weight:600;color:#1D9E75;">${pct}%</span>
        </div>
        <div style="height:6px;background:#E5E3DE;border-radius:3px;overflow:hidden;">
          <div style="height:100%;border-radius:3px;background:#1D9E75;width:${pct}%;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:#888;">
          <span>${fmt(g.current || 0)} of ${fmt(g.target)}</span>
          <span>Target: ${g.targetDate ? formatDate(g.targetDate) : 'N/A'}</span>
        </div>
      </div>`
      })
      .join('')

    const insightCards = (data.pulseAlerts || [])
      .slice(0, 5)
      .map((a: any) => {
        const typeMap: Record<string, string> = {
          warning: 'background:#FFFBEB;border-color:#EF9F27;',
          tip: 'background:#F0FDF4;border-color:#1D9E75;',
          insight: 'background:#EEF2FF;border-color:#7F77DD;',
          success: 'background:#F0FDF4;border-color:#1D9E75;',
        }
        return `
      <div style="padding:14px 16px;border-radius:10px;margin-bottom:10px;border-left:4px solid;font-size:12px;${typeMap[a.type] || typeMap.insight}">
        <div style="font-weight:600;margin-bottom:3px;">${a.title}</div>
        <div style="color:#666;">${a.body}</div>
      </div>`
      })
      .join('')

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; color:#1A1A1A; background:white; }
  .report-header {
    background:linear-gradient(135deg,#7F77DD 0%,#534AB7 100%);
    padding:40px 48px 32px; color:white;
    display:flex; justify-content:space-between; align-items:flex-start;
  }
  .logo { font-size:28px; font-weight:700; letter-spacing:-0.5px; }
  .logo span { opacity:0.7; font-weight:300; }
  .report-title { font-size:14px; opacity:0.85; margin-top:4px; }
  .report-period { text-align:right; font-size:13px; opacity:0.8; }
  .report-period strong { font-size:16px; display:block; opacity:1; }
  .tagline-bar {
    background:#534AB7; padding:8px 48px; font-size:11px;
    color:rgba(255,255,255,0.6); letter-spacing:0.08em; text-transform:uppercase;
  }
  .content { padding:40px 48px; }
  .summary-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:40px; }
  .summary-card { background:#F9F8F6; border-radius:12px; padding:20px; border:1px solid #E5E3DE; }
  .summary-card .label { font-size:10px; text-transform:uppercase; letter-spacing:0.08em; color:#888; margin-bottom:6px; }
  .summary-card .value { font-size:22px; font-weight:600; color:#1A1A1A; }
  .summary-card .value.positive { color:#1D9E75; }
  .summary-card .value.negative { color:#D85A30; }
  .summary-card .value.purple { color:#7F77DD; }
  .section-header {
    font-size:16px; font-weight:600; color:#1A1A1A; margin:32px 0 16px;
    padding-bottom:8px; border-bottom:2px solid #7F77DD;
    display:flex; align-items:center; gap:8px;
  }
  .section-header .dot { width:8px; height:8px; border-radius:50%; background:#7F77DD; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  th {
    background:#F3F1FF; color:#534AB7; font-weight:600; font-size:10px;
    text-transform:uppercase; letter-spacing:0.06em; padding:10px 12px; text-align:left;
  }
  td { padding:10px 12px; border-bottom:1px solid #F0EEF8; }
  tr:nth-child(even) td { background:#FAFAFA; }
  .amount-positive { color:#1D9E75; font-weight:500; }
  .amount-negative { color:#D85A30; font-weight:500; }
  .report-footer {
    margin-top:48px; padding:24px 48px; background:#F9F8F6;
    border-top:1px solid #E5E3DE; display:flex;
    justify-content:space-between; align-items:center; font-size:11px; color:#888;
  }
  .footer-logo { font-weight:700; color:#7F77DD; font-size:14px; }
  .footer-disclaimer { max-width:500px; line-height:1.5; }
  @media print {
    .report-header, .summary-card, .tagline-bar, th {
      -webkit-print-color-adjust:exact; print-color-adjust:exact;
    }
  }
</style>
</head>
<body>
  <div class="report-header">
    <div>
      <div class="logo">Sonfi</div>
      <div class="report-title">Personal Finance Report</div>
    </div>
    <div class="report-period">
      <strong>${periodStart ? formatDate(periodStart) : ''} — ${periodEnd ? formatDate(periodEnd) : ''}</strong>
      Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
    </div>
  </div>
  <div class="tagline-bar">Your money, finally explained — sonfi.co.uk</div>

  <div class="content">
    <div class="summary-grid">
      <div class="summary-card">
        <div class="label">Net Worth</div>
        <div class="value purple">${fmt(data.netWorth || 0)}</div>
      </div>
      <div class="summary-card">
        <div class="label">Total Income</div>
        <div class="value positive">${fmt(data.totalIncome || 0)}</div>
      </div>
      <div class="summary-card">
        <div class="label">Total Expenses</div>
        <div class="value negative">${fmt(data.totalExpenses || 0)}</div>
      </div>
      <div class="summary-card">
        <div class="label">Net Saved</div>
        <div class="value ${(data.netSaved || 0) >= 0 ? 'positive' : 'negative'}">${fmt(data.netSaved || 0)}</div>
      </div>
    </div>

    ${categoryRows ? `<div class="section-header"><div class="dot"></div>Spending breakdown</div>${categoryRows}` : ''}

    ${txRows ? `
    <div class="section-header"><div class="dot"></div>All transactions</div>
    <table>
      <thead><tr><th>Date</th><th>Payee</th><th>Category</th><th>Account</th><th>Amount</th></tr></thead>
      <tbody>${txRows}</tbody>
    </table>` : ''}

    ${goalCards ? `<div class="section-header"><div class="dot"></div>Savings goals</div>${goalCards}` : ''}

    ${insightCards ? `<div class="section-header"><div class="dot"></div>Sonfi insights</div>${insightCards}` : ''}
  </div>

  <div class="report-footer">
    <div>
      <div class="footer-logo">Sonfi</div>
      <div>sonfi.co.uk</div>
    </div>
    <div class="footer-disclaimer">
      This report is generated from data you have provided to Sonfi. It is for informational
      purposes only and does not constitute financial advice. Sonfi is not a regulated financial
      advisor. Always consult a qualified professional for major financial decisions.
    </div>
  </div>
</body>
</html>`

    return new Response(JSON.stringify({ html }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
