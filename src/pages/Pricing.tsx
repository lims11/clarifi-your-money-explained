import { Link } from 'react-router-dom';
import { Check, Shield } from 'lucide-react';
import LandingPageShell from '@/components/landing/LandingPageShell';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '£0',
      period: 'forever',
      desc: 'Get started with the basics.',
      features: [
        'Connect up to 2 accounts',
        'Dashboard & Net Worth',
        'Basic budgets',
        'Transactions',
        'Credit score (Experian)',
      ],
      cta: 'Get started free',
      ctaLink: '/login?tab=signup',
      highlight: false,
    },
    {
      name: 'Premium',
      price: '£1.99',
      period: '/month',
      desc: 'Unlock smarter insights.',
      features: [
        'Connect up to 5 accounts',
        'Full AI Chat (Sonfi AI)',
        'Unlimited budgets & goals',
        'Pulse insights',
        'Scheduled bills calendar',
        'Credit score (Experian)',
      ],
      cta: 'Start free trial',
      ctaLink: '/login?tab=signup',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '£2.99',
      period: '/month',
      desc: 'The complete Sonfi experience.',
      badge: 'Most Popular',
      features: [
        'Unlimited accounts',
        'Full AI Chat (Sonfi AI)',
        'Unlimited budgets & goals',
        'Full Pulse insights',
        'Scheduled bills calendar',
        'Personalised offers',
        'Priority support',
        'Family sharing (coming soon)',
      ],
      cta: 'Start free trial',
      ctaLink: '/login?tab=signup',
      highlight: true,
    },
  ];

  return (
    <LandingPageShell>
      <div className="py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
              Simple, transparent pricing.
            </h1>
            <p className="text-[#6B7280] text-base sm:text-lg max-w-xl mx-auto">
              Start free. Upgrade when you're ready. No credit card required.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 sm:p-8 relative transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-[#5B5BD6] text-white sm:scale-[1.04]'
                    : 'bg-white border border-gray-200'
                }`}
                style={{ boxShadow: plan.highlight ? '0 8px 32px rgba(91,91,214,0.3)' : '0 2px 16px rgba(0,0,0,0.04)' }}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#5B5BD6] text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? '' : 'text-[#111827]'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? '' : 'text-[#111827]'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-white/70' : 'text-[#6B7280]'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/70' : 'text-[#6B7280]'}`}>{plan.desc}</p>
                <ul className={`space-y-2.5 mb-8 text-sm ${plan.highlight ? 'text-white/90' : 'text-[#6B7280]'}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={16} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-[#16a34a]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.ctaLink}
                  className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                    plan.highlight
                      ? 'bg-white text-[#5B5BD6] hover:bg-white/90'
                      : 'border-2 border-[#5B5BD6] text-[#5B5BD6] hover:bg-[#5B5BD6]/5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-10 text-[11px] text-[#6B7280]">
            <span className="flex items-center gap-1"><Shield size={12} /> Bank-level 256-bit encryption</span>
            <span>Open Banking authorised</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </LandingPageShell>
  );
}
