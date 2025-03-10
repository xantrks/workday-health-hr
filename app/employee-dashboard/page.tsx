'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function EmployeeDashboardIndex() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure execution only on the client
  useEffect(() => {
    setIsClient(true);
    
    // Adding console output to track page loading
    console.log("Employee Dashboard page loaded");
    console.log("Session status:", status);
    console.log("User:", session?.user);
    
    if (status === 'authenticated' && session?.user?.id) {
      console.log("Authenticated user, attempting to redirect to user-specific dashboard");
      // Add delayed redirect
      setTimeout(() => {
        router.push(`/employee-dashboard/${session.user.id}`);
      }, 2000);
    }
  }, [router, session, status]);

  // 返回简单UI，确保页面可渲染
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
      
      {!isClient ? (
        <p>Loading...</p>
      ) : status === 'loading' ? (
        <div className="flex flex-col items-center">
          <p className="mb-4">Loading your information...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : status === 'authenticated' ? (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">You are logged in</h2>
          <p className="mb-2">Welcome, {session.user?.name || 'User'}!</p>
          <p className="mb-4">Please wait, redirecting to your personal dashboard...</p>
          
          <div className="mt-6">
            <p>If you are not automatically redirected, please click the link below:</p>
            <Link 
              href={`/employee-dashboard/${session.user?.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Go to my dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">You are not logged in</h2>
          <p>Please log in to access your dashboard</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 inline-block"
          >
            Log in
          </Link>
        </div>
      )}
    </div>
  );
} 