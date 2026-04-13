import { useState } from 'react';
import { CreditCard, HandCoins, Car, Shield, Wallet, Home, ArrowRight, ArrowLeft, Star, BadgePercent, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const offerCategories = [
  { id: 'credit-cards', label: 'Credit Cards', icon: CreditCard, desc: 'Credit cards handpicked for you' },
  { id: 'loans', label: 'Loans', icon: HandCoins, desc: 'Borrow from £1,000 with flexible repayments' },
  { id: 'car-finance', label: 'Car Finance', icon: Car, desc: 'Get a new car loan or switch your current one' },
  { id: 'insurance', label: 'Car Insurance', icon: Shield, desc: 'Get great deals on your car insurance' },
  { id: 'accounts', label: 'Current Accounts', icon: Wallet, desc: 'Browse current accounts' },
  { id: 'mortgages', label: 'Mortgages', icon: Home, desc: 'Buy a home or get remortgaging advice' },
];

const creditCardOffers = [
  {
    id: 1, name: 'Amex Platinum Cashback', provider: 'American Express', providerLetter: 'A', providerColor: '#007BC1', tag: 'Sonfi Pick',
    features: [{ label: '5% cashback', desc: 'For the first 3 months' }, { label: '1% ongoing', desc: 'On all purchases' }, { label: '94%', desc: 'Approval likelihood' }],
    highlight: 'Based on your score of 724, you have a high chance of approval',
  },
  {
    id: 2, name: 'Loqbox Credit Builder', provider: 'Loqbox', providerLetter: 'L', providerColor: '#2D2B55', tag: null,
    features: [{ label: 'Free or £2.99', desc: 'Weekly membership' }, { label: 'Improve your score', desc: 'And reach your savings goal' }, { label: '100% approval', desc: 'With no hard credit checks' }],
    highlight: null,
  },
  {
    id: 3, name: 'Chase Cashback Card', provider: 'Chase UK', providerLetter: 'C', providerColor: '#117ACA', tag: 'Exclusive',
    features: [{ label: '1% cashback', desc: 'On all spending' }, { label: 'No annual fee', desc: 'Free forever' }, { label: '89%', desc: 'Approval likelihood' }],
    highlight: null,
  },
];

const loanOffers = [
  {
    id: 4, name: 'Personal loans from Aspire Money', provider: 'Aspire Money', providerLetter: 'A', providerColor: '#1D9E75',
    features: [{ label: '1 – 5 years', desc: 'Loan duration' }, { label: '6.9% APR', desc: 'Representative APR' }, { label: '£500 – £25,000', desc: 'Loan amount' }],
  },
  {
    id: 5, name: 'Zopa Personal Loan', provider: 'Zopa', providerLetter: 'Z', providerColor: '#00B4A0',
    features: [{ label: '1 – 7 years', desc: 'Loan duration' }, { label: '5.9% APR', desc: 'Representative APR' }, { label: '£1,000 – £50,000', desc: 'Loan amount' }],
  },
];

const carFinanceOffers = [
  { id: 6, name: 'Hire Purchase (HP)', icon: '💷', desc: 'Pay monthly and own the car at the end' },
  { id: 7, name: 'Personal Contract Purchase (PCP)', icon: '🚗', desc: 'Lower monthly payments, with flexibility at the end' },
  { id: 8, name: 'Switch your car loan', icon: '🔄', desc: "See if you're over paying and switch to a new loan" },
  { id: 9, name: 'Finance your final PCP payment', icon: '📋', desc: 'Spread the cost of your balloon payment' },
];

function OfferCard({ offer }: { offer: typeof creditCardOffers[0] }) {
  return (
    <div className="sonfi-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          {offer.tag && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary mb-2">
              <Star size={10} /> {offer.tag}
            </span>
          )}
          <h3 className="text-sm font-semibold">{offer.name}</h3>
          <p className="text-xs text-muted-foreground">{offer.provider}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ backgroundColor: offer.providerColor }}>
          {offer.providerLetter}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 py-3 border-y">
        {offer.features.map((f, i) => (
          <div key={i}><p className="text-sm font-semibold">{f.label}</p><p className="text-[11px] text-muted-foreground">{f.desc}</p></div>
        ))}
      </div>
      {offer.highlight && (
        <p className="text-xs text-teal mt-3 flex items-center gap-1"><TrendingUp size={12} /> {offer.highlight}</p>
      )}
      <div className="flex items-center gap-3 mt-4">
        <Button size="sm" className="px-6">Apply now</Button>
        <button className="text-sm font-medium text-primary hover:underline">More details</button>
      </div>
    </div>
  );
}

function SubPageHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
        <ArrowLeft size={18} />
      </button>
      <h1 className="text-xl font-medium">{label}</h1>
    </div>
  );
}

function CreditCardsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-4">
      <SubPageHeader label="Credit Cards" onBack={onBack} />
      <p className="text-sm text-muted-foreground">These cards are matched to your credit score and spending patterns.</p>
      <p className="text-xs text-muted-foreground">Sonfi is not a lender. Offers are illustrative and based on your profile.</p>
      <div className="space-y-4">
        {creditCardOffers.map(offer => <OfferCard key={offer.id} offer={offer} />)}
      </div>
    </div>
  );
}

function LoansPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-4">
      <SubPageHeader label="Unsecured Loans" onBack={onBack} />
      <p className="text-sm text-muted-foreground">Personal loans based on your credit score and history.</p>
      <div className="space-y-4">
        {loanOffers.map(offer => (
          <div key={offer.id} className="sonfi-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="text-sm font-semibold">{offer.name}</h3><p className="text-xs text-muted-foreground">{offer.provider}</p></div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: offer.providerColor }}>{offer.providerLetter}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 py-3 border-y">
              {offer.features.map((f, i) => <div key={i}><p className="text-sm font-semibold">{f.label}</p><p className="text-[11px] text-muted-foreground">{f.desc}</p></div>)}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button size="sm" className="px-6">Apply now</Button>
              <button className="text-sm font-medium text-primary hover:underline">More details</button>
            </div>
          </div>
        ))}
      </div>
      <div className="sonfi-card p-5 bg-muted/30">
        <h3 className="text-sm font-semibold mb-1">Let's build your credit</h3>
        <p className="text-xs text-muted-foreground">These products can help you build a credit history. If you use them responsibly and repay in full each month, this will be reported to credit reference agencies.</p>
      </div>
    </div>
  );
}

function CarFinancePage({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-5">
      <SubPageHeader label="Car Finance" onBack={onBack} />
      <h2 className="text-base font-semibold">Looking for your next car?</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {carFinanceOffers.slice(0, 2).map(o => (
          <div key={o.id} className="sonfi-card p-5 hover:shadow-md transition-shadow cursor-pointer">
            <span className="text-2xl mb-3 block">{o.icon}</span>
            <h3 className="text-sm font-semibold">{o.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{o.desc}</p>
          </div>
        ))}
      </div>
      <h3 className="text-base font-semibold">Already have car finance?</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {carFinanceOffers.slice(2).map(o => (
          <div key={o.id} className="sonfi-card p-5 hover:shadow-md transition-shadow cursor-pointer">
            <span className="text-2xl mb-3 block">{o.icon}</span>
            <h3 className="text-sm font-semibold">{o.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{o.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsurancePage({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-4">
      <SubPageHeader label="Car Insurance" onBack={onBack} />
      <div className="sonfi-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center"><Shield size={20} className="text-teal" /></div>
          <div><h3 className="text-sm font-semibold">Compare car insurance quotes</h3><p className="text-xs text-muted-foreground">Get a quote in minutes. No impact on your credit score.</p></div>
        </div>
        <div className="grid grid-cols-3 gap-3 py-3 border-y">
          <div><p className="text-sm font-semibold">50+ insurers</p><p className="text-[11px] text-muted-foreground">Compared for you</p></div>
          <div><p className="text-sm font-semibold">2 minutes</p><p className="text-[11px] text-muted-foreground">Average quote time</p></div>
          <div><p className="text-sm font-semibold">Save £280</p><p className="text-[11px] text-muted-foreground">Average savings</p></div>
        </div>
        <Button size="sm" className="mt-4 px-6">Get a quote</Button>
      </div>
    </div>
  );
}

function AccountsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-4">
      <SubPageHeader label="Current Accounts" onBack={onBack} />
      <p className="text-sm text-muted-foreground">Switch or open a new current account.</p>
      <div className="sonfi-card p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary mb-2"><BadgePercent size={10} /> Switching bonus</span>
            <h3 className="text-sm font-semibold">Chase Current Account</h3>
            <p className="text-xs text-muted-foreground">Chase UK</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white bg-[#117ACA]">C</div>
        </div>
        <div className="grid grid-cols-3 gap-3 py-3 border-y">
          <div><p className="text-sm font-semibold">1% cashback</p><p className="text-[11px] text-muted-foreground">On debit card spending</p></div>
          <div><p className="text-sm font-semibold">1.5% interest</p><p className="text-[11px] text-muted-foreground">On linked savings</p></div>
          <div><p className="text-sm font-semibold">No fees</p><p className="text-[11px] text-muted-foreground">Free to open</p></div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button size="sm" className="px-6">Apply now</Button>
          <button className="text-sm font-medium text-primary hover:underline">More details</button>
        </div>
      </div>
    </div>
  );
}

function MortgagesPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-4">
      <SubPageHeader label="Mortgages" onBack={onBack} />
      <p className="text-sm text-muted-foreground">Buy a home or get remortgaging advice.</p>
      <div className="sonfi-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Home size={20} className="text-primary" /></div>
          <div><h3 className="text-sm font-semibold">Get mortgage advice</h3><p className="text-xs text-muted-foreground">Talk to a qualified mortgage broker for free</p></div>
        </div>
        <div className="grid grid-cols-3 gap-3 py-3 border-y">
          <div><p className="text-sm font-semibold">Free advice</p><p className="text-[11px] text-muted-foreground">No obligation</p></div>
          <div><p className="text-sm font-semibold">90+ lenders</p><p className="text-[11px] text-muted-foreground">Whole of market</p></div>
          <div><p className="text-sm font-semibold">Online or phone</p><p className="text-[11px] text-muted-foreground">Your choice</p></div>
        </div>
        <Button size="sm" className="mt-4 px-6">Get started</Button>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (activeCategory === 'credit-cards') return <CreditCardsPage onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'loans') return <LoansPage onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'car-finance') return <CarFinancePage onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'insurance') return <InsurancePage onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'accounts') return <AccountsPage onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'mortgages') return <MortgagesPage onBack={() => setActiveCategory(null)} />;

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-medium">Offers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Personalised offers based on your credit profile</p>
      </div>

      {/* Hero banner */}
      <div className="rounded-2xl p-6 text-primary-foreground relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(220 25% 18%))' }}>
        <div className="relative z-10">
          <p className="text-base font-semibold">Your account, your benefits</p>
          <p className="text-sm opacity-80 mt-1">Discover exclusive rates and offers you've unlocked by linking your accounts</p>
          <button onClick={() => setActiveCategory('loans')} className="text-sm font-medium mt-3 text-teal hover:underline flex items-center gap-1">
            Browse loan offers <ArrowRight size={14} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-40 h-full opacity-10">
          <svg viewBox="0 0 160 120" className="w-full h-full"><circle cx="120" cy="30" r="60" fill="currentColor" /><circle cx="140" cy="90" r="40" fill="currentColor" /></svg>
        </div>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {offerCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="sonfi-card text-left p-4 transition-all hover:shadow-md group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-muted">
              <cat.icon size={20} className="text-foreground" />
            </div>
            <p className="text-sm font-semibold">{cat.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View offers <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Sonfi is not a lender or credit broker. We may receive a commission if you take out a product, but we're independent so we will never rank offers based on how much we earn. All offers are illustrative and for demo purposes only.
        </p>
        <button className="text-xs font-medium text-primary mt-1 hover:underline">Find out more here</button>
      </div>
    </div>
  );
}
