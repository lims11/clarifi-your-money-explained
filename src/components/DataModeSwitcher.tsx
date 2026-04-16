import { useDataMode } from '@/context/DataModeContext';
import { UpcomingBadge } from './UpcomingBadge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function DataModeSwitcher({ onClose }: { onClose: () => void }) {
  const { mode, setMode } = useDataMode();
  const [waitlistEmail, setWaitlistEmail] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-1">How do you want to use Sonfi?</h3>
        <p className="text-sm text-muted-foreground mb-5">You can change this at any time from Settings.</p>

        <div className="space-y-3">
          {/* Upload mode */}
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
                  <span className="text-sm font-semibold">Upload bank statements</span>
                  {mode === 'upload' && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary">Current mode</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload PDF, CSV, or Excel files from your bank. Sonfi analyses and categorises them automatically. You can edit any transaction or budget inline.
                </p>
              </div>
            </div>
          </button>

          {/* Sync mode - UPCOMING */}
          <div className="w-full text-left p-4 rounded-xl border-2 border-border opacity-60 cursor-not-allowed">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏦</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Live bank sync</span>
                  <UpcomingBadge />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect directly to your bank for automatic real-time transaction sync. No manual uploads needed.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="email"
                    placeholder="Enter your email for early access"
                    value={waitlistEmail}
                    onChange={e => { e.stopPropagation(); setWaitlistEmail(e.target.value); }}
                    onClick={e => e.stopPropagation()}
                    className="flex-1 border rounded-lg px-3 py-1.5 text-xs bg-background"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (waitlistEmail) {
                        toast.success('You\'re on the waitlist! We\'ll email you when bank sync launches.');
                        setWaitlistEmail('');
                      }
                    }}
                  >
                    Join waitlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button variant="ghost" onClick={onClose} className="w-full mt-4">Cancel</Button>
      </div>
    </div>
  );
}
