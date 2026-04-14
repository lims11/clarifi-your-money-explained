import { Link } from 'react-router-dom';
import { Star, Shield, ArrowRight, Sparkles, TrendingUp, CreditCard } from 'lucide-react';
import LandingNav from '@/components/landing/LandingNav';
import { LaptopMockup, PhoneMockup } from '@/components/landing/DeviceMockups';
import { DashboardWebMockup, DashboardMobileMockup } from '@/components/landing/DashboardMockup';
import { ChatMockup, PulseMockup, CreditScoreMockup } from '@/components/landing/FeatureMockups';
import { BudgetsWebMockup, AccountsWebMockup, ScheduledWebMockup, PulseWebMockup } from '@/components/landing/WebMockups';
import { useScrollReveal } from '@/components/landing/useScrollReveal';
import heroAbstract from '@/assets/landing-hero-abstract.png';
import lifestyleImg from '@/assets/landing-lifestyle.png';
import sonfiIcon from '@/assets/sonfi-icon.png';
import sonfiLogo from '@/assets/sonfi-logo-horizontal.png';

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <LandingNav />

      {/* ── HERO ── */}
      <section className="relative bg-white overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#5B5BD6]/10 text-[#5B5BD6] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                <Sparkles size={12} /> AI-powered finance
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold text-[#111827] leading-[1.1] tracking-tight">
                Your money,<br className="hidden sm:block" /> finally explained.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-lg mx-auto lg:mx-0">
                Connect your accounts, ask anything, and let AI help you make smarter decisions with your money.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  to="/login?tab=signup"
                  className="group inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:scale-[1.02] text-sm"
                >
                  Start for free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center border border-[#E5E7EB] text-[#374151] font-medium px-7 py-3.5 rounded-full hover:bg-[#F9FAFB] transition-all text-sm"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start text-[11px] text-[#9CA3AF]">
                <span className="flex items-center gap-1"><Shield size={12} /> Bank-level encryption</span>
                <span>Free plan available</span>
                <span>UK regulated</span>
              </div>
            </div>

            {/* Hero visual — abstract 3D + device mockup */}
            <div className="relative hidden md:flex justify-center items-center">
              <img src={heroAbstract} alt="" className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none" />
              <div className="relative z-10 animate-float">
                <LaptopMockup className="w-full max-w-[520px]">
                  <DashboardWebMockup />
                </LaptopMockup>
              </div>
            </div>
            {/* Mobile hero */}
            <div className="md:hidden flex justify-center">
              <div className="w-[220px] animate-float">
                <PhoneMockup>
                  <DashboardMobileMockup />
                </PhoneMockup>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <Section className="border-y border-[#F3F4F6] py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-6 justify-center items-center">
          {['Open Banking', 'Experian Credit Data', '256-bit Encryption', 'FCA Regulated'].map((b) => (
            <span key={b} className="text-[11px] text-[#9CA3AF] font-medium tracking-wide uppercase">
              {b}
            </span>
          ))}
        </div>
      </Section>

      {/* ── 3 CORE FEATURES — clean cards ── */}
      <div id="features" className="py-16 sm:py-24">
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-3">
            Three things that make Sonfi different.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto">Not another spreadsheet. An AI that actually understands your finances.</p>
        </Section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Sparkles size={20} />,
              color: 'bg-[#5B5BD6]/10 text-[#5B5BD6]',
              title: 'AI Chat',
              desc: 'Ask anything about your spending, savings, or bills. Get real answers based on your actual data.',
            },
            {
              icon: <TrendingUp size={20} />,
              color: 'bg-amber-100 text-amber-600',
              title: 'Pulse Insights',
              desc: 'Proactive tips and warnings — before you even think to look. Like a financial coach on autopilot.',
            },
            {
              icon: <CreditCard size={20} />,
              color: 'bg-green-100 text-green-600',
              title: 'Credit Score',
              desc: 'Your Experian score, explained in plain English. See what\'s affecting it and how to improve.',
            },
          ].map((f) => (
            <Section key={f.title}>
              <div className="bg-white rounded-2xl p-6 border border-[#F3F4F6] hover:border-[#E5E7EB] transition-colors h-full" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            </Section>
          ))}
        </div>
      </div>

      {/* ── FEATURE SHOWCASE 1: AI Chat ── */}
      <Section className="bg-[#FAFAFA] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block bg-[#5B5BD6]/10 text-[#5B5BD6] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">✦ AI-Powered</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
                Ask Sonfi anything<br />about your money.
              </h2>
              <p className="text-[#6B7280] leading-relaxed text-base mb-6">
                Not generic tips — real insights based on your actual spending, accounts, and goals. Like having a financial adviser in your pocket.
              </p>
              <Link to="/login?tab=signup" className="inline-flex items-center gap-2 text-[#5B5BD6] font-semibold text-sm hover:underline">
                Try it free <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-[240px] sm:w-[260px] transform hover:scale-[1.02] transition-transform duration-500">
                <PhoneMockup>
                  <ChatMockup />
                </PhoneMockup>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FEATURE SHOWCASE 2: Dashboard on laptop ── */}
      <Section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <LaptopMockup className="max-w-[520px] mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                <BudgetsWebMockup />
              </LaptopMockup>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">🎯 Budgets</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
                Budgets that track themselves.
              </h2>
              <p className="text-[#6B7280] leading-relaxed text-base mb-6">
                Set limits, track categories, and see your savings rate — all updated in real time. No manual entry needed.
              </p>
              <Link to="/login?tab=signup" className="inline-flex items-center gap-2 text-[#5B5BD6] font-semibold text-sm hover:underline">
                Get started <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ── LIFESTYLE SECTION ── */}
      <Section className="bg-[#F8F9FC] py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
                Built for real life,<br />not spreadsheet lovers.
              </h2>
              <p className="text-[#6B7280] leading-relaxed text-base mb-6">
                Whether you're paying off debt, building savings, or just trying to understand where your money goes — Sonfi makes it effortless.
              </p>
              <div className="space-y-3">
                {['Connect all UK banks via Open Banking', 'Track net worth across every account', 'Get warned before you overspend'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#5B5BD6]/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#5B5BD6]" />
                    </div>
                    <span className="text-sm text-[#374151]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <img src={lifestyleImg} alt="Managing finances with Sonfi" className="w-full max-w-[400px]" loading="lazy" width={800} height={600} />
            </div>
          </div>
        </div>
      </Section>

      {/* ── ACCOUNTS LAPTOP SHOWCASE ── */}
      <Section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">🏦 Accounts</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
                All your accounts.<br />One clean view.
              </h2>
              <p className="text-[#6B7280] leading-relaxed text-base">
                Barclays, Monzo, Starling, Chase — connect hundreds of banks. See balances, trends and transactions in one place.
              </p>
            </div>
            <div>
              <LaptopMockup className="max-w-[520px] mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                <AccountsWebMockup />
              </LaptopMockup>
            </div>
          </div>
        </div>
      </Section>

      {/* ── PULSE + CREDIT SCORE side by side on phones ── */}
      <Section className="bg-[#0F0F1A] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Insights that come to you.
          </h2>
          <p className="text-[#9CA3AF] max-w-lg mx-auto">Pulse alerts and credit score monitoring — always working in the background.</p>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center items-center">
          <div className="w-[200px] sm:w-[220px] animate-float">
            <PhoneMockup>
              <PulseMockup />
            </PhoneMockup>
          </div>
          <div className="w-[200px] sm:w-[220px] animate-float-delayed">
            <PhoneMockup>
              <div className="p-4 bg-white min-h-[360px]">
                <CreditScoreMockup />
              </div>
            </PhoneMockup>
          </div>
        </div>
      </Section>

      {/* ── SOCIAL PROOF ── */}
      <Section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">
            Loved by early users.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', loc: 'London', text: "I finally feel in control of my money. The AI chat is like having a financial adviser in my pocket." },
              { name: 'James T.', loc: 'Manchester', text: "Pulse caught me overspending on subscriptions. Saved me £40 a month without even trying." },
              { name: 'Priya K.', loc: 'Birmingham', text: "Seeing my net worth grow each month is genuinely motivating. The goals feature keeps me on track." },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-[#F3F4F6]" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#374151] leading-relaxed mb-4">{t.text}</p>
                <div className="text-sm font-semibold text-[#111827]">{t.name}</div>
                <div className="text-xs text-[#9CA3AF]">{t.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ── */}
      <Section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <img src={sonfiIcon} alt="Sonfi" className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight mb-4">
            Take control of your<br />financial life today.
          </h2>
          <p className="text-[#6B7280] mb-8">Free to start. No card needed. Takes 3 minutes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/login?tab=signup"
              className="group inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:scale-[1.02] text-sm"
            >
              Get started free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center border border-[#E5E7EB] text-[#374151] font-medium px-7 py-3.5 rounded-full hover:bg-white transition-all text-sm"
            >
              See pricing
            </Link>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#111827] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <img src={sonfiLogo} alt="Sonfi" className="h-6 w-auto brightness-0 invert mb-3" />
              <p className="text-sm text-[#9CA3AF] mb-4">Your smart money companion.</p>
              <div className="flex gap-3">
                {['𝕏', 'in', '📸'].map((s) => (
                  <div key={s} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 hover:bg-white/20 transition-colors cursor-pointer">
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">Product</div>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                {['Features', 'Pricing', 'Credit Score', 'Pulse'].map((l) => (
                  <li key={l}><a href={l === 'Pricing' ? '/pricing' : '#'} className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">Company</div>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                {['About', 'Blog', 'Careers', 'Press'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">Legal</div>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Security'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-xs text-[#6B7280] text-center leading-relaxed">
            © 2025 Sonfi Ltd. Sonfi is not a lender or credit broker. Powered by Experian. Open Banking authorised.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite 1s; }
      `}</style>
    </div>
  );
}
