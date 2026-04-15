import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UK_BANKS, getBankById } from '@/data/ukBanks';
import { useAccounts, useAddAccount } from '@/hooks/useFinanceData';
import { useDemoMode } from '@/hooks/useDemoMode';
import { UpcomingBadge } from '@/components/UpcomingBadge';
import { toast } from 'sonner';
import { ArrowLeft, Search, Upload, Edit3, Wifi, CreditCard, Landmark, PiggyBank, Home, TrendingUp, Bitcoin, Wallet, Briefcase } from 'lucide-react';

const ACCOUNT_TYPES = [
  { id: 'current', label: 'Current Account', icon: Landmark, desc: 'Everyday spending' },
  { id: 'savings', label: 'Savings Account', icon: PiggyBank, desc: 'Grow your money' },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard, desc: 'Track credit spending' },
  { id: 'mortgage', label: 'Mortgage / Loan', icon: Home, desc: 'Track repayments' },
  { id: 'investment', label: 'Investment / ISA', icon: TrendingUp, desc: 'Stocks, funds, ISAs' },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin, desc: 'Digital currencies' },
  { id: 'cash', label: 'Cash Wallet', icon: Wallet, desc: 'Physical cash tracking' },
  { id: 'business', label: 'Business Account', icon: Briefcase, desc: 'Business finances' },
];

interface AddAccountModalProps {
  onClose: () => void;
  onSave: (data: { name: string; type: string; institution: string; balance: number; colour: string }) => void;
}

export function AddAccountModal({ onClose, onSave }: AddAccountModalProps) {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('');
  const [bankId, setBankId] = useState('');
  const [customBankName, setCustomBankName] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [nickname, setNickname] = useState('');
  const [balance, setBalance] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const demo = useDemoMode();

  const selectedBank = getBankById(bankId);
  const bankName = bankId === 'other' ? customBankName : (selectedBank?.name || '');

  const filteredBanks = UK_BANKS.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleSelectType = (typeId: string) => {
    setAccountType(typeId);
    setStep(2);
  };

  const handleSelectBank = (id: string) => {
    setBankId(id);
    const bank = getBankById(id);
    const typeLabel = ACCOUNT_TYPES.find(t => t.id === accountType)?.label || accountType;
    if (bank && id !== 'other') {
      setNickname(`${bank.name} ${typeLabel}`);
    }
  };

  const handleSave = () => {
    if (demo) {
      toast.success('Account added (demo)');
      onClose();
      return;
    }
    onSave({
      name: nickname || `${bankName} ${accountType}`,
      type: accountType === 'business' ? 'current' : accountType,
      institution: bankName,
      balance: parseFloat(balance) || 0,
      colour: selectedBank?.colour || '#7F77DD',
    });
    toast.success('Account added');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h3 className="text-lg font-semibold">Add account</h3>
            <p className="text-xs text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {/* STEP 1: Choose type */}
        {step === 1 && (
          <div>
            <p className="text-sm font-medium mb-4">What type of account is this?</p>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelectType(t.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <t.icon size={18} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Choose bank + details */}
        {step === 2 && (
          <div>
            {!bankId ? (
              <>
                <p className="text-sm font-medium mb-3">Choose your bank</p>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    placeholder="Search banks..."
                    value={bankSearch}
                    onChange={e => setBankSearch(e.target.value)}
                    className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-background"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-[40vh] overflow-y-auto">
                  {filteredBanks.map(bank => (
                    <button
                      key={bank.id}
                      onClick={() => handleSelectBank(bank.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: bank.colour }}
                      >
                        {bank.letter}
                      </div>
                      <span className="text-[11px] font-medium text-center leading-tight">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/50">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: selectedBank?.colour || '#7F77DD' }}
                  >
                    {selectedBank?.letter || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{bankId === 'other' ? 'Custom bank' : selectedBank?.name}</p>
                    <p className="text-[11px] text-muted-foreground">{ACCOUNT_TYPES.find(t => t.id === accountType)?.label}</p>
                  </div>
                  <button onClick={() => setBankId('')} className="text-xs text-primary hover:underline">Change</button>
                </div>

                <div className="space-y-3">
                  {bankId === 'other' && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Bank name</label>
                      <input
                        placeholder="Enter your bank name"
                        value={customBankName}
                        onChange={e => setCustomBankName(e.target.value)}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Account nickname</label>
                    <input
                      placeholder="e.g. Barclays Current"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      {accountType === 'credit_card' ? 'Current balance (£)' : 'Current balance (£)'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={balance}
                      onChange={e => setBalance(e.target.value)}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background"
                    />
                  </div>
                  {accountType === 'credit_card' && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Credit limit (£)</label>
                      <input type="number" placeholder="e.g. 5000" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                    </div>
                  )}
                  {(accountType === 'savings' || accountType === 'mortgage') && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Interest rate % (optional)</label>
                      <input type="number" step="0.01" placeholder="e.g. 4.5" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-background" />
                    </div>
                  )}
                </div>

                <Button className="w-full mt-4" onClick={() => setStep(3)} disabled={!nickname && bankId === 'other' && !customBankName}>
                  Continue
                </Button>
              </>
            )}
          </div>
        )}

        {/* STEP 3: How to add data */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-medium mb-2">How would you like to add your data?</p>

            {/* Upload option */}
            <button
              onClick={handleSave}
              className="w-full text-left p-4 rounded-xl border-2 border-primary/20 hover:border-primary bg-primary/5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Upload size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Upload my bank statement</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a PDF, CSV, or Excel file from your bank. Sonfi will read your transactions automatically.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(selectedBank?.statementFormats || ['pdf', 'csv']).map(fmt => (
                      <span key={fmt} className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">{fmt}</span>
                    ))}
                  </div>
                  {selectedBank?.pdfHint && (
                    <p className="text-[11px] text-primary mt-2">💡 {selectedBank.pdfHint}</p>
                  )}
                </div>
              </div>
            </button>

            {/* Manual option */}
            <button
              onClick={handleSave}
              className="w-full text-left p-4 rounded-xl border-2 border-border hover:border-teal/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                  <Edit3 size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Enter transactions manually</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Type your transactions yourself. You're in full control of your data.
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    You can always upload a statement later to bulk-import history.
                  </p>
                </div>
              </div>
            </button>

            {/* Bank sync - UPCOMING */}
            <div className="w-full text-left p-4 rounded-xl border-2 border-border opacity-50 cursor-not-allowed">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Wifi size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">Connect directly to {bankName || 'your bank'}</p>
                    <UpcomingBadge />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatic real-time transaction sync. Coming soon.
                  </p>
                  <button className="text-xs text-primary font-medium mt-2 hover:underline" onClick={e => { e.stopPropagation(); toast.success('You\'re on the waitlist!'); }}>
                    Join waitlist →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <Button variant="ghost" onClick={onClose} className="w-full mt-4">Cancel</Button>
        )}
      </div>
    </div>
  );
}
