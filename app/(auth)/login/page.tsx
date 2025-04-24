"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { BrandSection } from './components/BrandSection';
import { LoginForm } from './components/LoginForm';

/**
 * Login page component
 * Combines brand section and login form
 * Now with immediate session check
 */
export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Immediate redirection if user is already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log('User already logged in, redirecting to dashboard');
      
      // Get user info
      const user = session.user;
      const userId = user.id;
      const role = (user.role || '').toLowerCase();
      
      // Determine dashboard path based on role
      let dashboardPath = '/dashboard';
      
      if (user.isSuperAdmin) {
        dashboardPath = `/super-admin/${userId}`;
      } else if (role === 'superadmin') {
        dashboardPath = `/super-admin/${userId}`;
      } else if (role === 'orgadmin' || role === 'admin') {
        dashboardPath = `/admin-dashboard/${userId}`;
      } else if (role === 'hr') {
        dashboardPath = `/hr-dashboard/${userId}`;
      } else if (role === 'manager') {
        dashboardPath = `/manager-dashboard/${userId}`;
      } else {
        dashboardPath = `/employee-dashboard/${userId}`;
      }
      
      console.log('Redirecting to', dashboardPath);
      router.replace(dashboardPath);
    }
  }, [session, status, router]);
  
  // Only show login form if not authenticated
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
      {/* Brand section with features */}
      <BrandSection />
      
      {/* Login form section */}
      <LoginForm />
    </div>
  );
}
