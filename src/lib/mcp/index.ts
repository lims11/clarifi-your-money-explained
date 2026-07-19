import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listAccountsTool from "./tools/list-accounts";
import listTransactionsTool from "./tools/list-transactions";
import listBudgetsTool from "./tools/list-budgets";
import listGoalsTool from "./tools/list-goals";
import financialSummaryTool from "./tools/financial-summary";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "sonfi-mcp",
  title: "Sonfi",
  version: "0.1.0",
  instructions:
    "Read the signed-in Sonfi user's personal finance data: accounts, transactions, budgets, savings goals, and an overall financial summary. Use `financial_summary` first for high-level context, then drill in with the other tools.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [financialSummaryTool, listAccountsTool, listTransactionsTool, listBudgetsTool, listGoalsTool],
});
