import { Link } from 'react-router-dom';
import { Star, Shield, ArrowRight } from 'lucide-react';
import LandingNav from '@/components/landing/LandingNav';
import { LaptopMockup, PhoneMockup } from '@/components/landing/DeviceMockups';
import { DashboardWebMockup, DashboardMobileMockup } from '@/components/landing/DashboardMockup';
import { ChatMockup, PulseMockup, CreditScoreMockup } from '@/components/landing/FeatureMockups';
import { BudgetsWebMockup, AccountsWebMockup, ScheduledWebMockup, PulseWebMockup } from '@/components/landing/WebMockups';
import { useScrollReveal } from '@/components/landing/useScrollReveal';
import logoFooter from '@/assets/sonfi-logo-horizontal-dark.png';
import lifestyle1 from '@/assets/landing-lifestyle-1.png';
import lifestyle2 from '@/assets/landing-lifestyle-2.png';

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
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
      <section className="relative bg-[#1E1B4B] overflow-hidden pt-16">
        <div className="absolute top-1/2 right-1/3 w-[600px] h-[600px] bg-[#5B5BD6] rounded-full opacity-[0.08] blur-[200px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="text-[#5B5BD6] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Your finances. Finally clear.
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-extrabold text-white leading-[1.15] tracking-tight">
                <span className="block mb-2">The smart money app</span>
                <span className="block mb-2">that actually thinks</span>
                <span className="block">with you.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-[#C4B5FD] leading-relaxed max-w-lg mx-auto lg:mx-0">
                Connect all your accounts, track every penny, crush your goals — with an AI that knows your finances better than you do.
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
                  className="inline-flex items-center border border-white/20 text-white/90 font-medium px-7 py-3.5 rounded-full hover:bg-white/5 transition-all text-sm"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 justify-center lg:justify-start text-[11px] text-[#A78BFA]">
                <span className="flex items-center gap-1"><Shield size={12} /> Bank-level security</span>
                <span>Free plan available</span>
                <span>Open Banking powered</span>
              </div>
            </div>

            {/* Device mockups */}
            <div className="relative hidden md:block">
              <div className="animate-float">
                <LaptopMockup className="w-full max-w-[560px] mx-auto">
                  <DashboardWebMockup />
                </LaptopMockup>
              </div>
              <div className="absolute bottom-4 -left-4 lg:-left-8 w-[160px] sm:w-[180px] animate-float-delayed z-10">
                <PhoneMockup>
                  <DashboardMobileMockup />
                </PhoneMockup>
              </div>
            </div>
            {/* Mobile-only hero mockup */}
            <div className="md:hidden flex justify-center">
              <div className="w-[220px] animate-float">
                <PhoneMockup>
                  <DashboardMobileMockup />
                </PhoneMockup>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-3 justify-center">
            {['Open Banking', 'Experian Credit Data', '256-bit Encryption', 'UK Regulated'].map((b) => (
              <span key={b} className="text-[10px] text-[#A78BFA] border border-white/10 rounded-full px-3 py-1">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <Section className="bg-[#F8F9FC] py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-[#6B7280] mb-2">Join thousands of UK users managing their money smarter</p>
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="text-sm font-medium text-[#111827] ml-2">4.8 / 5 from early users</span>
          </div>
        </div>
      </Section>

      {/* ── LIFESTYLE IMAGE 1 ── */}
      <Section className="py-12 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src={lifestyle1} alt="Woman using Sonfi app on her phone to manage finances" className="w-full h-auto object-cover" loading="lazy" />
          </div>
          <p className="text-center text-[#6B7280] text-sm mt-6">Real insights. Real control. Right in your pocket.</p>
        </div>
      </Section>

      {/* ── FEATURES — Only 3 core features ── */}
      <div id="features" className="py-16 sm:py-24">
        {/* Feature 1: AI Chat — the hero differentiator */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-32">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block bg-[#5B5BD6]/10 text-[#5B5BD6] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">✦ AI-Powered</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
              Ask Sonfi anything about your money.
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Not generic tips — real insights based on your actual spending. Get honest answers about your finances, instantly.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-[240px] sm:w-[280px] transform hover:scale-[1.02] transition-transform duration-500">
              <PhoneMockup>
                <ChatMockup />
              </PhoneMockup>
            </div>
          </div>
        </Section>

        {/* Feature 2: Pulse Insights */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-32">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="w-[240px] sm:w-[260px] transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
                <PhoneMockup>
                  <PulseMockup />
                </PhoneMockup>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">💡 Proactive</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
                Insights before you even ask.
              </h2>
              <p className="text-[#6B7280] leading-relaxed text-base">
                Pulse surfaces warnings, tips and wins automatically — like noticing your takeaway spend is up 40%, or that paying off your Amex saves £268/year.
              </p>
            </div>
          </div>
        </Section>

        {/* Feature 3: Credit Score */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-32">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">⭐ Free forever</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
                Your Experian credit score, explained.
              </h2>
              <p className="text-[#6B7280] leading-relaxed text-base">
                See your live score, what's affecting it, and exactly what to do to improve. Credit utilisation, action items, and history — all inside Sonfi.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-[#5B5BD6]/5 to-[#5B5BD6]/10 rounded-3xl p-6 sm:p-8 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                <CreditScoreMockup />
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ── LAPTOP SHOWCASES ── */}
      <div className="bg-[#F8F9FC] py-16 sm:py-24 space-y-16 sm:space-y-24">
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-3">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">All your finances in one beautiful, intelligent app.</p>
          </div>
        </Section>

        {/* Budgets — laptop */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <LaptopMockup className="max-w-[520px] mx-auto transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
                <BudgetsWebMockup />
              </LaptopMockup>
            </div>
            <div>
              <span className="inline-block bg-[#5B5BD6]/10 text-[#5B5BD6] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">🎯 Budgets</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight mb-3">
                Budgets that track themselves.
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                Set budgets for every category. See planned vs actual in real time, with your savings rate calculated automatically. Get warned before month-end surprises hit.
              </p>
            </div>
          </div>
        </Section>

        {/* Accounts — laptop */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">🏦 Accounts</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight mb-3">
                All your accounts. One clean view.
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                Barclays, Monzo, Starling, Chase, Marcus — connect hundreds of banks via Open Banking. See balances, sparklines and transaction flows for every account.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <LaptopMockup className="max-w-[520px] mx-auto transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                <AccountsWebMockup />
              </LaptopMockup>
            </div>
          </div>
        </Section>

        {/* Pulse — laptop */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <LaptopMockup className="max-w-[520px] mx-auto transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
                <PulseWebMockup />
              </LaptopMockup>
            </div>
            <div>
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">💡 Pulse</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight mb-3">
                Warnings, tips and wins — automatically.
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                Sonfi proactively surfaces insights based on your spending patterns. From overspending alerts to money-saving tips — without you having to ask.
              </p>
            </div>
          </div>
        </Section>

        {/* Scheduled — laptop */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">📅 Bills</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight mb-3">
                Never miss a bill again.
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                See all your recurring bills, subscriptions and income on a calendar. Know your net monthly position at a glance — Rent, Netflix, Spotify, all in one place.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <LaptopMockup className="max-w-[520px] mx-auto transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                <ScheduledWebMockup />
              </LaptopMockup>
            </div>
          </div>
        </Section>
      </div>

      {/* ── LIFESTYLE IMAGE 2 ── */}
      <Section className="bg-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src={lifestyle2} alt="Professional managing finances with Sonfi on phone and laptop" className="w-full h-auto object-cover" loading="lazy" />
          </div>
          <p className="text-center text-[#6B7280] text-sm mt-6">Whether at home or on the go — Sonfi keeps your finances clear.</p>
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">
            Real people. Real results.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', loc: 'London', text: "I finally feel in control of my money. The AI chat is like having a financial adviser in my pocket.", initials: 'SM' },
              { name: 'James T.', loc: 'Manchester', text: "Pulse caught me overspending on subscriptions and showed me which to cancel. Saved £40 a month.", initials: 'JT' },
              { name: 'Priya K.', loc: 'Birmingham', text: "Seeing my net worth grow each month is genuinely motivating. The goals feature keeps me focused.", initials: 'PK' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#111827] leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5B5BD6] flex items-center justify-center text-white text-xs font-bold">{t.initials}</div>
                  <div>
                    <div className="text-sm font-semibold text-[#111827]">{t.name}</div>
                    <div className="text-xs text-[#6B7280]">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ── */}
      <Section className="bg-[#1E1B4B] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-white tracking-tight leading-tight mb-5">
            Take control of your<br />financial life today.
          </h2>
          <p className="text-[#C4B5FD] mb-8">Free to start. No card needed. Takes 3 minutes.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link
              to="/login?tab=signup"
              className="group inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:scale-[1.02] text-sm"
            >
              Get started free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center border border-white/20 text-white/90 font-medium px-7 py-3.5 rounded-full hover:bg-white/5 transition-all text-sm"
            >
              See pricing
            </Link>
          </div>
          <div className="flex justify-center gap-4">
            <div className="bg-white/10 text-white text-[10px] px-4 py-2 rounded-lg font-medium flex items-center gap-1">
              <span className="text-base">🍎</span> App Store
            </div>
            <div className="bg-white/10 text-white text-[10px] px-4 py-2 rounded-lg font-medium flex items-center gap-1">
              <span className="text-base">▶</span> Google Play
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#E8E5F5] border-t border-[#D6D0EC] text-[#1E1B4B] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <img src={logoFooter} alt="Sonfi" className="h-8 mb-3" />
              <p className="text-sm text-[#5B5BD6] mb-4">Your smart money companion.</p>
              <div className="flex gap-3">
                {['𝕏', 'in', '📸'].map((s) => (
                  <div key={s} className="w-8 h-8 rounded-full bg-[#1E1B4B]/10 flex items-center justify-center text-xs text-[#1E1B4B]/70 hover:bg-[#1E1B4B]/20 transition-colors cursor-pointer">
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#5B5BD6] mb-3">Product</div>
              <ul className="space-y-2 text-sm text-[#1E1B4B]/70">
                {['Features', 'Pricing', 'Credit Score', 'Pulse'].map((l) => (
                  <li key={l}><a href={l === 'Pricing' ? '/pricing' : '#'} className="hover:text-[#1E1B4B] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#5B5BD6] mb-3">Company</div>
              <ul className="space-y-2 text-sm text-[#1E1B4B]/70">
                {['About', 'Blog', 'Careers', 'Press'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-[#1E1B4B] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#5B5BD6] mb-3">Legal</div>
              <ul className="space-y-2 text-sm text-[#1E1B4B]/70">
                {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Security'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-[#1E1B4B] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1E1B4B]/10 pt-6 text-xs text-[#5B5BD6] text-center leading-relaxed">
            © 2025 Sonfi Ltd. Sonfi is not a lender or credit broker. Powered by Experian. Open Banking authorised. All figures shown are illustrative.
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
