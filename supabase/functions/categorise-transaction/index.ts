import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { payee, amount, description } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are a transaction categoriser for a UK personal finance app. Given a payee name, amount, and optional description, return the most likely category and subcategory. Use these categories: Food & Drink, Transport, Bills, Shopping, Entertainment, Health, Travel, Education, Savings, Investment, Income, Personal. Return a JSON object with: category, subcategory, confidence (0-1), reason.`
          },
          {
            role: "user",
            content: `Payee: ${payee}\nAmount: £${Math.abs(amount).toFixed(2)}\nDescription: ${description || 'N/A'}\nType: ${amount > 0 ? 'income' : 'expense'}`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "categorise",
            description: "Categorise a financial transaction",
            parameters: {
              type: "object",
              properties: {
                category: { type: "string" },
                subcategory: { type: "string" },
                confidence: { type: "number" },
                reason: { type: "string" }
              },
              required: ["category", "subcategory", "confidence", "reason"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "categorise" } }
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Categorisation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      category: amount > 0 ? "Income" : "Shopping",
      subcategory: "Other",
      confidence: 0.5,
      reason: "Default categorisation"
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("categorise error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
