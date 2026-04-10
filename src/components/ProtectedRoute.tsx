import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DemoProvider } from '@/hooks/useDemoMode';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // If not logged in, show demo data instead of redirecting to login
  if (!user) {
    return <DemoProvider>{children}</DemoProvider>;
  }

  return <>{children}</>;
}
