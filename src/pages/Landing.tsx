import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Wand2, Bell, ArrowRight, Star, Check } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Ask anything', desc: 'Type questions in plain English. Get answers from your actual data.' },
  { icon: Wand2, title: 'Set up in 5 minutes', desc: 'Our smart wizard builds your full financial picture from a few simple questions.' },
  { icon: Bell, title: 'Stay ahead', desc: 'Pulse alerts tell you what matters before you have to go looking.' },
];

const testimonials = [
  { name: 'Sarah M.', location: 'London', text: "Clarifi spotted that I was paying £45/month for a gym I hadn't used in 3 months. Cancelled the same day.", rating: 5 },
  { name: 'Tom K.', location: 'Bristol', text: "I've tried every budgeting app. This is the first one where I actually understand where my money goes.", rating: 5 },
  { name: 'Priya R.', location: 'Manchester', text: "The AI chat is brilliant. Asked it if I could afford a holiday and it broke down exactly how to make it work.", rating: 5 },
];

const plans = [
  { name: 'Free', price: '£0', period: 'forever', features: ['3 accounts', '50 transactions/month', 'Basic chat', 'Pulse alerts'], recommended: false },
  { name: 'Pro', price: '£4.99', period: '/month', altPrice: '£44.99/year', features: ['Unlimited accounts', 'Unlimited transactions', 'Advanced AI chat', 'Custom budgets', 'Goals tracking', 'CSV export'], recommended: true },
  { name: 'Family', price: '£7.99', period: '/month', features: ['Everything in Pro', 'Up to 5 family members', 'Shared budgets', 'Family dashboard', 'Priority support'], recommended: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-medium text-primary">Clarifi</span>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/login?tab=signup"><Button size="sm">Get started free</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-foreground">
              Your money,<br />finally explained.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Connect your accounts and ask anything. Clarifi reads your real data and answers in plain English — like having a financial advisor in your pocket.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login?tab=signup"><Button size="lg">Start for free</Button></Link>
              <a href="#features"><Button variant="ghost" size="lg">See how it works</Button></a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Free to start · No card required · Runs on your real data</p>
          </div>
          <div className="clarifi-card p-0 overflow-hidden">
            <div className="bg-primary/5 px-4 py-3 border-b flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <MessageSquare size={12} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">Clarifi Chat</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[80%]">
                  Am I spending too much on eating out?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="clarifi-card p-3 text-sm max-w-[85%] leading-relaxed">
                  Looking at your last 30 days, you've spent <strong>£28.50</strong> on takeaways and eating out, which is well within your <strong>£200 monthly budget</strong> — you're only 14% through it with 18 days to go. 🎉
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value pillars */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="clarifi-card text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                <f.icon size={22} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature sections */}
      <section className="max-w-6xl mx-auto px-6 pb-24 space-y-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="clarifi-card p-6 space-y-3">
            <div className="flex gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><MessageSquare size={14} className="text-primary-foreground" /></div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Clarifi</div>
                <div className="text-sm mt-1">You have <strong>3 subscriptions</strong> totalling <strong>£47.97/month</strong> that haven't been used in 60+ days...</div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-medium mb-3">Ask your money anything</h2>
            <p className="text-muted-foreground mb-4">Clarifi analyses your real financial data and answers questions in plain English.</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-primary" /> "Where is my money actually going?"</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-primary" /> "Can I afford £500 this weekend?"</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-primary" /> "Which subscriptions should I cancel?"</li>
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl font-medium mb-3">Your AI watches while you sleep</h2>
            <p className="text-muted-foreground">Pulse alerts proactively flag spending patterns, saving opportunities, and budget warnings — so you stay ahead without checking constantly.</p>
          </div>
          <div className="order-1 lg:order-2 space-y-3">
            {[
              { type: 'warning', color: 'border-l-amber', text: 'Your dining spend is 73% higher than last month' },
              { type: 'insight', color: 'border-l-primary', text: '3 subscriptions unused in 60+ days' },
              { type: 'success', color: 'border-l-teal', text: 'All 4 budgets on track this month' },
            ].map(a => (
              <div key={a.text} className={`clarifi-card border-l-4 ${a.color} p-4`}>
                <p className="label-text mb-1">{a.type}</p>
                <p className="text-sm font-medium">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-medium text-center mb-10">What people are saying</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map(t => (
            <div key={t.name} className="clarifi-card">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber text-amber" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4">"{t.text}"</p>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-medium text-center mb-10">Simple pricing</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map(p => (
            <div key={p.name} className={`clarifi-card ${p.recommended ? 'border-primary border-2 relative' : ''}`}>
              {p.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Recommended
                </span>
              )}
              <h3 className="text-lg font-medium mb-1">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-medium">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              {p.altPrice && <p className="text-xs text-muted-foreground mb-4">or {p.altPrice}</p>}
              {!p.altPrice && <div className="mb-4" />}
              <ul className="space-y-2 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-teal" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/login?tab=signup">
                <Button variant={p.recommended ? 'default' : 'ghost'} className="w-full">
                  Get started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-medium text-primary">Clarifi</span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Clarifi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
