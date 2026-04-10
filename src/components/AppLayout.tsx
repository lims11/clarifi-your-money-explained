import { Outlet } from 'react-router-dom';
import { AppSidebar, MobileNav } from './AppSidebar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="lg:ml-[220px] min-h-screen pb-20 lg:pb-0">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
