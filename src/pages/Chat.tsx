import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
// @ts-ignore
import ReactMarkdown from 'react-markdown';

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

const sampleConversation: Message[] = [
  { role: 'user', content: 'Am I spending too much on eating out?' },
  { role: 'assistant', content: "Looking at your last 30 days, you've spent **£28.50** on takeaways and eating out, which is well within your **£200 monthly budget** — you're only 14% through it with 18 days to go.\n\nThat said, this is quite a new account so I only have a small window of data. Your Sainsbury's spend of £87.40 suggests you're cooking at home regularly, which is a great sign.\n\nOne thing to watch: if you order Uber Eats a couple of times a week, that adds up quickly. At your current pace you'll come in under budget, but set a Pulse alert if you want me to flag you at £150." },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    
    const userMsg: Message = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        role: 'assistant',
        content: `Based on your financial data, here's what I can see:\n\nYour net worth is currently **£9,707.50** across 3 accounts. This month, you've earned **£3,200** in income and spent **£656.68** across various categories.\n\nYour biggest spending areas are Bills (£329.00), followed by Groceries (£87.40) and Clothing (£89.00).\n\n**Suggestion:** Consider setting up automatic transfers to your Marcus Savings account — you're so close to your Emergency Fund target!`,
      };
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen lg:h-[calc(100vh)] max-h-screen">
      {/* Sidebar - desktop only */}
      <div className="hidden lg:flex flex-col w-[260px] border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium">Clarifi Chat</span>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => setMessages([])}>
            + New chat
          </Button>
        </div>
        <div className="flex-1 p-4">
          <p className="label-text mb-3">Suggested questions</p>
          <div className="space-y-1.5">
            {suggestedQuestions.map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="w-full text-left text-xs p-2.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground leading-relaxed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-primary-foreground" />
              </div>
              <h2 className="text-lg font-medium mb-1">Ask me anything about your finances</h2>
              <p className="text-sm text-muted-foreground mb-8">I have access to your accounts, transactions, budgets, and goals.</p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                {suggestedQuestions.slice(0, 3).map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs px-4 py-2.5 rounded-xl border hover:bg-muted transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Sample conversation */}
              <div className="w-full opacity-40 space-y-3">
                <p className="label-text">Example conversation</p>
                {sampleConversation.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm text-left ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'clarifi-card'
                    }`}>
                      {m.role === 'assistant' ? (
                        <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">{m.content}</ReactMarkdown>
                      ) : m.content}
                    </div>
                  </div>
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
                  <div className={`group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'clarifi-card'
                  }`}>
                    {m.role === 'assistant' ? (
                      <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">{m.content}</ReactMarkdown>
                    ) : m.content}
                    {m.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(m.content, i)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                      >
                        {copiedId === i ? <Check size={12} className="text-teal" /> : <Copy size={12} className="text-muted-foreground" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles size={12} className="text-primary-foreground" />
                  </div>
                  <div className="clarifi-card px-4 py-3 flex gap-1">
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

        {/* Input bar */}
        <div className="border-t p-4 bg-card">
          <div className="max-w-3xl mx-auto flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Clarifi anything..."
              rows={1}
              className="flex-1 bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-[44px] max-h-32"
            />
            <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="icon" className="h-11 w-11 rounded-xl flex-shrink-0">
              <Send size={16} />
            </Button>
          </div>
          {input.length > 200 && (
            <p className="text-xs text-muted-foreground text-right mt-1 max-w-3xl mx-auto">{input.length} characters</p>
          )}
        </div>
      </div>
    </div>
  );
}
