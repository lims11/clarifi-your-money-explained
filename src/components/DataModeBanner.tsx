import { useDataMode } from '@/context/DataModeContext';
import { Upload, Edit3, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DataModeSwitcher } from './DataModeSwitcher';

export function DataModeBanner() {
  const { mode } = useDataMode();
  const [showSwitcher, setShowSwitcher] = useState(false);

  if (mode === 'sync') return null;

  const config = {
    upload: {
      icon: <Upload size={14} />,
      text: 'You are in Statement Upload Mode',
      sub: 'Upload your bank statements to let Sonfi analyse your finances.',
      bgClass: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800',
      textClass: 'text-indigo-900 dark:text-indigo-200',
      subClass: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900',
    },
    manual: {
      icon: <Edit3 size={14} />,
      text: 'You are in Manual Entry Mode',
      sub: 'You are in full control — enter your transactions, balances, and goals yourself.',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
      textClass: 'text-emerald-900 dark:text-emerald-200',
      subClass: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900',
    },
  };

  const c = config[mode as 'upload' | 'manual'];

  return (
    <>
      <div className={`mx-5 lg:mx-8 mt-3 rounded-xl border px-4 py-3 flex items-center gap-3 ${c.bgClass}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.iconBg} ${c.subClass}`}>
          {c.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${c.textClass}`}>{c.text}</p>
          <p className={`text-[11px] ${c.subClass} hidden sm:block`}>{c.sub}</p>
        </div>
        <button
          onClick={() => setShowSwitcher(true)}
          className={`flex items-center gap-1 text-[11px] font-medium ${c.subClass} hover:underline flex-shrink-0`}
        >
          Switch mode <ChevronRight size={12} />
        </button>
      </div>
      {showSwitcher && <DataModeSwitcher onClose={() => setShowSwitcher(false)} />}
    </>
  );
}
