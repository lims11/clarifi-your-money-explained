import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Shield, Eye, BarChart3, Sparkles } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';

const scoreRanges = [
  { label: 'Very Poor', range: '0–560', color: '#E24B4A', width: '56%' },
  { label: 'Poor', range: '561–720', color: '#D85A30', width: '72%' },
  { label: 'Fair', range: '721–880', color: '#EF9F27', width: '88%' },
  { label: 'Good', range: '881–960', color: '#1D9E75', width: '96%' },
  { label: 'Excellent', range: '961–999', color: '#059669', width: '100%' },
];

const benefits = [
  { icon: Eye, title: 'Live Score Updates', desc: 'Your Experian credit score refreshed regularly so you always know where you stand.' },
  { icon: BarChart3, title: 'Factor Breakdown', desc: 'See exactly what\'s helping and hurting your score — credit utilisation, payment history, and more.' },
  { icon: TrendingUp, title: 'Score History', desc: 'Track your credit score journey over time with month-over-month change tracking.' },
  { icon: Sparkles, title: 'AI Recommendations', desc: 'Ask Sonfi AI for personalised tips on how to improve your score based on your actual data.' },
  { icon: Shield, title: 'Soft Check Only', desc: 'Checking your score through Sonfi is a soft search — it never affects your credit rating.' },
  { icon: CheckCircle2, title: 'Free Forever', desc: 'Credit score monitoring is included free on every Sonfi plan, no strings attached.' },
];

export default function CreditScoreInfoPage() {
  return (
    <LandingPageShell>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full opacity-[0.04] blur-[200px]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Free Forever
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Your credit score,<br />explained simply.
          </h1>
          <p className="text-[#C4B5FD] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            See your Experian credit score, understand what affects it, and get clear actions to improve — all inside Sonfi.
          </p>
          {/* Score gauge illustration */}
          <div className="inline-flex items-baseline gap-1 bg-white/10 backdrop-blur rounded-2xl px-8 py-6">
            <span className="text-6xl font-extrabold text-white">942</span>
            <span className="text-lg text-emerald-300 font-semibold">/999</span>
          </div>
          <p className="text-emerald-300 text-sm mt-3 font-medium">Excellent</p>
        </div>
      </section>

      {/* Score ranges */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">
            Understanding your score range
          </h2>
          <div className="space-y-4">
            {scoreRanges.map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold text-[#111827]">{s.label}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div className="h-full rounded-full flex items-center px-3" style={{ width: s.width, backgroundColor: s.color }}>
                    <span className="text-white text-xs font-bold">{s.range}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">
            More than just a number.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <b.icon size={28} className="text-[#5B5BD6] mb-4" />
                <h3 className="text-lg font-bold text-[#111827] mb-2">{b.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E1B4B] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Check your score for free.
          </h2>
          <p className="text-[#C4B5FD] mb-8">No impact on your credit rating. Takes 30 seconds.</p>
          <Link to="/login?tab=signup" className="group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-[1.02] text-sm">
            Get your free score <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </LandingPageShell>
  );
}
