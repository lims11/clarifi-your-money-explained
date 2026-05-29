import { Check, Loader2 } from 'lucide-react';

export type StepStatus = 'done' | 'active' | 'pending' | 'error';
export interface StepDef { id: string; label: string; status: StepStatus }

export function ProgressStepper({ steps }: { steps: StepDef[] }) {
  return (
    <div className="flex items-center w-full mb-4">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 min-w-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium border-2 transition-colors
                ${s.status === 'done' ? 'bg-primary border-primary text-primary-foreground' :
                  s.status === 'active' ? 'border-primary text-primary bg-primary/10' :
                  s.status === 'error' ? 'border-destructive text-destructive bg-destructive/10' :
                  'border-muted-foreground/30 text-muted-foreground'}`}
            >
              {s.status === 'done' ? <Check size={14} /> :
                s.status === 'active' ? <Loader2 size={12} className="animate-spin" /> :
                i + 1}
            </div>
            <span className={`text-[10px] leading-tight text-center max-w-[80px] truncate ${s.status === 'pending' ? 'text-muted-foreground' : 'font-medium'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 ${steps[i].status === 'done' ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
