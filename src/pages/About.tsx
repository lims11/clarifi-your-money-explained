import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Globe, Lightbulb } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';

const values = [
  { icon: Heart, title: 'User-First', desc: 'Every feature starts with a real user problem. We obsess over simplicity and clarity so finances feel approachable, not overwhelming.' },
  { icon: Lightbulb, title: 'Radically Transparent', desc: 'No hidden fees, no selling your data. We make money from subscriptions — not from selling financial products behind your back.' },
  { icon: Users, title: 'Inclusive by Design', desc: 'Money management shouldn\'t require a finance degree. Sonfi speaks plain English and meets you wherever you are.' },
  { icon: Globe, title: 'Privacy as Standard', desc: 'Bank-level encryption, GDPR compliance, and read-only access. We can never move your money or see your bank passwords.' },
];

const timeline = [
  { year: '2024', event: 'Idea born from frustration with fragmented UK banking apps' },
  { year: '2024', event: 'First prototype built — AI chat with real financial data' },
  { year: '2025', event: 'Beta launch with 500 early users across the UK' },
  { year: '2025', event: 'Open Banking integration, Experian credit score, Pulse insights' },
  { year: '2025', event: 'Public launch — free plan available to everyone' },
];

export default function AboutPage() {
  return (
    <LandingPageShell>
      {/* Hero */}
      <section className="bg-[#1E1B4B] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-[#5B5BD6]/30 text-[#C4B5FD] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Money should be simple.<br />We're making it happen.
          </h1>
          <p className="text-[#C4B5FD] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Sonfi was born from a simple frustration: why is managing money in the UK still so complicated? We're building the app we always wanted.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-4">Our mission</h2>
              <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed mb-4">
                To give every person in the UK complete clarity and confidence over their finances — using AI that actually understands their money.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                We believe financial wellbeing shouldn't be a luxury. Whether you earn £20k or £200k, you deserve tools that help you understand, optimise, and grow your money — without the jargon.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#5B5BD6]/10 to-[#E8E5F5] rounded-3xl p-8 sm:p-12 text-center">
              <div className="text-5xl font-extrabold text-[#5B5BD6] mb-2">10k+</div>
              <p className="text-sm text-[#6B7280]">Users managing their money with Sonfi</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-extrabold text-[#111827]">£2.4M</div>
                  <p className="text-xs text-[#6B7280]">Tracked monthly</p>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#111827]">48pts</div>
                  <p className="text-xs text-[#6B7280]">Avg score improvement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">What we stand for</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <v.icon size={28} className="text-[#5B5BD6] mb-4" />
                <h3 className="text-lg font-bold text-[#111827] mb-2">{v.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">Our journey so far</h2>
          <div className="space-y-6">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#5B5BD6] flex-shrink-0" />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-[#5B5BD6]/20 mt-1" />}
                </div>
                <div className="pb-6">
                  <span className="text-xs font-bold text-[#5B5BD6]">{t.year}</span>
                  <p className="text-sm text-[#111827] font-medium mt-1">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E1B4B] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">Join us on the journey.</h2>
          <p className="text-[#C4B5FD] mb-8">We're just getting started.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/login?tab=signup" className="group inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-[1.02] text-sm">
              Get started free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/careers" className="inline-flex items-center border border-white/20 text-white/90 font-medium px-8 py-4 rounded-full hover:bg-white/5 transition-all text-sm">
              We're hiring
            </Link>
          </div>
        </div>
      </section>
    </LandingPageShell>
  );
}
