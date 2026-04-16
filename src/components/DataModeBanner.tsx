import { useDataMode } from '@/context/DataModeContext';
import { Upload, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DataModeSwitcher } from './DataModeSwitcher';

export function DataModeBanner() {
  const { mode } = useDataMode();
  const [showSwitcher, setShowSwitcher] = useState(false);

  if (mode === 'sync') return null;

  return (
    <>
      <div className="mx-5 lg:mx-8 mt-3 rounded-xl border px-4 py-3 flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
          <Upload size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">Statement Upload Mode</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 hidden sm:block">Upload your bank statements to let Sonfi analyse your finances.</p>
        </div>
        <button
          onClick={() => setShowSwitcher(true)}
          className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0"
        >
          Switch mode <ChevronRight size={12} />
        </button>
      </div>
      {showSwitcher && <DataModeSwitcher onClose={() => setShowSwitcher(false)} />}
    </>
  );
}
