import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile();
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
    await updateProfile.mutateAsync({ full_name: name, currency });
    toast.success('Settings saved');
  };

  const handleLogout = async () => {
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
            <input value={user?.email || ''} readOnly className="w-full bg-muted border rounded-xl px-4 py-2.5 text-sm text-muted-foreground" />
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

      <div className="clarifi-card">
        <h2 className="text-sm font-medium mb-4">Subscription</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 bg-muted rounded-lg font-medium">Free plan</span>
          <Button size="sm">Upgrade to Pro</Button>
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
        <h2 className="text-sm font-medium mb-4">Account</h2>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-coral">Sign out</Button>
      </div>
    </div>
  );
}
