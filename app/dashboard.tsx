'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const role = (session.user.role || '').toLowerCase();
      console.log("Dashboard page - User logged in:", session.user.id, "Role:", role);
      
      const dashboardPath = role === 'hr' ? 
        `/hr-dashboard/${session.user.id}` : 
        `/employee-dashboard/${session.user.id}`;
        
      console.log("Redirecting to:", dashboardPath);
      
      // Use window.location.replace directly instead of Router
      window.location.replace(dashboardPath);
    } else if (status === 'unauthenticated') {
      console.log("Dashboard page - User not logged in");
      window.location.replace('/login');
    }
  }, [session, status]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading your dashboard...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
} 