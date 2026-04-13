import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Sparkles, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useAccounts, useMonthTransactions, useBudgets, useGoals, useScheduledTransactions, useChatMessages } from '@/hooks/useFinanceData';
import { formatCurrency } from '@/lib/finance';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  'Where is my money actually going?',
  'Am I on track with my savings goals?',
  'Which subscriptions should I cancel?',
  'Can I afford to spend £500 this weekend?',
  "What's my biggest financial risk right now?",
];

const quickActions = ['Summarise my month', 'Find ways to save', 'Am I on track?'];

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const demo = useDemoMode();
  const { data: savedMessages, isLoading: loadingMessages } = useChatMessages();
  const { data: accounts } = useAccounts();
  const { data: transactions } = useMonthTransactions();
  const { data: budgets } = useBudgets();
  const { data: goals } = useGoals();
  const { data: scheduled } = useScheduledTransactions();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initializedRef = useRef(false);

  // Load saved messages once
  useEffect(() => {
    if (savedMessages && !initializedRef.current) {
      setMessages(savedMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })));
      initializedRef.current = true;
    }
  }, [savedMessages]);

  // Pre-fill from query param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && initializedRef.current) {
      setInput(q);
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildUserContext = useMemo(() => {
    if (!accounts || !transactions || !budgets || !goals) return '';
    const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0));
    const categorySpend = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + Math.abs(Number(t.amount)); return acc; }, {} as Record<string, number>);
    const topCategories = Object.entries(categorySpend).sort(([, a], [, b]) => b - a).slice(0, 5).map(([cat, amt]) => `${cat}: ${formatCurrency(amt)}`).join(', ');

    return `Net worth: ${formatCurrency(totalBalance)}
Accounts: ${accounts.map(a => `${a.name} (${a.type}): ${formatCurrency(Number(a.balance))}`).join(', ')}
This month income: ${formatCurrency(income)}
This month expenses: ${formatCurrency(expenses)}
Top spending categories: ${topCategories}
Budgets: ${budgets.map(b => `${b.name}: ${formatCurrency(Number(b.amount))}/month`).join(', ')}
Savings goals: ${goals.map(g => `${g.name}: ${formatCurrency(Number(g.current_amount))} of ${formatCurrency(Number(g.target_amount))} (${Math.round(Number(g.current_amount) / Number(g.target_amount) * 100)}%)`).join(', ')}
Upcoming bills: ${scheduled?.filter(s => s.is_active).slice(0, 5).map(s => `${s.name}: ${formatCurrency(Math.abs(Number(s.amount)))} on ${s.next_date}`).join(', ') || 'None'}`;
  }, [accounts, transactions, budgets, goals, scheduled]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isStreaming) return;

    const userMsg: Message = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    // Save user message (only if logged in)
    if (user) {
      await supabase.from('chat_messages').insert({ user_id: user.id, role: 'user', content: msg });
    }

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          userContext: buildUserContext,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch { /* partial JSON, skip */ }
        }
      }

      // Save assistant response (only if logged in)
      if (assistantContent && user) {
        await supabase.from('chat_messages').insert({ user_id: user.id, role: 'assistant', content: assistantContent });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(errorMessage);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: demo ? "I'm in demo mode right now, but in the full app I'd analyse your real financial data and give personalised advice!" : 'Sorry, I encountered an error. Please try again.' };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const copyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isEmpty = messages.length === 0;

  if (loadingMessages) {
    return <div className="flex h-screen items-center justify-center"><Skeleton className="h-32 w-64 rounded-2xl" /></div>;
  }

  return (
    <div className="flex h-screen lg:h-[calc(100vh)] max-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-[260px] border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium">Sonfi Chat</span>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => setMessages([])}>+ New chat</Button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="label-text mb-3">Suggested questions</p>
          <div className="space-y-1.5">
            {suggestedQuestions.map(q => (
              <button key={q} onClick={() => handleSend(q)} className="w-full text-left text-xs p-2.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground leading-relaxed">{q}</button>
            ))}
          </div>
        </div>
        {/* Context panel */}
        {accounts && accounts.length > 0 && (
          <div className="p-4 border-t text-xs">
            <p className="label-text mb-2">Sonfi knows about:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>Net worth: {formatCurrency(accounts.reduce((s, a) => s + Number(a.balance), 0))}</p>
              <p>{accounts.length} accounts</p>
              {budgets && <p>{budgets.length} budgets</p>}
              {goals && <p>{goals.length} goals</p>}
            </div>
          </div>
        )}
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-primary-foreground" />
              </div>
              <h2 className="text-lg font-medium mb-1">Ask me anything about your finances</h2>
              <p className="text-sm text-muted-foreground mb-8">I have access to your accounts, transactions, budgets, and goals.</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.slice(0, 3).map(q => (
                  <button key={q} onClick={() => handleSend(q)} className="text-xs px-4 py-2.5 rounded-xl border hover:bg-muted transition-colors">{q}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Sparkles size={12} className="text-primary-foreground" />
                    </div>
                  )}
                  <div className={`group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'sonfi-card'}`}>
                    {m.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                    ) : m.content}
                    {m.role === 'assistant' && m.content && (
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => copyMessage(m.content, i)} className="p-1 rounded hover:bg-muted" aria-label="Copy message">
                          {copiedId === i ? <Check size={12} className="text-teal" /> : <Copy size={12} className="text-muted-foreground" />}
                        </button>
                        <button className="p-1 rounded hover:bg-muted" aria-label="Thumbs up"><ThumbsUp size={12} className="text-muted-foreground" /></button>
                        <button className="p-1 rounded hover:bg-muted" aria-label="Thumbs down"><ThumbsDown size={12} className="text-muted-foreground" /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles size={12} className="text-primary-foreground" />
                  </div>
                  <div className="sonfi-card px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-pulse-dot" />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Quick actions */}
        {!isEmpty && !isStreaming && (
          <div className="px-4 flex gap-2 justify-center">
            {quickActions.map(q => (
              <button key={q} onClick={() => handleSend(q)} className="text-xs px-3 py-1.5 rounded-lg border hover:bg-muted transition-colors text-muted-foreground">{q}</button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="border-t p-4 bg-card">
          <div className="max-w-3xl mx-auto flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Sonfi anything..."
              rows={1}
              className="flex-1 bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-[44px] max-h-32"
              aria-label="Chat message input"
            />
            <Button onClick={() => handleSend()} disabled={!input.trim() || isStreaming} size="icon" className="h-11 w-11 rounded-xl flex-shrink-0" aria-label="Send message">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
