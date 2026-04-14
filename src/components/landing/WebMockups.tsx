export function BudgetsWebMockup() {
  return (
    <div className="flex h-full text-[10px]" style={{ minHeight: 260 }}>
      {/* Sidebar */}
      <Sidebar active="Budgets" />
      {/* Main */}
      <div className="flex-1 bg-[#F8F9FC] p-3 overflow-hidden">
        <div className="text-sm font-semibold text-gray-800 mb-2">Budgets</div>
        <div className="flex gap-2 mb-2">
          {[
            { val: '3', label: 'ON TRACK', color: 'text-[#5B5BD6]' },
            { val: '2', label: 'OVER BUDGET', color: 'text-red-500' },
            { val: '16', label: 'DAYS LEFT', color: 'text-gray-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg px-2 py-1.5 text-center flex-1 shadow-sm">
              <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[7px] text-gray-400 uppercase">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
          <div className="text-xs font-medium mb-2">Apr Spending Breakdown</div>
          <div className="flex items-center gap-3">
            <svg width="65" height="65" viewBox="0 0 70 70">
              <circle cx="35" cy="35" r="28" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="#5B5BD6" strokeWidth="8" strokeDasharray="120 176" strokeDashoffset="0" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="#16a34a" strokeWidth="8" strokeDasharray="20 176" strokeDashoffset="-120" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="#d97706" strokeWidth="8" strokeDasharray="12 176" strokeDashoffset="-140" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="#dc2626" strokeWidth="8" strokeDasharray="10 176" strokeDashoffset="-152" />
            </svg>
            <div className="text-[8px] space-y-0.5 flex-1">
              <div className="flex justify-between"><span><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5B5BD6] mr-1" />Bills</span><span className="font-medium">£1,601.00</span></div>
              <div className="flex justify-between"><span><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a] mr-1" />Food & Drink</span><span className="font-medium">£239.90</span></div>
              <div className="flex justify-between"><span><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d97706] mr-1" />Shopping</span><span className="font-medium">£148.98</span></div>
              <div className="flex justify-between"><span><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dc2626] mr-1" />Transport</span><span className="font-medium">£110.00</span></div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-[8px]">
          <div className="bg-white rounded-lg p-2 shadow-sm flex-1">
            <div className="text-gray-400">Monthly income</div>
            <div className="text-green-600 font-bold text-sm">£3,350.00</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm flex-1">
            <div className="text-gray-400">Savings amount</div>
            <div className="text-green-600 font-bold text-sm">£1,131.16</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountsWebMockup() {
  const accounts = [
    { initial: 'B', name: 'Barclays Current', type: 'current', balance: '£2,847.50', color: '#1a73e8', income: '£3,350.00', expense: '£1,671.00', up: true },
    { initial: 'M', name: 'Monzo Spending', type: 'current', balance: '£412.30', color: '#ff4f5b', income: '£0.00', expense: '£328.89', up: false },
    { initial: 'G', name: 'Marcus Savings', type: 'savings', balance: '£8,200.00', color: '#0f9d58', income: '£0.00', expense: '£0.00', up: true },
    { initial: 'C', name: 'Chase Saver', type: 'savings', balance: '£3,150.00', color: '#1a1145', income: '£0.00', expense: '£0.00', up: true },
    { initial: 'A', name: 'Amex Gold', type: 'credit card', balance: '-£1,340.00', color: '#d97706', income: '', expense: '', up: false, negative: true },
  ];

  return (
    <div className="flex h-full text-[10px]" style={{ minHeight: 280 }}>
      <Sidebar active="Accounts" />
      <div className="flex-1 bg-[#F8F9FC] p-3 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-800">Accounts</div>
          <div className="bg-[#5B5BD6] text-white text-[8px] px-2 py-1 rounded-lg font-medium">+ Add account</div>
        </div>
        <div className="text-[8px] text-gray-400 uppercase tracking-wide mb-1">Current Accounts <span className="float-right text-gray-500">2 · £3,259.80</span></div>
        <div className="space-y-1.5 mb-2">
          {accounts.slice(0, 2).map(a => (
            <AccountRow key={a.name} {...a} />
          ))}
        </div>
        <div className="text-[8px] text-gray-400 uppercase tracking-wide mb-1">Savings Accounts <span className="float-right text-gray-500">2 · £11,350.00</span></div>
        <div className="space-y-1.5 mb-2">
          {accounts.slice(2, 4).map(a => (
            <AccountRow key={a.name} {...a} />
          ))}
        </div>
        <div className="text-[8px] text-gray-400 uppercase tracking-wide mb-1">Credit Cards <span className="float-right text-gray-500">-£1,826.20</span></div>
        <div className="space-y-1.5">
          {accounts.slice(4).map(a => (
            <AccountRow key={a.name} {...a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountRow({ initial, name, type, balance, color, up, negative }: {
  initial: string; name: string; type: string; balance: string; color: string; up: boolean; negative?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-2 shadow-sm flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ background: color }}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-medium text-gray-800 truncate">{name}</span>
          <span className="text-[7px] bg-gray-100 text-gray-500 px-1 rounded">{type}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <svg width="24" height="10" viewBox="0 0 24 10">
          <polyline
            points={up ? '0,8 4,6 8,7 12,4 16,3 20,2 24,1' : '0,2 4,3 8,4 12,5 16,7 20,8 24,9'}
            fill="none" stroke={up ? '#5B5BD6' : '#dc2626'} strokeWidth="1.5"
          />
        </svg>
        <span className={`text-[10px] font-semibold ${negative ? 'text-red-500' : 'text-gray-900'}`}>{balance}</span>
      </div>
    </div>
  );
}

export function ScheduledWebMockup() {
  return (
    <div className="flex h-full text-[10px]" style={{ minHeight: 280 }}>
      <Sidebar active="Scheduled" />
      <div className="flex-1 bg-[#F8F9FC] p-3 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-semibold text-gray-800">Scheduled</div>
            <div className="text-[8px] text-gray-400">Recurring bills, subscriptions & income</div>
          </div>
          <div className="bg-[#5B5BD6] text-white text-[8px] px-2 py-1 rounded-lg font-medium">+ Add scheduled</div>
        </div>
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {[
            { label: 'Monthly expenses', val: '-£1,670.97', color: 'text-red-500' },
            { label: 'Monthly income', val: '+£3,200.00', color: 'text-green-600' },
            { label: 'Net monthly', val: '+£1,529.03', color: 'text-green-600' },
            { label: 'Active items', val: '8', color: 'text-gray-900' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg p-1.5 shadow-sm">
              <div className="text-[7px] text-gray-400">{s.label}</div>
              <div className={`text-xs font-bold ${s.color}`}>{s.val}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {/* Mini calendar */}
          <div className="bg-white rounded-xl p-2 shadow-sm flex-1">
            <div className="text-center text-[9px] font-medium mb-1">April 2026</div>
            <div className="grid grid-cols-7 gap-px text-center text-[7px] text-gray-400">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="font-medium">{d}</div>)}
              {Array.from({ length: 2 }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const hasDot = [2, 4, 5, 7, 8, 9, 12].includes(day);
                const isToday = day === 14;
                const isGreen = day === 4;
                return (
                  <div key={day} className="py-px relative">
                    <span className={isToday ? 'bg-[#5B5BD6] text-white rounded w-3.5 h-3.5 inline-flex items-center justify-center text-[7px]' : ''}>{day}</span>
                    {hasDot && <div className={`w-0.5 h-0.5 rounded-full mx-auto ${isGreen ? 'bg-green-500' : 'bg-red-400'}`} />}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Expenses list */}
          <div className="w-[45%] flex-shrink-0">
            <div className="text-[8px] font-medium text-gray-700 mb-1">Expenses</div>
            <div className="space-y-1">
              {[
                { name: 'Rent', amount: '-£1,200.00' },
                { name: 'EDF Energy', amount: '-£142.00' },
                { name: 'Council Tax', amount: '-£187.00' },
                { name: 'Virgin Media', amount: '-£72.00' },
                { name: 'Netflix', amount: '-£17.99' },
                { name: 'Spotify', amount: '-£11.99' },
                { name: 'PureGym', amount: '-£39.99' },
              ].map(b => (
                <div key={b.name} className="bg-white rounded-md px-1.5 py-1 shadow-sm flex justify-between">
                  <span className="text-gray-700 text-[8px]">{b.name}</span>
                  <span className="text-red-500 font-medium text-[8px]">{b.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PulseWebMockup() {
  return (
    <div className="flex h-full text-[10px]" style={{ minHeight: 280 }}>
      <Sidebar active="Pulse" />
      <div className="flex-1 bg-[#F8F9FC] p-3 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-800">Pulse</div>
          <div className="text-[8px] text-gray-400 border border-gray-200 rounded-lg px-2 py-1">Mark all read</div>
        </div>
        <div className="flex gap-1 mb-3">
          {['All', 'Warnings', 'Insights', 'Tips'].map((f, i) => (
            <div key={f} className={`text-[8px] px-2 py-0.5 rounded-full ${i === 0 ? 'bg-[#5B5BD6] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>{f}</div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { type: 'WARNING', color: '#d97706', border: '#d97706', title: 'Your takeaway spending is up 40% from last month', sub: 'You spent £43.00 on takeaways this month compared to £30.50 last month.' },
            { type: 'INSIGHT', color: '#5B5BD6', border: '#5B5BD6', title: "You're £1,800 away from your Emergency Fund", sub: 'At your current saving rate of ~£600/month, you\'ll hit your £10,000 target in about 3 months.' },
            { type: 'TIP', color: '#16a34a', border: '#16a34a', title: 'Pay your Amex in full to save ~£268/year', sub: 'Your Amex Gold balance is £1,340. Paying it off monthly avoids compound interest.' },
          ].map(a => (
            <div key={a.type} className="bg-white rounded-xl p-2.5 shadow-sm" style={{ borderLeft: `3px solid ${a.border}` }}>
              <div className="flex items-center justify-between mb-0.5">
                <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: a.color }}>{a.type}</div>
                <div className="text-[7px] text-gray-400">just now</div>
              </div>
              <div className="text-[9px] font-semibold text-gray-800 mb-0.5">{a.title}</div>
              <div className="text-[8px] text-gray-500 leading-relaxed">{a.sub}</div>
              <div className="mt-1 text-[7px] text-[#5B5BD6] font-medium flex items-center gap-0.5">💬 Ask Sonfi</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active }: { active: string }) {
  const items = [
    { name: 'Dashboard' },
    { name: 'Chat', badge: '✦ AI' },
    { name: 'Accounts' },
    { name: 'Transactions' },
    { name: 'Budgets' },
    { name: 'Goals' },
    { name: 'Pulse', count: 3 },
    { name: 'Scheduled' },
    { name: 'Offers' },
  ];
  return (
    <div className="w-[90px] bg-white border-r border-gray-100 p-2 flex-shrink-0">
      <div className="font-extrabold text-[#1a1145] text-[10px] mb-3 tracking-tight">SONFI</div>
      <div className="space-y-0.5">
        {items.map(item => (
          <div
            key={item.name}
            className={`flex items-center justify-between px-1.5 py-1 rounded-md text-[8px] ${
              item.name === active ? 'bg-[#5B5BD6]/10 text-[#5B5BD6] font-semibold' : 'text-gray-500'
            }`}
          >
            <span>{item.name}</span>
            {item.count && (
              <span className="bg-red-500 text-white text-[6px] w-3 h-3 rounded-full flex items-center justify-center">{item.count}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
