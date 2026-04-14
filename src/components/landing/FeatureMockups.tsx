export function ChatMockup() {
  return (
    <div className="bg-[#F8F9FC] p-3 text-[11px]" style={{ minHeight: 400 }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-[#5B5BD6] flex items-center justify-center text-white text-[10px]">✦</div>
        <span className="font-semibold text-gray-800 text-xs">Sonfi AI</span>
        <span className="bg-[#5B5BD6]/10 text-[#5B5BD6] text-[8px] font-semibold px-1.5 py-0.5 rounded-full ml-auto">✦ AI</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-end">
          <div className="bg-[#5B5BD6] text-white rounded-2xl rounded-br-md px-3 py-2 max-w-[80%] text-[10px]">
            Am I spending too much on eating out?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl rounded-bl-md px-3 py-2.5 max-w-[85%] text-[10px] shadow-sm leading-relaxed">
            Looking at your last 30 days, you've spent <strong>£239.90</strong> on food & dining. Your biggest categories:
            <div className="mt-2 space-y-1">
              <div className="flex justify-between"><span>🍕 Takeaways</span><span className="font-medium">£89.50</span></div>
              <div className="flex justify-between"><span>🍽️ Restaurants</span><span className="font-medium">£78.40</span></div>
              <div className="flex justify-between"><span>☕ Coffee shops</span><span className="font-medium">£42.00</span></div>
            </div>
            <div className="mt-2 text-green-600">That's within your <strong>£300 budget</strong> — you're at 80% with 16 days left. 👍</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['Can I afford a holiday?', 'Which subs to cancel?', 'How to boost my score?'].map(q => (
          <div key={q} className="bg-white border border-gray-200 text-[9px] px-2 py-1 rounded-full text-gray-600">{q}</div>
        ))}
      </div>
      <div className="bg-white border-t border-gray-100 flex justify-around py-2 -mx-3 -mb-3 mt-4 rounded-b-xl">
        {['Home', 'Chat', 'Accounts', 'Budgets', 'More'].map((t, i) => (
          <div key={t} className={`text-[9px] text-center ${i === 1 ? 'text-[#5B5BD6] font-semibold' : 'text-gray-400'}`}>
            <div className="text-sm mb-0.5">{['🏠', '💬', '🏦', '📊', '•••'][i]}</div>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PulseMockup() {
  return (
    <div className="bg-[#F8F9FC] p-3 text-[11px]" style={{ minHeight: 400 }}>
      <div className="text-sm font-semibold text-gray-800 mb-1">Pulse</div>
      <div className="text-[10px] text-gray-400 mb-4">Your AI financial newsfeed</div>
      <div className="space-y-3">
        {[
          { type: 'WARNING', color: '#d97706', text: 'Your takeaway spending is up 40% from last month', sub: 'Food & Drink · £89.50 vs £63.90 last month' },
          { type: 'INSIGHT', color: '#5B5BD6', text: "You're £1,800 away from your Emergency Fund", sub: 'At current rate, you\'ll reach it in 3 months' },
          { type: 'TIP', color: '#16a34a', text: 'Pay your Amex in full to save ~£268/year', sub: 'Current balance: £1,340 · APR: 22.9%' },
        ].map(a => (
          <div key={a.type} className="bg-white rounded-xl p-3 shadow-sm" style={{ borderLeft: `3px solid ${a.color}` }}>
            <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: a.color }}>{a.type}</div>
            <div className="text-[11px] font-medium text-gray-800">{a.text}</div>
            <div className="text-[9px] text-gray-400 mt-1">{a.sub}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border-t border-gray-100 flex justify-around py-2 -mx-3 -mb-3 mt-4 rounded-b-xl">
        {['Home', 'Chat', 'Accounts', 'Budgets', 'More'].map((t, i) => (
          <div key={t} className={`text-[9px] text-center ${i === 0 ? 'text-[#5B5BD6] font-semibold' : 'text-gray-400'}`}>
            <div className="text-sm mb-0.5">{['🏠', '💬', '🏦', '📊', '•••'][i]}</div>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetsMockup() {
  return (
    <div className="flex h-full text-[10px]" style={{ minHeight: 280 }}>
      <div className="w-[100px] bg-white border-r border-gray-100 p-2 flex-shrink-0">
        <div className="font-extrabold text-[#1a1145] text-[10px] mb-3 tracking-tight">SONFI</div>
        <div className="space-y-1">
          {['Dashboard', 'Chat', 'Accounts', 'Transactions', 'Budgets', 'Goals', 'Pulse', 'Scheduled'].map((n, i) => (
            <div key={n} className={`px-2 py-1 rounded text-[8px] ${i === 4 ? 'bg-[#5B5BD6]/10 text-[#5B5BD6] font-semibold' : 'text-gray-400'}`}>{n}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-[#F8F9FC] p-3 overflow-hidden">
        <div className="text-sm font-semibold text-gray-800 mb-2">Budgets</div>
        <div className="flex gap-2 mb-3">
          <div className="bg-white rounded-lg px-2 py-1.5 text-center flex-1 shadow-sm">
            <div className="text-lg font-bold text-[#5B5BD6]">3</div>
            <div className="text-[7px] text-gray-400 uppercase">On Track</div>
          </div>
          <div className="bg-white rounded-lg px-2 py-1.5 text-center flex-1 shadow-sm">
            <div className="text-lg font-bold text-red-500">2</div>
            <div className="text-[7px] text-gray-400 uppercase">Over Budget</div>
          </div>
          <div className="bg-white rounded-lg px-2 py-1.5 text-center flex-1 shadow-sm">
            <div className="text-lg font-bold text-gray-700">16</div>
            <div className="text-[7px] text-gray-400 uppercase">Days Left</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm mb-3">
          <div className="text-xs font-medium mb-2">Apr Spending Breakdown</div>
          <div className="flex items-center gap-3">
            <svg width="70" height="70" viewBox="0 0 70 70">
              <circle cx="35" cy="35" r="28" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="#5B5BD6" strokeWidth="8" strokeDasharray="120 176" strokeDashoffset="0" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="#16a34a" strokeWidth="8" strokeDasharray="20 176" strokeDashoffset="-120" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="#d97706" strokeWidth="8" strokeDasharray="12 176" strokeDashoffset="-140" />
            </svg>
            <div className="text-[8px] space-y-0.5">
              <div><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5B5BD6] mr-1" />Bills £1,601</div>
              <div><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a] mr-1" />Food £239.90</div>
              <div><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d97706] mr-1" />Shopping £148.98</div>
              <div><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dc2626] mr-1" />Transport £110</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[8px]">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-gray-400">Monthly income</div>
            <div className="text-green-600 font-bold text-sm">£3,350.00</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-gray-400">Savings amount</div>
            <div className="text-green-600 font-bold text-sm">£1,131.16</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreditScoreMockup() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-gray-800">Credit Score</div>
        <div className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">+13 this month</div>
      </div>
      <div className="flex justify-center mb-4">
        <svg width="160" height="100" viewBox="0 0 160 100">
          <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
          <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray="188" strokeDashoffset={188 - 188 * 0.724} />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="40%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <text x="80" y="72" textAnchor="middle" className="fill-gray-900 text-3xl font-bold" style={{ fontSize: 32, fontWeight: 700 }}>724</text>
          <text x="80" y="90" textAnchor="middle" className="fill-amber-500 text-xs" style={{ fontSize: 12 }}>Fair</text>
        </svg>
      </div>
      <div className="flex justify-between text-[9px] text-gray-400 mb-4 px-2">
        <span>Very Poor</span><span>Poor</span><span className="text-amber-500 font-semibold">Fair●</span><span>Good</span><span>Excellent</span>
      </div>
      <div className="border-t border-gray-100 pt-3">
        <div className="text-[10px] font-semibold text-red-500 mb-1">⚠ Action Needed</div>
        <div className="text-[10px] text-gray-600">Credit utilisation at 54% — aim for under 30%</div>
      </div>
      <div className="text-[8px] text-gray-300 mt-3 text-center">Powered by Experian</div>
    </div>
  );
}

export function AccountsMockup() {
  const accounts = [
    { name: 'Barclays Current', balance: '£2,847.50', color: '#1a73e8', trend: 'up' },
    { name: 'Monzo Spending', balance: '£412.30', color: '#ff4f5b', trend: 'down' },
    { name: 'Marcus Savings', balance: '£8,200.00', color: '#0f9d58', trend: 'up' },
    { name: 'Chase Saver', balance: '£3,150.00', color: '#1a1145', trend: 'up' },
    { name: 'Amex Gold', balance: '-£1,340.00', color: '#d97706', trend: 'down', negative: true },
  ];
  return (
    <div className="flex h-full text-[10px]" style={{ minHeight: 280 }}>
      <div className="w-[90px] bg-white border-r border-gray-100 p-2 flex-shrink-0">
        <div className="font-extrabold text-[#1a1145] text-[10px] mb-3 tracking-tight">SONFI</div>
        <div className="space-y-1">
          {['Dashboard', 'Chat', 'Accounts', 'Transactions', 'Budgets'].map((n, i) => (
            <div key={n} className={`px-2 py-1 rounded text-[8px] ${i === 2 ? 'bg-[#5B5BD6]/10 text-[#5B5BD6] font-semibold' : 'text-gray-400'}`}>{n}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-[#F8F9FC] p-3 overflow-hidden">
        <div className="text-sm font-semibold text-gray-800 mb-3">Accounts</div>
        <div className="space-y-2">
          {accounts.map(a => (
            <div key={a.name} className="bg-white rounded-xl p-2.5 shadow-sm flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: a.color }}>
                {a.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-medium text-gray-800">{a.name}</div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-semibold ${a.negative ? 'text-red-500' : 'text-gray-900'}`}>{a.balance}</span>
                  <svg width="30" height="12" viewBox="0 0 30 12">
                    <polyline
                      points={a.trend === 'up' ? '0,10 5,8 10,9 15,6 20,4 25,3 30,1' : '0,2 5,4 10,3 15,6 20,8 25,9 30,11'}
                      fill="none"
                      stroke={a.trend === 'up' ? '#16a34a' : '#dc2626'}
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScheduledMockup() {
  return (
    <div className="bg-[#F8F9FC] p-3 text-[11px]" style={{ minHeight: 400 }}>
      <div className="text-sm font-semibold text-gray-800 mb-1">Scheduled</div>
      <div className="text-[10px] text-gray-400 mb-3">Recurring bills & income</div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="text-[9px] text-gray-400">Monthly expenses</div>
          <div className="text-red-500 font-bold text-sm">-£1,670.97</div>
        </div>
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="text-[9px] text-gray-400">Monthly income</div>
          <div className="text-green-600 font-bold text-sm">+£3,200.00</div>
        </div>
      </div>

      {/* Mini calendar */}
      <div className="bg-white rounded-xl p-2 shadow-sm mb-3">
        <div className="text-center text-[10px] font-medium mb-1">April 2026</div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-[8px] text-gray-400">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="font-medium">{d}</div>)}
          {Array.from({ length: 2 }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const hasDot = [1, 5, 6, 7, 8, 9, 12, 14].includes(day);
            const isToday = day === 14;
            return (
              <div key={day} className="relative py-0.5">
                <span className={`${isToday ? 'bg-[#5B5BD6] text-white rounded-full w-4 h-4 inline-flex items-center justify-center' : ''}`}>
                  {day}
                </span>
                {hasDot && <div className={`w-1 h-1 rounded-full mx-auto mt-0 ${day === 4 ? 'bg-green-500' : 'bg-red-400'}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          { name: 'Rent', amount: '-£1,200.00' },
          { name: 'EDF Energy', amount: '-£142.00' },
          { name: 'Netflix', amount: '-£17.99' },
          { name: 'Spotify', amount: '-£11.99' },
          { name: 'PureGym', amount: '-£39.99' },
        ].map(b => (
          <div key={b.name} className="bg-white rounded-lg px-2 py-1.5 shadow-sm flex justify-between">
            <span className="text-gray-700">{b.name}</span>
            <span className="text-red-500 font-medium">{b.amount}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-gray-100 flex justify-around py-2 -mx-3 -mb-3 mt-3 rounded-b-xl">
        {['Home', 'Chat', 'Accounts', 'Budgets', 'More'].map((t, i) => (
          <div key={t} className={`text-[9px] text-center text-gray-400`}>
            <div className="text-sm mb-0.5">{['🏠', '💬', '🏦', '📊', '•••'][i]}</div>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GoalsMockup() {
  return (
    <div className="bg-[#F8F9FC] p-4 text-[11px]" style={{ minHeight: 350 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-gray-800">Savings goals</div>
        <div className="bg-[#5B5BD6] text-white text-[9px] px-2 py-1 rounded-full">+ Add goal</div>
      </div>
      {[
        { name: 'Car', target: '£10,000', current: '£700', pct: 7, status: 'Behind', statusColor: '#d97706', color: '#16a34a', date: 'Apr 2027', monthly: '£775.00/month needed' },
        { name: 'Egypt Holiday', target: '£5,000', current: '£400', pct: 8, status: 'On track', statusColor: '#16a34a', color: '#3b82f6', date: 'Jun 2027', monthly: '£328.57/month needed' },
      ].map(g => (
        <div key={g.name} className="bg-white rounded-xl p-3 shadow-sm mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${g.color}15` }}>🎯</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{g.name}</span>
                <span className="text-[9px]" style={{ color: g.statusColor }}>{g.status}</span>
                <span className="text-lg font-bold text-gray-300 ml-auto">{g.pct}%</span>
              </div>
              <div className="text-[9px] text-gray-400">Target: {g.date}</div>
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.color }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[9px] text-gray-500">
            <span>{g.current} of {g.target}</span>
            <span>{g.monthly}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
