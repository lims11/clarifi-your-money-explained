import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const steps = [
  {
    title: "Let's build your financial picture",
    body: "Answer 8 quick questions and we'll set everything up for you — no manual configuration.",
    type: 'welcome' as const,
  },
  {
    title: 'What should we call you?',
    type: 'text' as const,
    placeholder: 'Your first name',
    key: 'name',
  },
  {
    title: 'How many current (checking) accounts do you have?',
    type: 'single' as const,
    key: 'current_accounts',
    options: ['1', '2', '3+', 'None'],
  },
  {
    title: 'Do you have any savings accounts or ISAs?',
    type: 'single' as const,
    key: 'savings',
    options: ['Yes, one', 'Yes, multiple', 'No'],
  },
  {
    title: 'Do you have a mortgage or any other loans?',
    type: 'multi' as const,
    key: 'loans',
    options: ['Mortgage', 'Personal loan', 'Car finance', 'Student loan', 'No loans'],
  },
  {
    title: 'Do you have investments or crypto?',
    type: 'multi' as const,
    key: 'investments',
    options: ['Stocks & shares ISA', 'General investment account', 'Crypto', 'Pension', 'None'],
  },
  {
    title: 'Do you use credit cards?',
    type: 'single' as const,
    key: 'credit_cards',
    options: ['Yes, one', 'Yes, multiple', 'No'],
  },
  {
    title: 'What are your main financial goals?',
    type: 'multi' as const,
    key: 'goals',
    options: ['Save more each month', 'Pay off debt', 'Build an emergency fund', 'Save for a house', 'Grow investments', 'Track spending', 'Retire early'],
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [textValue, setTextValue] = useState('');
  const [selectedSingle, setSelectedSingle] = useState('');
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const navigate = useNavigate();

  const current = steps[step];
  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (current.type === 'text' && current.key) {
      setAnswers(prev => ({ ...prev, [current.key!]: textValue }));
      setTextValue('');
    } else if (current.type === 'single' && current.key) {
      setAnswers(prev => ({ ...prev, [current.key!]: selectedSingle }));
      setSelectedSingle('');
    } else if (current.type === 'multi' && current.key) {
      setAnswers(prev => ({ ...prev, [current.key!]: selectedMulti }));
      setSelectedMulti([]);
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const canContinue = () => {
    if (current.type === 'welcome') return true;
    if (current.type === 'text') return textValue.trim().length > 0;
    if (current.type === 'single') return selectedSingle !== '';
    if (current.type === 'multi') return selectedMulti.length > 0;
    return true;
  };

  const toggleMulti = (opt: string) => {
    setSelectedMulti(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <p className="label-text mb-2">Step {step + 1} of {totalSteps}</p>
          <h1 className="text-2xl font-medium mb-6">{current.title}</h1>

          {current.type === 'welcome' && (
            <p className="text-muted-foreground mb-8">{current.body}</p>
          )}

          {current.type === 'text' && (
            <input
              type="text"
              value={textValue}
              onChange={e => setTextValue(e.target.value)}
              className="w-full bg-card border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 mb-8"
              placeholder={current.placeholder}
              autoFocus
            />
          )}

          {current.type === 'single' && (
            <div className="space-y-2 mb-8">
              {current.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedSingle(opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    selectedSingle === opt
                      ? 'border-primary bg-primary-light text-foreground'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {current.type === 'multi' && (
            <div className="space-y-2 mb-8">
              {current.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleMulti(opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    selectedMulti.includes(opt)
                      ? 'border-primary bg-primary-light text-foreground'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  {opt}
                  {selectedMulti.includes(opt) && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
            )}
            <Button onClick={handleNext} disabled={!canContinue()} className="flex-1">
              {current.type === 'welcome' ? "Let's go" : step === totalSteps - 1 ? 'Finish setup' : 'Continue'}
            </Button>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="block mx-auto mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
