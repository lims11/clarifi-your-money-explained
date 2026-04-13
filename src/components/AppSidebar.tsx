import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Wallet, ArrowLeftRight, PieChart, Target, Bell, Settings, Sparkles, BarChart2, Calendar, Gift, MoreHorizontal, X } from 'lucide-react';
import { useUnreadAlertCount } from '@/hooks/useFinanceData';
import { useProfile } from '@/hooks/useProfile';
import { useDemoMode, useDemoPrefix } from '@/hooks/useDemoMode';

const baseNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/chat', label: 'Chat', icon: MessageSquare, badge: 'AI' },
  { path: '/accounts', label: 'Accounts', icon: Wallet },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/budgets', label: 'Budgets', icon: PieChart },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/pulse', label: 'Pulse', icon: Bell, usePulseCount: true },
  { path: '/scheduled', label: 'Scheduled', icon: Calendar },
  { path: '/offers', label: 'Offers', icon: Gift },
];

export function AppSidebar() {
  const location = useLocation();
  const { data: unreadCount } = useUnreadAlertCount();
  const { data: profile } = useProfile();
  const demo = useDemoMode();
  const prefix = useDemoPrefix();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-card border-r fixed left-0 top-0 z-30">
      <div className="p-5 pb-4">
        <span className="text-xl font-medium text-primary">Sonfi</span>
        {demo && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber/20 text-amber font-medium">DEMO</span>}
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {baseNavItems.map(item => {
          const to = `${prefix}${item.path}`;
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          const count = item.usePulseCount ? (unreadCount ?? 0) : 0;
          return (
            <NavLink key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${isActive ? 'bg-primary-light text-sidebar-accent-foreground border-l-2 border-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Sparkles size={10} />{item.badge}
                </span>
              )}
              {count > 0 && (
                <span className="ml-auto text-[10px] font-medium bg-coral text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t">
        <NavLink to={`${prefix}/settings`} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${location.pathname === `${prefix}/settings` ? 'bg-primary-light text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
          <Settings size={18} /><span>Settings</span>
        </NavLink>
        <div className="flex items-center gap-3 px-3 py-3 mt-1">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
            {profile?.full_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-[11px] text-muted-foreground">{demo ? 'Demo mode' : 'Free plan'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

const mobileBaseItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/chat', label: 'Chat', icon: MessageSquare, dot: true },
  { path: '/accounts', label: 'Accounts', icon: Wallet },
  { path: '/budgets', label: 'Budgets', icon: PieChart },
];

const mobileMoreItems = [
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/offers', label: 'Offers', icon: Gift },
  { path: '/scheduled', label: 'Scheduled', icon: Calendar },
  { path: '/pulse', label: 'Pulse', icon: Bell },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const location = useLocation();
  const demo = useDemoMode();
  const prefix = useDemoPrefix();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = mobileMoreItems.some(item => {
    const to = `${prefix}${item.path}`;
    return location.pathname === to || location.pathname.startsWith(to + '/');
  });

  return (
    <>
      {/* More menu overlay */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-[60px] left-0 right-0 bg-card border-t rounded-t-2xl p-4 pb-2 animate-in slide-in-from-bottom-4" onClick={e => e.stopPropagation()}>
            <div className="grid grid-cols-3 gap-1">
              {mobileMoreItems.map(item => {
                const to = `${prefix}${item.path}`;
                const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                return (
                  <NavLink key={to} to={to} onClick={() => setMoreOpen(false)} className={`flex flex-col items-center py-3 px-2 rounded-xl text-xs transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`}>
                    <item.icon size={20} />
                    <span className="mt-1">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-30 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around">
          {mobileBaseItems.map(item => {
            const to = `${prefix}${item.path}`;
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <NavLink key={to} to={to} className={`flex flex-col items-center py-2.5 px-3 text-[11px] transition-colors relative ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                <item.icon size={20} />
                {item.dot && <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full" />}
                <span className="mt-0.5">{item.label}</span>
              </NavLink>
            );
          })}
          <button onClick={() => setMoreOpen(!moreOpen)} className={`flex flex-col items-center py-2.5 px-3 text-[11px] transition-colors ${moreOpen || isMoreActive ? 'text-primary' : 'text-muted-foreground'}`}>
            {moreOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
            <span className="mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
