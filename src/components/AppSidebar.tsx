import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Wallet, ArrowLeftRight, PieChart, Target, Bell, Settings, Sparkles } from 'lucide-react';
import { samplePulseAlerts } from '@/data/sample-data';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat', icon: MessageSquare, badge: 'AI' },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Budgets', icon: PieChart },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/pulse', label: 'Pulse', icon: Bell, count: samplePulseAlerts.filter(a => !a.is_read).length },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-card border-r fixed left-0 top-0 z-30">
      <div className="p-5 pb-4">
        <span className="text-xl font-medium text-primary">Clarifi</span>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(item => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-primary-light text-sidebar-accent-foreground border-l-2 border-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Sparkles size={10} />
                  {item.badge}
                </span>
              )}
              {item.count && item.count > 0 && (
                <span className="ml-auto text-[10px] font-medium bg-coral text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t">
        <NavLink
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            location.pathname === '/settings' ? 'bg-primary-light text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
        <div className="flex items-center gap-3 px-3 py-3 mt-1">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">James</p>
            <p className="text-[11px] text-muted-foreground">Free plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

const mobileNavItems = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat', icon: MessageSquare, dot: true },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/budgets', label: 'Budgets', icon: PieChart },
  { to: '/pulse', label: 'Pulse', icon: Bell },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-30 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around">
        {mobileNavItems.map(item => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-2.5 px-3 text-[11px] transition-colors relative ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon size={20} />
              {item.dot && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full" />
              )}
              <span className="mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
