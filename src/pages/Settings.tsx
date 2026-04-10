import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAccounts } from '@/hooks/useFinanceData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { Database, RefreshCw, Trash2, ChevronRight, Tag, Users, Globe, Archive, Shield, Bell as BellIcon, Search, FileText, List, Palette } from 'lucide-react';

const institutionLogos: Record<string, { bg: string; letter: string }> = {
  'Barclays': { bg: '#00AEEF', letter: 'B' },
  'Monzo': { bg: '#FF3464', letter: 'M' },
  'Goldman Sachs': { bg: '#1A1A1A', letter: 'G' },
  'Chase UK': { bg: '#117ACA', letter: 'C' },
  'American Express': { bg: '#007BC1', letter: 'A' },
  'Vanguard': { bg: '#961A1A', letter: 'V' },
  'Coinbase': { bg: '#0052FF', letter: 'C' },
};

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const demo = useDemoMode();
  const { data: profile, isLoading } = useProfile();
  const { data: accounts } = useAccounts();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setName(profile.full_name || '');
    setCurrency(profile.currency || 'GBP');
    setInitialized(true);
  }

  const handleSave = async () => {
    if (demo) { toast.success('Settings saved (demo)'); return; }
    await updateProfile.mutateAsync({ full_name: name, currency });
    toast.success('Settings saved');
  };

  const handleLogout = async () => {
    if (demo) { navigate('/'); return; }
    await signOut();
    qc.clear();
    navigate('/');
  };

  if (isLoading) return <div className="p-5 lg:p-8 max-w-3xl mx-auto space-y-6"><Skeleton className="h-8 w-32" /><Skeleton className="h-48 rounded-2xl" /></div>;

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-medium">Settings</h1>

      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="label-text block mb-1.5">Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="label-text block mb-1.5">Email</label>
            <input value={user?.email || (demo ? 'alex@example.com' : '')} readOnly className="w-full bg-muted border rounded-xl px-4 py-2.5 text-sm text-muted-foreground" />
          </div>
          <div>
            <label className="label-text block mb-1.5">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-background border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>

      {/* Linked accounts */}
      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Linked accounts</h2>
        <div className="space-y-3">
          {accounts?.map(a => {
            const logo = institutionLogos[a.institution || ''];
            return (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: logo?.bg || a.colour || '#7F77DD', color: '#fff' }}>
                  {logo?.letter || (a.institution?.[0] || 'A')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.institution || 'Manual'} · {a.type.replace('_', ' ')}</p>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal/10 text-teal font-medium">Connected</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferences */}
      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Preferences</h2>
        <div className="divide-y">
          {[
            { icon: Tag, label: 'Categories', desc: 'Manage transaction categories', color: '#7F77DD' },
            { icon: Users, label: 'Payees', desc: 'Saved payee names & rules', color: '#378ADD' },
            { icon: Palette, label: 'Tags', desc: 'Custom tags for transactions', color: '#E24B4A' },
            { icon: Globe, label: 'Currencies', desc: 'Display & conversion settings', color: '#1D9E75' },
            { icon: Archive, label: 'Archived Accounts', desc: 'View hidden accounts', color: '#6B7280' },
          ].map(item => (
            <button key={item.label} className="flex items-center gap-3 w-full py-3 text-left hover:bg-muted/50 rounded-lg px-2 transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '18', color: item.color }}>
                <item.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Security</h2>
        <div className="divide-y">
          {[
            { icon: Shield, label: 'Security', desc: 'Password, 2FA & login history' },
            { icon: Search, label: 'Spotlight indexing', desc: 'Search transactions from device', toggle: true },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 py-3 px-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal/10 text-teal">
                <item.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              {item.toggle ? (
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              ) : (
                <ChevronRight size={14} className="text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Display */}
      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Display</h2>
        <div className="divide-y">
          <div className="flex items-center gap-3 py-3 px-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
              <FileText size={14} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New Transaction Screen</p>
              <p className="text-[11px] text-muted-foreground">Configure the add transaction form</p>
            </div>
            <ChevronRight size={14} className="text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 py-3 px-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
              <List size={14} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">List of Transactions</p>
              <p className="text-[11px] text-muted-foreground">Customize the transaction list layout</p>
            </div>
            <ChevronRight size={14} className="text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 py-3 px-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber/10 text-amber">
              <Palette size={14} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Theme</p>
            </div>
            <div className="flex gap-1">
              {['🌐', '☀️', '🌙'].map((emoji, i) => (
                <button key={i} className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center border ${i === 2 ? 'border-primary bg-primary/10' : 'border-border'}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 py-3 px-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-coral/10 text-coral">
              <FileText size={14} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Font Size</p>
            </div>
            <div className="flex gap-1">
              {['Aa', 'Aa', 'Aa'].map((label, i) => (
                <button key={i} className={`px-3 py-1.5 rounded-lg border text-xs ${i === 1 ? 'border-primary bg-primary/10 font-medium' : 'border-border'}`}
                  style={{ fontSize: i === 0 ? '11px' : i === 1 ? '13px' : '15px' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
        <h2 className="text-sm font-medium mb-4">Subscription</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 bg-muted rounded-lg font-medium">Free plan</span>
          <span className="text-xs text-muted-foreground">28 of 30 free AI messages used</span>
          <Button size="sm" className="ml-auto">Upgrade to Pro</Button>
        </div>
      </div>

      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Notifications</h2>
        <div className="space-y-3">
          {['Pulse alerts', 'Budget warnings', 'Goal milestones', 'Weekly summary email'].map(item => (
            <label key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
            </label>
          ))}
        </div>
      </div>

      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Clarifi AI</h2>
        <div className="space-y-3">
          <div>
            <label className="label-text block mb-1.5">Coaching style</label>
            <select className="bg-background border rounded-xl px-4 py-2.5 text-sm">
              <option>Concise</option>
              <option>Detailed</option>
              <option>Coaching</option>
            </select>
          </div>
        </div>
      </div>

      {/* Demo data */}
      <div className="clarifi-card">
        <div className="flex items-center gap-2 mb-2">
          <Database size={16} className="text-primary" />
          <h2 className="text-sm font-medium">Demo data</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Reload the demo dataset to see Clarifi with a fully populated financial profile, or clear all data to start fresh.</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => {
            toast.success('Demo data reloaded!');
            qc.invalidateQueries();
          }} className="flex items-center gap-1.5">
            <RefreshCw size={14} /> Reload demo data
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            if (confirm('This will clear all data. Continue?')) {
              toast.success('All data cleared');
              qc.invalidateQueries();
            }
          }} className="flex items-center gap-1.5 text-coral border-coral/30 hover:bg-coral/5">
            <Trash2 size={14} /> Clear all data
          </Button>
        </div>
      </div>

      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Account</h2>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-coral">
          {demo ? 'Exit demo' : 'Sign out'}
        </Button>
      </div>
    </div>
  );
}
