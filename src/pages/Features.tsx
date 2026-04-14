import { Link } from 'react-router-dom';
import { ArrowRight, Bot, BarChart3, CreditCard, TrendingUp, Calendar, Target, Shield, Zap, LineChart, Bell } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';

const features = [
  {
    icon: Bot,
    title: 'Sonfi AI Chat',
    desc: 'Ask anything about your finances. Get personalised, data-backed answers — not generic tips. Your AI financial companion that actually knows your numbers.',
    color: 'bg-[#5B5BD6]',
    tag: 'AI-Powered',
  },
  {
    icon: Bell,
    title: 'Pulse Insights',
    desc: 'Proactive alerts about overspending, unusual activity, and money-saving opportunities. Sonfi watches so you don\'t have to.',
    color: 'bg-amber-500',
    tag: 'Smart Alerts',
  },
  {
    icon: CreditCard,
    title: 'Credit Score Monitoring',
    desc: 'Your Experian credit score, updated regularly. See what affects it, get actionable tips to improve, and track your progress over time.',
    color: 'bg-emerald-500',
    tag: 'Free Forever',
  },
  {
    icon: BarChart3,
    title: 'Smart Budgets',
    desc: 'Set category budgets that track themselves. See planned vs actual spending in real time with automatic savings rate calculation.',
    color: 'bg-blue-500',
    tag: 'Auto-Track',
  },
  {
    icon: Target,
    title: 'Savings Goals',
    desc: 'Set financial targets with deadlines. Watch your progress with beautiful visualisations and get nudged when you fall behind.',
    color: 'bg-pink-500',
    tag: 'Goal Setting',
  },
  {
    icon: Calendar,
    title: 'Bill Calendar',
    desc: 'Never miss a payment. See all recurring bills, subscriptions, and income on an interactive calendar. Know your net position at a glance.',
    color: 'bg-teal-500',
    tag: 'Scheduled',
  },
  {
    icon: LineChart,
    title: 'Net Worth Tracking',
    desc: 'See your total financial picture — assets minus liabilities. Track trends over weeks, months, and years with beautiful charts.',
    color: 'bg-indigo-500',
    tag: 'Dashboard',
  },
  {
    icon: Zap,
    title: 'Personalised Offers',
    desc: 'Get matched with financial products that could save you money — better rates, cashback cards, and savings accounts tailored to your profile.',
    color: 'bg-orange-500',
    tag: 'Pro',
  },
];

export default function FeaturesPage() {
  return (
    <LandingPageShell>
      {/* Hero */}
      <section className="bg-[#1E1B4B] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-[#5B5BD6]/30 text-[#C4B5FD] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Features
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Everything you need to<br />master your money.
          </h1>
          <p className="text-[#C4B5FD] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            From AI-powered insights to automatic budgets — Sonfi brings all your finances together in one intelligent, beautiful app.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B5BD6] mb-2 block">{f.tag}</span>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Banking */}
      <section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield size={40} className="mx-auto text-[#5B5BD6] mb-6" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
            Powered by Open Banking.
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            Sonfi connects securely to your banks through FCA-regulated Open Banking. We never see your login details and can't move your money. Read-only access, bank-level encryption.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-xs text-[#6B7280]">
            {['FCA Regulated', 'Read-only Access', '256-bit Encryption', 'GDPR Compliant', 'ISO 27001'].map(b => (
              <span key={b} className="border border-gray-200 rounded-full px-4 py-1.5">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E1B4B] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to take control?
          </h2>
          <p className="text-[#C4B5FD] mb-8">Start free. No credit card required.</p>
          <Link to="/login?tab=signup" className="group inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-[1.02] text-sm">
            Get started free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </LandingPageShell>
  );
}
