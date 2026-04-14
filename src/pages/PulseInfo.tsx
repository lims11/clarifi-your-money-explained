import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Lightbulb, TrendingUp, CheckCircle2, Bell, Zap, Brain } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';

const alertTypes = [
  {
    icon: AlertTriangle,
    type: 'Warning',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-l-amber-400',
    title: 'Takeaway spending up 42% this month',
    body: 'You\'ve spent £187 on takeaways so far — that\'s £55 more than last month. Consider meal prepping to stay on track.',
  },
  {
    icon: Lightbulb,
    type: 'Insight',
    color: 'text-[#5B5BD6]',
    bg: 'bg-[#5B5BD6]/5',
    border: 'border-l-[#5B5BD6]',
    title: 'Switching energy provider could save £320/yr',
    body: 'Based on your current direct debit of £142/month, we found 3 tariffs that could reduce your annual bill significantly.',
  },
  {
    icon: TrendingUp,
    type: 'Tip',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    border: 'border-l-teal-400',
    title: 'Pay off your Amex to save £268 in interest',
    body: 'Your current balance of £2,340 at 22.9% APR is costing you £268/year. Clearing it with savings would net you £241 after lost interest.',
  },
  {
    icon: CheckCircle2,
    type: 'Success',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-l-emerald-400',
    title: '🎉 You saved £120 more than last month!',
    body: 'Your savings rate jumped from 8% to 14% this month. At this pace, you\'ll hit your holiday fund goal 6 weeks early.',
  },
];

const howItWorks = [
  { icon: Brain, title: 'Analyses your data', desc: 'Sonfi continuously monitors your transactions, balances, and spending patterns.' },
  { icon: Zap, title: 'Spots opportunities', desc: 'AI detects anomalies, trends, and money-saving opportunities across all your accounts.' },
  { icon: Bell, title: 'Alerts you proactively', desc: 'You get personalised notifications — no need to dig through spreadsheets or statements.' },
];

export default function PulseInfoPage() {
  return (
    <LandingPageShell>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500 rounded-full opacity-[0.04] blur-[200px]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Smart Alerts
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Your money talks.<br />Pulse translates.
          </h1>
          <p className="text-[#C4B5FD] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Warnings, tips, and wins delivered to you automatically — based on your real spending, not guesswork.
          </p>
        </div>
      </section>

      {/* Alert Examples */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-4">
            See what Pulse catches for you.
          </h2>
          <p className="text-[#6B7280] text-center mb-12 max-w-xl mx-auto">Real examples of the kind of insights Sonfi surfaces for users every week.</p>
          <div className="space-y-4">
            {alertTypes.map((a) => (
              <div key={a.title} className={`${a.bg} rounded-xl p-5 border-l-4 ${a.border}`}>
                <div className="flex items-start gap-3">
                  <a.icon size={20} className={`${a.color} mt-0.5 flex-shrink-0`} />
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${a.color}`}>{a.type}</span>
                    <h3 className="text-sm font-bold text-[#111827] mt-1 mb-1">{a.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{a.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">
            How Pulse works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#5B5BD6] flex items-center justify-center mx-auto mb-4">
                  <step.icon size={28} className="text-white" />
                </div>
                <div className="text-xs font-bold text-[#5B5BD6] mb-2">Step {i + 1}</div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{step.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E1B4B] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-[#C4B5FD] mb-8">Pulse is included in Premium and Pro plans.</p>
          <Link to="/login?tab=signup" className="group inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-[1.02] text-sm">
            Try Pulse free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </LandingPageShell>
  );
}
