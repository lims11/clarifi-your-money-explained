export function DashboardWebMockup() {
  return (
    <div className="flex h-full text-[10px] sm:text-xs" style={{ minHeight: 280 }}>
      {/* Sidebar */}
      <div className="w-[100px] sm:w-[130px] bg-white border-r border-gray-100 p-2 sm:p-3 flex-shrink-0">
        <div className="font-extrabold text-[#1a1145] text-[10px] sm:text-xs mb-4 tracking-tight">SONFI</div>
        <div className="space-y-1">
          {[
            { name: 'Dashboard', active: true },
            { name: 'Chat ✦AI', badge: true },
            { name: 'Accounts' },
            { name: 'Transactions' },
            { name: 'Budgets' },
            { name: 'Goals' },
            { name: 'Pulse', count: 3 },
            { name: 'Scheduled' },
            { name: 'Offers' },
          ].map((item) => (
            <div
              key={item.name}
              className={`flex items-center justify-between px-2 py-1 rounded-md text-[9px] sm:text-[10px] ${
                item.active
                  ? 'bg-[#5B5BD6]/10 text-[#5B5BD6] font-semibold'
                  : 'text-gray-500'
              }`}
            >
              <span>{item.name}</span>
              {item.count && (
                <span className="bg-red-500 text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-[#F8F9FC] p-2 sm:p-4 overflow-hidden">
        <div className="text-gray-400 text-[9px]">Tuesday 14 April</div>
        <div className="text-gray-800 font-semibold text-[11px] sm:text-sm mb-3">Good morning, Kim 👋</div>

        {/* Net Worth */}
        <div className="bg-white rounded-xl p-2 sm:p-3 shadow-sm mb-2">
          <div className="text-[9px] text-gray-400 uppercase tracking-wide">Net Worth</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900">£29,623.60</div>
          <div className="flex gap-3 mt-1 text-[9px]">
            <span className="text-green-600">Assets £31,449.80</span>
            <span className="text-red-500">Liabilities £1,826.20</span>
            <span className="text-green-600">↗ +£1,131.16</span>
          </div>
          {/* Sparkline */}
          <svg className="w-full h-8 mt-2" viewBox="0 0 200 30">
            <polyline
              points="0,25 20,22 40,20 60,23 80,18 100,15 120,17 140,12 160,10 180,8 200,5"
              fill="none"
              stroke="#5B5BD6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polyline
              points="0,25 20,22 40,20 60,23 80,18 100,15 120,17 140,12 160,10 180,8 200,5"
              fill="url(#sparkGrad)"
              stroke="none"
            />
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B5BD6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#5B5BD6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Health Score */}
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <div className="text-[9px] text-gray-400 uppercase tracking-wide">Financial Health</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-lg font-bold text-amber-500">68</div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
          </div>
          {/* Credit Score mini */}
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <div className="text-[9px] text-gray-400 uppercase tracking-wide">Credit Score</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-lg font-bold text-amber-500">724</div>
              <div className="text-[8px] text-gray-400">Fair</div>
            </div>
            <div className="text-[7px] text-gray-300 mt-0.5">Powered by Experian</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardMobileMockup() {
  return (
    <div className="bg-[#F8F9FC] p-3 text-[11px]" style={{ minHeight: 400 }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-gray-800 font-semibold text-sm">Good morning, Kim 👋</div>
          <div className="text-gray-400 text-[10px]">Tuesday 14 April</div>
        </div>
        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-xs">🔔</span>
        </div>
      </div>

      {/* Ask Sonfi */}
      <div className="bg-white rounded-xl px-3 py-2.5 mb-3 flex items-center gap-2 shadow-sm">
        <span className="text-[#5B5BD6]">✦</span>
        <span className="text-gray-400 text-[10px]">Ask Sonfi anything...</span>
      </div>

      {/* Net worth card */}
      <div className="bg-white rounded-xl p-3 shadow-sm mb-3">
        <div className="text-[9px] text-gray-400 uppercase tracking-wide">Net Worth</div>
        <div className="text-xl font-bold text-gray-900">£29,623.60</div>
        <div className="flex gap-4 mt-2 text-[10px]">
          <div>
            <div className="text-gray-400">Income</div>
            <div className="text-green-600 font-semibold">£3,350.00</div>
          </div>
          <div>
            <div className="text-gray-400">Expenses</div>
            <div className="text-red-500 font-semibold">£2,218.84</div>
          </div>
          <div>
            <div className="text-gray-400">Savings Rate</div>
            <div className="text-green-600 font-semibold">34%</div>
          </div>
        </div>
      </div>

      {/* Spending this month */}
      <div className="bg-white rounded-xl p-3 shadow-sm mb-3">
        <div className="text-xs font-semibold text-gray-800 mb-2">Spending this month</div>
        <div className="flex justify-center mb-2">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#5B5BD6" strokeWidth="12"
              strokeDasharray="168 240" strokeDashoffset="0" strokeLinecap="round" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#16a34a" strokeWidth="12"
              strokeDasharray="28 240" strokeDashoffset="-168" strokeLinecap="round" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#d97706" strokeWidth="12"
              strokeDasharray="14 240" strokeDashoffset="-196" strokeLinecap="round" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#dc2626" strokeWidth="12"
              strokeDasharray="18 240" strokeDashoffset="-210" strokeLinecap="round" />
            <text x="50" y="46" textAnchor="middle" className="text-[7px] fill-gray-400">This month</text>
            <text x="50" y="57" textAnchor="middle" className="text-[10px] font-bold fill-gray-900">£2,218.84</text>
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5B5BD6]" /> Bills <span className="ml-auto font-medium">£1,601.00</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#dc2626]" /> Food & D... <span className="ml-auto font-medium">£239.90</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Shopping <span className="ml-auto font-medium">£148.98</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#d97706]" /> Transport <span className="ml-auto font-medium">£110.00</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> Personal <span className="ml-auto font-medium">£40.00</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#16a34a]" /> Health <span className="ml-auto font-medium">£39.99</span></div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="bg-white border-t border-gray-100 flex justify-around py-2 -mx-3 -mb-3 rounded-b-xl">
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
