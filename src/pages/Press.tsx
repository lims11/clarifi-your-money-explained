import { ArrowRight, Download, ExternalLink } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';
import logoHorizontal from '@/assets/sonfi-logo-horizontal.png';
import logoHorizontalDark from '@/assets/sonfi-logo-horizontal-dark.png';

const coverage = [
  { outlet: 'TechCrunch', title: 'Sonfi raises seed round to build AI-powered money app for UK consumers', date: 'Mar 2025' },
  { outlet: 'Finextra', title: 'How Sonfi is using Open Banking and AI to democratise financial advice', date: 'Feb 2025' },
  { outlet: 'Sifted', title: 'The fintech startup making credit scores less scary', date: 'Jan 2025' },
  { outlet: 'AltFi', title: 'Sonfi launches Pulse — proactive financial alerts powered by AI', date: 'Apr 2025' },
];

const stats = [
  { value: '10,000+', label: 'Active users' },
  { value: '£2.4M', label: 'Tracked monthly' },
  { value: '4.8★', label: 'User rating' },
  { value: '2024', label: 'Founded' },
];

export default function PressPage() {
  return (
    <LandingPageShell>
      {/* Hero */}
      <section className="bg-[#1E1B4B] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Press & Media</h1>
          <p className="text-[#C4B5FD] text-lg max-w-xl mx-auto">Resources, assets, and coverage for journalists writing about Sonfi.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-[#111827]">{s.value}</div>
                <p className="text-sm text-[#6B7280] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">Brand assets</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#1E1B4B] rounded-2xl p-8 flex items-center justify-center">
              <img src={logoHorizontal} alt="Sonfi logo on dark" className="h-10" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 flex items-center justify-center">
              <img src={logoHorizontalDark} alt="Sonfi logo on light" className="h-10" />
            </div>
          </div>
          <p className="text-center text-xs text-[#6B7280] mt-4">Please don't modify, distort, or recolour the Sonfi logo.</p>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">In the press</h2>
          <div className="space-y-4">
            {coverage.map((c) => (
              <div key={c.title} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#5B5BD6] uppercase tracking-wider">{c.outlet}</span>
                    <h3 className="font-bold text-[#111827] mt-1 group-hover:text-[#5B5BD6] transition-colors">{c.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-1">{c.date}</p>
                  </div>
                  <ExternalLink size={16} className="text-[#6B7280] flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#1E1B4B] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">Press enquiries</h2>
          <p className="text-[#C4B5FD] mb-8">For interviews, data requests, or media kits, get in touch.</p>
          <a href="mailto:press@sonfi.app" className="group inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-[1.02] text-sm">
            press@sonfi.app <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>
    </LandingPageShell>
  );
}
