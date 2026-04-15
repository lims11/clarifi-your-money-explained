import { useState } from 'react';
import { ArrowRight, Sparkles, PiggyBank, CreditCard, Home, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpcomingBadge } from '@/components/UpcomingBadge';
import { toast } from 'sonner';

export default function OffersPage() {
  const [waitlistEmail, setWaitlistEmail] = useState('');

  const previewCards = [
    {
      icon: <PiggyBank size={20} />,
      title: 'Better savings rate',
      desc: 'Your Marcus account earns 4.1% AER. We found 3 accounts earning up to 5.2%.',
      action: 'See rates',
      colour: '#1D9E75',
    },
    {
      icon: <CreditCard size={20} />,
      title: 'Credit card switch',
      desc: "You're paying estimated £268/year in Amex interest. Balance transfer cards could give you 0% for 24 months.",
      action: 'Compare cards',
      colour: '#7F77DD',
    },
    {
      icon: <Home size={20} />,
      title: 'Mortgage review',
      desc: "Your Halifax mortgage rate isn't visible to us yet. When you connect, we can compare your rate to current market rates.",
      action: 'Check my rate',
      colour: '#378ADD',
    },
    {
      icon: <TrendingUp size={20} />,
      title: 'ISA top-up reminder',
      desc: "You've used £4,200 of your £20,000 ISA allowance this tax year.",
      action: 'Maximise my ISA',
      colour: '#EF9F27',
    },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-medium">Financial Offers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Products Sonfi thinks could benefit you based on your finances</p>
      </div>

      {/* UPCOMING banner */}
      <div className="rounded-2xl p-6 text-primary-foreground relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(220 25% 18%))' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} />
            <UpcomingBadge label="COMING SOON" />
          </div>
          <p className="text-base font-semibold mb-1">Personalised financial product recommendations</p>
          <p className="text-sm opacity-80 mb-4">
            Based on your spending, savings, and credit score, we'll suggest products that could genuinely save or earn you money — not ads, real recommendations.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email for early access"
              value={waitlistEmail}
              onChange={e => setWaitlistEmail(e.target.value)}
              className="flex-1 max-w-sm px-4 py-2.5 rounded-xl text-sm text-foreground bg-background border border-border"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (waitlistEmail) {
                  toast.success("You're on the waitlist! We'll email you when Offers launches.");
                  setWaitlistEmail('');
                }
              }}
            >
              Join waitlist →
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-full opacity-10">
          <svg viewBox="0 0 160 120" className="w-full h-full"><circle cx="120" cy="30" r="60" fill="currentColor" /><circle cx="140" cy="90" r="40" fill="currentColor" /></svg>
        </div>
      </div>

      {/* Preview cards — all UPCOMING */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">Preview of what's coming</p>
        <div className="grid md:grid-cols-2 gap-3">
          {previewCards.map((card, i) => (
            <div key={i} className="sonfi-card opacity-60 cursor-not-allowed">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.colour + '18', color: card.colour }}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold">{card.title}</h3>
                    <UpcomingBadge />
                  </div>
                  <p className="text-xs text-muted-foreground">{card.desc}</p>
                </div>
              </div>
              <button className="text-xs font-medium text-muted-foreground flex items-center gap-1 cursor-not-allowed">
                {card.action} <ArrowRight size={12} /> <span className="text-[10px]">UPCOMING</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Sonfi does not currently receive referral fees for financial products. When we launch Offers, we will always disclose any commercial relationships clearly.
        </p>
      </div>
    </div>
  );
}
