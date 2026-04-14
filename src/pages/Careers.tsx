import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Briefcase, Heart, Zap, Coffee, Plane } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';

const perks = [
  { icon: Plane, title: 'Remote First', desc: 'Work from anywhere in the UK. We meet quarterly for team offsites.' },
  { icon: Heart, title: 'Wellness Budget', desc: '£500/year for gym, therapy, or anything that keeps you well.' },
  { icon: Coffee, title: 'Learning Budget', desc: '£1,000/year for courses, books, and conferences.' },
  { icon: Zap, title: 'Latest Kit', desc: 'MacBook Pro, monitor, and ergonomic setup — all on us.' },
];

const roles = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote (UK)', type: 'Full-time' },
  { title: 'Product Designer', team: 'Design', location: 'Remote (UK)', type: 'Full-time' },
  { title: 'ML Engineer — Financial AI', team: 'AI', location: 'Remote (UK)', type: 'Full-time' },
  { title: 'Growth Marketing Manager', team: 'Marketing', location: 'Remote (UK)', type: 'Full-time' },
  { title: 'Customer Success Lead', team: 'Operations', location: 'Remote (UK)', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <LandingPageShell>
      {/* Hero */}
      <section className="bg-[#1E1B4B] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-pink-500/20 text-pink-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            We're Hiring
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Build the future of<br />personal finance.
          </h1>
          <p className="text-[#C4B5FD] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Join a small, ambitious team making money management smarter for millions of people across the UK.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">Why work at Sonfi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p) => (
              <div key={p.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#5B5BD6]/10 flex items-center justify-center mx-auto mb-4">
                  <p.icon size={24} className="text-[#5B5BD6]" />
                </div>
                <h3 className="font-bold text-[#111827] mb-1">{p.title}</h3>
                <p className="text-sm text-[#6B7280]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">Open positions</h2>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.title} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#111827] group-hover:text-[#5B5BD6] transition-colors">{role.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1"><Briefcase size={12} /> {role.team}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {role.location}</span>
                      <span>{role.type}</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#6B7280] group-hover:text-[#5B5BD6] transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E1B4B] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">Don't see your role?</h2>
          <p className="text-[#C4B5FD] mb-8">We're always looking for talented people. Send us your CV and tell us why you'd be a great fit.</p>
          <a href="mailto:careers@sonfi.app" className="group inline-flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-[1.02] text-sm">
            careers@sonfi.app <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>
    </LandingPageShell>
  );
}
