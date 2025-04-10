'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Redirect based on user role
      if (session.user.isSuperAdmin) {
        router.push(`/super-admin/${session.user.id}`);
      } else if (session.user.role === 'orgadmin') {
        router.push(`/admin-dashboard/${session.user.id}`);
      } else if (session.user.role === 'manager') {
        router.push(`/manager-dashboard/${session.user.id}`);
      } else if (session.user.role === 'hr') {
        router.push(`/hr-dashboard/${session.user.id}`);
      } else {
        // Default to employee dashboard
        router.push(`/employee-dashboard/${session.user.id}`);
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
} 