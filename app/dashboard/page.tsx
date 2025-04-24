'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    // Confirm code is running on client
    setIsClient(true);
    console.log('Dashboard page mounted, session status:', status);
    
    // Add enhanced debug information
    if (status === 'authenticated' && session?.user) {
      console.log('User info:', {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role
      });
      
      // Auto-attempt navigation after a delay
      const timer = setTimeout(() => {
        handleDirectNavigation();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [status, session]);

  // Function to determine dashboard path based on role
  const getDashboardPath = () => {
    if (!session?.user?.id) return null;
    
    const role = session.user.role?.toLowerCase();
    const userId = session.user.id;
    
    if (role === 'superadmin') {
      return `/super-admin/${userId}`;
    } else if (role === 'admin' || role === 'orgadmin') {
      return `/admin-dashboard/${userId}`;
    } else if (role === 'hr') {
      return `/hr-dashboard/${userId}`;
    } else if (role === 'manager') {
      return `/manager-dashboard/${userId}`;
    } else {
      return `/employee-dashboard/${userId}`;
    }
  };
  
  // Handle direct navigation to user dashboard
  const handleDirectNavigation = () => {
    if (!session?.user?.id) return;
    
    setIsRedirecting(true);
    
    try {
      // Get appropriate dashboard path based on role
      const dashboardPath = getDashboardPath();
      console.log('Attempting navigation to:', dashboardPath);
      
      if (dashboardPath) {
        // Try multiple navigation methods for increased reliability
        
        // Method 1: Direct window location navigation
        window.location.href = dashboardPath;
        
        // If the above doesn't work immediately, the following code won't execute
        // because the page will have navigated away
      } else {
        console.error("Could not determine dashboard path");
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error("Navigation failed, trying alternative method:", error);
      
      // Method 2: Form submission (more compatible)
      try {
        const role = session.user.role?.toLowerCase();
        const userId = session.user.id;
        let fallbackPath = '/employee-dashboard/static'; // Default fallback
        
        // Determine a direct path based on role
        if (role === 'hr') {
          fallbackPath = `/hr-dashboard/${userId}`;
        } else if (role === 'manager') {
          fallbackPath = `/manager-dashboard/${userId}`;
        } else if (role === 'admin' || role === 'orgadmin') {
          fallbackPath = `/admin-dashboard/${userId}`;
        } else if (role === 'superadmin') {
          fallbackPath = `/super-admin/${userId}`;
        } else {
          fallbackPath = `/employee-dashboard/${userId}`;
        }
        
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = fallbackPath;
        document.body.appendChild(form);
        form.submit();
      } catch (fallbackError) {
        console.error("All navigation methods failed:", fallbackError);
        setIsRedirecting(false);
      }
    }
  };
  
  // Only render content on client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const dashboardPath = getDashboardPath();
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {status === 'loading' ? (
        <div className="flex flex-col items-center p-8">
          <p className="mb-4">Loading your information...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : status === 'authenticated' ? (
        <div className="bg-white shadow-md rounded p-6">
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800">Welcome back, {session?.user?.name || 'User'}!</h2>
            <p className="text-blue-700 mt-2">You can use any of these options to access your personal dashboard.</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <button 
              onClick={handleDirectNavigation}
              disabled={isRedirecting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded text-center hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isRedirecting ? 'Redirecting...' : 'Go to my personal dashboard'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={dashboardPath || '#'}
              className="bg-green-600 text-white px-4 py-3 rounded text-center hover:bg-green-700 transition-colors"
              target="_self"
            >
              Direct link access
            </a>
            
            <form action={dashboardPath || '#'} method="GET">
              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 transition-colors"
              >
                Form-based navigation
              </button>
            </form>
            
            <a 
              href="/employee-dashboard/static"
              className="bg-yellow-600 text-white px-4 py-3 rounded text-center hover:bg-yellow-700 transition-colors col-span-full"
            >
              Go to static fallback dashboard
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">You are not logged in</h2>
          <p>Please log in to access your dashboard</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 inline-block hover:bg-blue-700 transition-colors"
          >
            Go to login
          </Link>
        </div>
      )}
    </div>
  );
} 