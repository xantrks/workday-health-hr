'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function RedirectPage() {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user) {
      const userId = session.user.id;
      const role = (session.user.role || '').toLowerCase();
      
      console.log("Redirect page - User info:", userId, role);
      
      // Build target URL
      const dashboardPath = role === 'hr' ? 
        `/hr-dashboard/${userId}` : 
        `/employee-dashboard/${userId}`;
      
      const fullUrl = window.location.origin + dashboardPath;
      console.log("Redirecting to:", fullUrl);
      
      // Use native method for redirection
      window.location.replace(fullUrl);
    }
  }, [session]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting you...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
} 