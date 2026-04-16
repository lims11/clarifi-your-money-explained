const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bank-specific CSV column mappings
const BANK_COLUMNS: Record<string, { date: string; description: string; amount?: string; debit?: string; credit?: string; balance?: string }> = {
  barclays: { date: 'Date', description: 'Memo', amount: 'Amount', balance: 'Balance' },
  hsbc: { date: 'Date', description: 'Description', amount: 'Amount', balance: 'Balance' },
  natwest: { date: 'Date', description: 'Description', debit: 'Debit Amount', credit: 'Credit Amount', balance: 'Balance' },
  monzo: { date: 'Date', description: 'Name', amount: 'Amount', balance: 'Balance' },
  starling: { date: 'Date', description: 'Counter Party', amount: 'Amount (GBP)' },
  revolut: { date: 'Started Date', description: 'Description', amount: 'Amount' },
};

function parseCSVString(text: string): any[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  const rows: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;
    const row: any = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

function normaliseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  // Try ISO format first
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.substring(0, 10);
  // DD/MM/YYYY
  const dmy = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dmy) {
    const year = dmy[3].length === 2 ? '20' + dmy[3] : dmy[3];
    return `${year}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }
  // Try Date.parse as fallback
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return new Date().toISOString().split('T')[0];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { csvText, bankId } = await req.json();
    
    if (!csvText || typeof csvText !== 'string') {
      return new Response(JSON.stringify({ error: 'csvText is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rows = parseCSVString(csvText);
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'No data rows found in CSV' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try to find column mapping
    const cols = BANK_COLUMNS[bankId] || null;
    const headers = Object.keys(rows[0]);

    // Auto-detect columns if no mapping
    const findCol = (candidates: string[]) => 
      headers.find(h => candidates.some(c => h.toLowerCase().includes(c.toLowerCase())));

    const dateCol = cols?.date || findCol(['date', 'Date', 'Transaction Date', 'Booking Date']) || headers[0];
    const descCol = cols?.description || findCol(['description', 'memo', 'name', 'narrative', 'details', 'payee', 'counter party', 'reference']) || headers[1];
    const amountCol = cols?.amount || findCol(['amount', 'value', 'sum']);
    const debitCol = cols?.debit || findCol(['debit', 'money out', 'paid out', 'withdrawal']);
    const creditCol = cols?.credit || findCol(['credit', 'money in', 'paid in', 'deposit']);

    const transactions: any[] = [];

    for (const row of rows) {
      try {
        const dateStr = row[dateCol];
        const description = row[descCol] || '';
        
        let amount = 0;
        if (amountCol && row[amountCol] !== undefined) {
          amount = parseFloat(String(row[amountCol]).replace(/[£$,\s]/g, ''));
        } else if (debitCol || creditCol) {
          const debit = parseFloat(String(row[debitCol] || '0').replace(/[£$,\s]/g, '')) || 0;
          const credit = parseFloat(String(row[creditCol] || '0').replace(/[£$,\s]/g, '')) || 0;
          amount = credit > 0 ? credit : -Math.abs(debit);
        }

        if (isNaN(amount) || amount === 0) continue;

        transactions.push({
          date: normaliseDate(dateStr),
          description: description.trim(),
          amount,
          type: amount > 0 ? 'income' : 'expense',
          rawDescription: description.trim(),
        });
      } catch (_e) { /* skip malformed rows */ }
    }

    // Now categorise each transaction using AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (LOVABLE_API_KEY && transactions.length > 0) {
      // Batch categorise - send all descriptions at once
      const txList = transactions.slice(0, 100).map((t, i) => 
        `${i + 1}. "${t.description}" £${Math.abs(t.amount).toFixed(2)} (${t.type})`
      ).join('\n');

      try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You are a UK bank transaction categoriser. For each numbered transaction, return a JSON array where each element has: index (1-based), category (one of: Food & Drink, Transport, Bills, Shopping, Entertainment, Health, Travel, Education, Savings, Investment, Income, Personal), subcategory (specific like Groceries, Fuel, Streaming, Salary etc), confidence (0-1). Return ONLY the JSON array, no markdown.`,
              },
              { role: 'user', content: txList },
            ],
            temperature: 0.1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content || '';
          // Extract JSON from response
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const categories = JSON.parse(jsonMatch[0]);
            for (const cat of categories) {
              const idx = (cat.index || cat.i) - 1;
              if (idx >= 0 && idx < transactions.length) {
                transactions[idx].suggestedCategory = cat.category;
                transactions[idx].suggestedSubcategory = cat.subcategory;
                transactions[idx].confidence = cat.confidence;
              }
            }
          }
        }
      } catch (e) {
        console.error('AI categorisation failed, continuing without:', e);
      }
    }

    // Fill defaults for uncategorised
    for (const t of transactions) {
      if (!t.suggestedCategory) {
        t.suggestedCategory = t.type === 'income' ? 'Income' : 'Shopping';
        t.suggestedSubcategory = 'Other';
        t.confidence = 0.3;
      }
    }

    return new Response(JSON.stringify({ 
      transactions,
      summary: {
        total: transactions.length,
        income: transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)),
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('parse-statement error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
