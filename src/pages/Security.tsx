import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Server, FileCheck, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';

const principles = [
  { icon: Lock, title: '256-bit Encryption', desc: 'All data is encrypted in transit with TLS 1.3 and at rest with AES-256. The same standard used by banks.' },
  { icon: Eye, title: 'Read-only Access', desc: 'We can only view your data through Open Banking — never initiate payments, transfers, or move your money.' },
  { icon: Server, title: 'EU Data Centres', desc: 'Your data is stored in ISO 27001 certified data centres within the EU, compliant with GDPR.' },
  { icon: FileCheck, title: 'FCA Regulated', desc: 'Our Open Banking providers are authorised and regulated by the Financial Conduct Authority.' },
  { icon: Users, title: 'No Data Selling', desc: 'We never sell your personal or financial data to third parties. Our revenue comes from subscriptions.' },
  { icon: Shield, title: 'Soft Searches Only', desc: 'Credit score checks via Sonfi are soft searches — they never affect your credit rating.' },
];

const practices = [
  'Multi-factor authentication available for all accounts',
  'Regular penetration testing by independent security firms',
  'Automated vulnerability scanning on every code deployment',
  'Strict role-based access controls for all team members',
  'Incident response plan with <1 hour initial response time',
  'SOC 2 Type II certification in progress',
  'Data Processing Agreements with all sub-processors',
  'Annual security training for all employees',
];

export default function SecurityPage() {
  return (
    <LandingPageShell>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield size={40} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Your data is safe.<br />That's non-negotiable.
          </h1>
          <p className="text-[#C4B5FD] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Security isn't an afterthought — it's the foundation of everything we build. Here's how we protect your financial data.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">
            Security principles
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <p.icon size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{p.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practices */}
      <section className="bg-[#F8F9FC] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight text-center mb-12">
            Our security practices
          </h2>
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
            <div className="space-y-4">
              {practices.map((p) => (
                <div key={p} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#111827]">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance badges */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-8">Compliance & certifications</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {['GDPR Compliant', 'FCA Regulated Partners', 'ISO 27001 Infrastructure', 'ICO Registered', 'Open Banking UK'].map(b => (
              <span key={b} className="border-2 border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-full">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Report */}
      <section className="bg-[#1E1B4B] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">Found a vulnerability?</h2>
          <p className="text-[#C4B5FD] mb-8">We run a responsible disclosure programme. If you've found a security issue, please let us know.</p>
          <a href="mailto:security@sonfi.app" className="group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-[1.02] text-sm">
            security@sonfi.app <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>
    </LandingPageShell>
  );
}
