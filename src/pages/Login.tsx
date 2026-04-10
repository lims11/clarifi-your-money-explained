import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<'signin' | 'signup'>(searchParams.get('tab') === 'signup' ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Demo: just navigate
    setTimeout(() => {
      setLoading(false);
      navigate(tab === 'signup' ? '/onboarding' : '/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-primary mb-1">Clarifi</h1>
          <p className="text-sm text-muted-foreground">Your money, finally explained.</p>
        </div>

        <div className="clarifi-card">
          <div className="flex border-b mb-6">
            <button
              onClick={() => setTab('signin')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${tab === 'signin' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${tab === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="label-text block mb-1.5">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-card border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="James Smith"
                  required
                />
              </div>
            )}
            <div>
              <label className="label-text block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-card border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="james@example.com"
                required
              />
            </div>
            <div>
              <label className="label-text block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-card border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-coral">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : tab === 'signin' ? 'Sign in' : 'Create account'}
            </Button>
            {tab === 'signin' && (
              <p className="text-center text-xs text-muted-foreground">
                <button type="button" className="text-primary hover:underline">Forgot password?</button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
