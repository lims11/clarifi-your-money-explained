import { useState } from 'react';
import LandingPageShell from '@/components/landing/LandingPageShell';

const cookieCategories = [
  {
    name: 'Essential',
    desc: 'Required for the app to function. These cookies handle authentication, session management, and security. They cannot be disabled.',
    required: true,
    cookies: [
      { name: 'sb-auth-token', purpose: 'Authentication session', duration: '7 days' },
      { name: 'sb-refresh-token', purpose: 'Token refresh', duration: '30 days' },
    ],
  },
  {
    name: 'Analytics',
    desc: 'Help us understand how you use Sonfi so we can improve the experience. All data is anonymised.',
    required: false,
    cookies: [
      { name: '_ga', purpose: 'Google Analytics visitor ID', duration: '2 years' },
      { name: '_ga_*', purpose: 'Google Analytics session', duration: '2 years' },
    ],
  },
  {
    name: 'Preferences',
    desc: 'Remember your settings and personalisation choices, like theme and currency preferences.',
    required: false,
    cookies: [
      { name: 'sonfi-theme', purpose: 'Dark/light mode preference', duration: '1 year' },
      { name: 'sonfi-currency', purpose: 'Currency display preference', duration: '1 year' },
    ],
  },
];

export default function CookiesPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    Essential: true,
    Analytics: false,
    Preferences: true,
  });

  const toggle = (name: string) => {
    if (name === 'Essential') return;
    setSettings((s) => ({ ...s, [name]: !s[name] }));
  };

  return (
    <LandingPageShell>
      <section className="bg-[#1E1B4B] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Cookie Settings</h1>
          <p className="text-[#C4B5FD]">Manage your cookie preferences. Your choices are saved to your browser.</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {cookieCategories.map((cat) => (
              <div key={cat.name} className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#111827]">{cat.name}</h3>
                      {cat.required && <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-[#6B7280] px-2 py-0.5 rounded">Required</span>}
                    </div>
                    <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(cat.name)}
                    className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                      settings[cat.name] ? 'bg-[#5B5BD6]' : 'bg-gray-200'
                    } ${cat.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={cat.required}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[cat.name] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="mt-4 bg-gray-50 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold text-[#111827]">Cookie</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#111827]">Purpose</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#111827]">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.cookies.map((c) => (
                        <tr key={c.name} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 px-3 font-mono text-[#5B5BD6]">{c.name}</td>
                          <td className="py-2 px-3 text-[#6B7280]">{c.purpose}</td>
                          <td className="py-2 px-3 text-[#6B7280]">{c.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3 justify-center">
            <button
              onClick={() => setSettings({ Essential: true, Analytics: true, Preferences: true })}
              className="bg-[#5B5BD6] hover:bg-[#4A4AC4] text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
            >
              Accept all
            </button>
            <button
              onClick={() => setSettings({ Essential: true, Analytics: false, Preferences: false })}
              className="border border-gray-200 text-[#6B7280] font-medium px-6 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors"
            >
              Reject optional
            </button>
          </div>
        </div>
      </section>
    </LandingPageShell>
  );
}
