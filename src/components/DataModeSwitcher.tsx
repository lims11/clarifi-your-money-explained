import { useDataMode } from '@/context/DataModeContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AutosyncModal } from '@/components/accounts/AutosyncModal';

export function DataModeSwitcher({ onClose }: { onClose: () => void }) {
  const { mode, setMode } = useDataMode();
  const [showAutosync, setShowAutosync] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-card rounded-2xl border p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-1">Choose your data entry</h3>
          <p className="text-sm text-muted-foreground mb-5">You can change this at any time from Settings.</p>

          <div className="space-y-3">
            {/* Manual Entry */}
            <button
              onClick={() => { setMode('upload'); onClose(); }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                mode === 'upload' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Manual Entry</span>
                    {mode === 'upload' && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary">Current mode</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload PDF or CSV statements from your bank. Sonfi analyses and categorises automatically.
                  </p>
                </div>
              </div>
            </button>

            {/* Autosync — now selectable (simulated for demo) */}
            <button
              onClick={() => { setMode('sync'); setShowAutosync(true); }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                mode === 'sync' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏦</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Autosync</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">Beta · Demo</span>
                    {mode === 'sync' && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary">Current mode</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pick a UK bank (Barclays, HSBC, Monzo, Starling, Lloyds, NatWest…), choose account type, and pull 90 days of transactions. Live Open Banking pending — demo flow imports realistic data end-to-end.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <Button variant="ghost" onClick={onClose} className="w-full mt-4">Cancel</Button>
        </div>
      </div>
      {showAutosync && <AutosyncModal onClose={() => { setShowAutosync(false); onClose(); }} />}
    </>
  );
}
