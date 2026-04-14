import { Link } from 'react-router-dom';
import { Star, Check, Shield, Lock } from 'lucide-react';
import LandingNav from '@/components/landing/LandingNav';
import { LaptopMockup, PhoneMockup } from '@/components/landing/DeviceMockups';
import { DashboardWebMockup, DashboardMobileMockup } from '@/components/landing/DashboardMockup';
import {
  ChatMockup, PulseMockup, BudgetsMockup,
  CreditScoreMockup, AccountsMockup, ScheduledMockup, GoalsMockup,
} from '@/components/landing/FeatureMockups';
import { useScrollReveal } from '@/components/landing/useScrollReveal';

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
      <section className="relative bg-[#0F0F1A] overflow-hidden pt-16">
        <div className="absolute top-1/2 right-1/3 w-[600px] h-[600px] bg-[#5B5BD6] rounded-full opacity-[0.08] blur-[200px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="text-[#5B5BD6] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Your finances. Finally clear.
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-extrabold text-white leading-tight tracking-tight">
                The smart money app<br className="hidden sm:block" /> that actually thinks<br className="hidden sm:block" /> with you.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#9CA3AF] leading-relaxed max-w-lg mx-auto lg:mx-0">
                Connect all your accounts, track every penny, crush your goals — with an AI that knows your finances better than you do.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  to="/login?tab=signup"
                  className="inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:scale-[1.02] text-sm"
                >
                  Start for free <span>→</span>
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center border border-white/20 text-white/90 font-medium px-7 py-3.5 rounded-full hover:bg-white/5 transition-all text-sm"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 justify-center lg:justify-start text-[11px] text-[#6B7280]">
                <span className="flex items-center gap-1"><Lock size={12} /> Bank-level security</span>
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
              <div className="absolute -bottom-8 -left-4 lg:-left-8 w-[160px] sm:w-[180px] animate-float-delayed z-10">
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
              <span key={b} className="text-[10px] text-[#6B7280] border border-white/10 rounded-full px-3 py-1">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <Section className="bg-[#F8F9FC] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-[#6B7280] mb-3">Join thousands of UK users managing their money smarter</p>
          <div className="flex items-center justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="text-sm font-medium text-[#111827] ml-2">4.8 / 5 from early users</span>
          </div>
          <div className="flex justify-center gap-4">
            <div className="bg-black text-white text-[10px] px-4 py-2 rounded-lg font-medium flex items-center gap-1">
              <span className="text-base">🍎</span> App Store
            </div>
            <div className="bg-black text-white text-[10px] px-4 py-2 rounded-lg font-medium flex items-center gap-1">
              <span className="text-base">▶</span> Google Play
            </div>
          </div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <div id="features" className="py-16 sm:py-24 space-y-16 sm:space-y-24">
        {/* Feature 1: Dashboard */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <LaptopMockup className="max-w-[500px] mx-auto transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <DashboardWebMockup />
              </LaptopMockup>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-2xl mb-3">📊</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4 tracking-tight">
                Your complete financial picture, at a glance
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                See your net worth, assets, liabilities and monthly change in one beautiful dashboard. Sonfi pulls everything together across all your accounts so you're never guessing.
              </p>
              <a href="#" className="text-[#5B5BD6] font-medium text-sm hover:underline">Learn more →</a>
            </div>
          </div>
        </Section>

        {/* Feature 2: AI Chat */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-2xl mb-3">✦</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4 tracking-tight">
                Ask Sonfi anything. Get answers that actually help.
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Not generic tips — real insights based on your actual spending. Ask "Am I spending too much on eating out?" or "Can I afford a holiday in June?" and get a detailed, honest answer.
              </p>
              <a href="#" className="text-[#5B5BD6] font-medium text-sm hover:underline">Learn more →</a>
            </div>
            <div className="max-w-[260px] mx-auto lg:ml-auto">
              <PhoneMockup>
                <ChatMockup />
              </PhoneMockup>
            </div>
          </div>
        </Section>

        {/* Feature 3: Budgets */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <LaptopMockup className="max-w-[500px] mx-auto">
                <BudgetsMockup />
              </LaptopMockup>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-2xl mb-3">🎯</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4 tracking-tight">
                Budgets that track themselves — and warn you early
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Set budgets for every category. Sonfi shows you planned vs actual in real time, calculates your savings rate, and tells you exactly where you're overspending before month-end surprises hit.
              </p>
              <a href="#" className="text-[#5B5BD6] font-medium text-sm hover:underline">Learn more →</a>
            </div>
          </div>
        </Section>

        {/* Feature 4: Pulse */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-2xl mb-3">💡</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4 tracking-tight">
                Proactive insights. Before you even ask.
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Pulse is your financial newsfeed. Sonfi automatically surfaces warnings, tips and wins — like noticing your takeaway spend is up 40%, or that paying off your Amex in full saves £268/year.
              </p>
              <a href="#" className="text-[#5B5BD6] font-medium text-sm hover:underline">Learn more →</a>
            </div>
            <div className="max-w-[260px] mx-auto lg:ml-auto">
              <PhoneMockup>
                <PulseMockup />
              </PhoneMockup>
            </div>
          </div>
        </Section>

        {/* Feature 5: Credit Score */}
        <Section id="credit-score" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-[#5B5BD6]/5 to-[#5B5BD6]/10 rounded-3xl p-8">
              <CreditScoreMockup />
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-2xl mb-3">⭐</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4 tracking-tight">
                Your Experian credit score. Free, live, and explained.
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Sonfi shows your live Experian score, what's affecting it, and what you can do right now to improve it. See credit utilisation, action items, and your score history — all inside the app.
              </p>
              <a href="#" className="text-[#5B5BD6] font-medium text-sm hover:underline">Learn more →</a>
            </div>
          </div>
        </Section>

        {/* Feature 6: Accounts */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-2xl mb-3">🏦</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4 tracking-tight">
                All your accounts. One clean view.
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Connect Barclays, Monzo, Starling, Chase, Marcus and hundreds more via Open Banking. See balances, transactions, trends and mini sparklines for every account — all automatically synced.
              </p>
              <a href="#" className="text-[#5B5BD6] font-medium text-sm hover:underline">Learn more →</a>
            </div>
            <div className="order-2">
              <LaptopMockup className="max-w-[500px] mx-auto">
                <AccountsMockup />
              </LaptopMockup>
            </div>
          </div>
        </Section>

        {/* Feature 7: Scheduled */}
        <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 max-w-[260px] mx-auto lg:mr-auto">
              <PhoneMockup>
                <ScheduledMockup />
              </PhoneMockup>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-2xl mb-3">📅</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4 tracking-tight">
                Never miss a bill. Know exactly what's coming.
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Scheduled shows all your recurring bills, subscriptions and income on a calendar. Know your net monthly position, see Rent, Netflix, Spotify, Council Tax all in one place.
              </p>
              <a href="#" className="text-[#5B5BD6] font-medium text-sm hover:underline">Learn more →</a>
            </div>
          </div>
        </Section>
      </div>

      {/* ── STATS ── */}
      <Section className="bg-[#1E1B4B] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: '£29,623', label: 'Average net worth tracked' },
            { value: '34%', label: 'Average savings rate' },
            { value: '8', label: 'Accounts connected per user' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.value}</div>
              <div className="text-sm text-[#9CA3AF] mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── GOALS HIGHLIGHT ── */}
      <Section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-3">
            Set goals. Watch them grow.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto">
            From dream holidays to emergency funds — Sonfi tracks your savings goals, tells you if you're on track, and shows exactly how much you need to save each month.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 max-w-lg mx-auto px-4">
          <div className="w-[200px] mx-auto sm:mx-0 transform sm:-rotate-3">
            <PhoneMockup>
              <GoalsMockup />
            </PhoneMockup>
          </div>
          <div className="w-[200px] mx-auto sm:mx-0 transform sm:rotate-3 sm:mt-8">
            <PhoneMockup>
              <GoalsMockup />
            </PhoneMockup>
          </div>
        </div>
      </Section>

      {/* ── PRICING ── */}
      <Section id="pricing" className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-3">
              Start free. Upgrade when you're ready.
            </h2>
            <p className="text-[#6B7280]">No credit card required. Cancel anytime.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
              <h3 className="text-xl font-bold text-[#111827] mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-extrabold text-[#111827]">£0</span>
                <span className="text-sm text-[#6B7280]">/ forever</span>
              </div>
              <ul className="space-y-2.5 mb-8 text-sm text-[#6B7280]">
                {['Connect up to 2 accounts', 'Dashboard & Net Worth', 'Basic budgets', 'Transactions', 'Pulse insights (limited)', 'Credit score (Experian)'].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} className="text-[#16a34a] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/login?tab=signup"
                className="block text-center border-2 border-[#5B5BD6] text-[#5B5BD6] font-semibold py-3 rounded-xl hover:bg-[#5B5BD6]/5 transition-colors"
              >
                Get started free
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-[#5B5BD6] rounded-2xl p-6 sm:p-8 text-white relative transform sm:scale-[1.04]" style={{ boxShadow: '0 8px 32px rgba(91,91,214,0.3)' }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#5B5BD6] text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-extrabold">£4.99</span>
                <span className="text-sm text-white/70">/ month</span>
              </div>
              <p className="text-xs text-white/60 mb-5">or £3.99/mo billed annually</p>
              <ul className="space-y-2.5 mb-8 text-sm text-white/90">
                {['Unlimited accounts', 'Full AI Chat (Sonfi AI)', 'Unlimited budgets & goals', 'Full Pulse insights', 'Scheduled bills calendar', 'Personalised offers', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} className="text-white mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/login?tab=signup"
                className="block text-center bg-white text-[#5B5BD6] font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors"
              >
                Start 14-day free trial
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-[11px] text-[#6B7280]">
            <span className="flex items-center gap-1"><Shield size={12} /> Bank-level 256-bit encryption</span>
            <span>Open Banking authorised</span>
            <span>We never store your bank credentials</span>
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight text-center mb-12">
            Real people. Real results.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', loc: 'London', text: "I finally feel in control of my money. The AI chat is like having a financial adviser in my pocket — it told me exactly why my credit score was stuck and what to do." },
              { name: 'James T.', loc: 'Manchester', text: "The Pulse insights are genuinely useful. It caught that I was overspending on subscriptions and showed me exactly which ones to cancel. Saved me £40 a month." },
              { name: 'Priya K.', loc: 'Birmingham', text: "Seeing my net worth go up every month is actually motivating. The savings goals feature keeps me focused on what matters." },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                <div className="text-[#5B5BD6] text-3xl font-serif mb-3">"</div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#111827] leading-relaxed mb-4">{t.text}</p>
                <div className="text-sm font-semibold text-[#111827]">{t.name}</div>
                <div className="text-xs text-[#6B7280]">{t.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ── */}
      <Section className="bg-[#0F0F1A] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-white tracking-tight leading-tight mb-5">
            Take control of your<br />financial life today.
          </h2>
          <p className="text-[#9CA3AF] mb-8">Free to start. No card needed. Takes 3 minutes.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link
              to="/login?tab=signup"
              className="inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:scale-[1.02] text-sm"
            >
              Get started free <span>→</span>
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center border border-white/20 text-white/90 font-medium px-7 py-3.5 rounded-full hover:bg-white/5 transition-all text-sm"
            >
              See pricing
            </a>
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
      <footer className="bg-[#111827] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="font-extrabold text-xl tracking-tight mb-3">SONFI</div>
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
                {['Features', 'Pricing', 'Credit Score', 'Pulse', 'Scheduled', 'Offers'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
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
                {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Security', 'Open Banking Info'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-xs text-[#6B7280] text-center leading-relaxed">
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
