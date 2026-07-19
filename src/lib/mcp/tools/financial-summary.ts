import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "financial_summary",
  title: "Financial summary",
  description: "Return the signed-in user's overall financial snapshot: net worth, this-month income and expenses, and top spending categories.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const isoMonth = startOfMonth.toISOString().slice(0, 10);

    const [accountsRes, txRes] = await Promise.all([
      supabase.from("accounts").select("balance,type,is_active").eq("is_active", true),
      supabase.from("transactions").select("amount,type,category").gte("date", isoMonth),
    ]);
    if (accountsRes.error) return { content: [{ type: "text", text: accountsRes.error.message }], isError: true };
    if (txRes.error) return { content: [{ type: "text", text: txRes.error.message }], isError: true };

    const netWorth = (accountsRes.data ?? []).reduce((s, a) => s + Number(a.balance), 0);
    const income = (txRes.data ?? []).filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expenses = Math.abs(
      (txRes.data ?? []).filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
    );
    const catMap: Record<string, number> = {};
    for (const t of txRes.data ?? []) {
      if (t.type !== "expense") continue;
      catMap[t.category] = (catMap[t.category] ?? 0) + Math.abs(Number(t.amount));
    }
    const topCategories = Object.entries(catMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    const summary = { netWorth, monthIncome: income, monthExpenses: expenses, topCategories, currency: "GBP" };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
