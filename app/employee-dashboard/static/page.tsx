'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function StaticEmployeeDashboard() {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Set client flag when page loads
  useEffect(() => {
    setIsClient(true);
    console.log("Static dashboard page loaded successfully");
    
    // If session exists, try to redirect to the dynamic dashboard after a delay
    if (session?.user?.id) {
      console.log("User authenticated in static dashboard:", session.user);
      
      const timer = setTimeout(() => {
        tryRedirectToDynamicDashboard();
      }, 1500); // Longer delay to ensure auth state propagation
      
      return () => clearTimeout(timer);
    }
  }, [session]);
  
  // Function to try redirecting to dynamic dashboard
  const tryRedirectToDynamicDashboard = () => {
    if (!session?.user?.id) return;
    
    setIsRedirecting(true);
    const userId = session.user.id;
    
    try {
      // Direct navigation to the appropriate dynamic dashboard
      window.location.href = `/employee-dashboard/${userId}`;
    } catch (error) {
      console.error("Failed to redirect to dynamic dashboard:", error);
      setIsRedirecting(false);
    }
  };
  
  // Only render content on client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Employee Dashboard (Static Version)</h1>
        
        {session ? (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <h2 className="text-xl font-semibold text-green-800">Login Successful!</h2>
              <p className="text-green-700 mt-2">
                Welcome back, {session.user?.name || 'User'}!
              </p>
              {isRedirecting && (
                <p className="text-blue-700 mt-2">
                  Attempting to redirect you to your personal dashboard...
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Health Data</h3>
                <p>Your health data summary will be displayed here</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Cycle Tracking</h3>
                <p>Your cycle tracking information will be displayed here</p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Upcoming Appointments</h3>
                <p>You have no upcoming appointments</p>
              </div>
              
              <div className="bg-pink-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Health Tips</h3>
                <p>Staying hydrated is an important part of maintaining health</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {session?.user?.id && (
                  <Link
                    href={`/employee-dashboard/${session.user.id}`}
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Go to My Personal Dashboard
                  </Link>
                )}
                
                <Link
                  href="/dashboard"
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Back to Main Dashboard
                </Link>
                
                <button 
                  onClick={() => window.history.back()}
                  className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Return to Previous Page
                </button>
              </div>
              
              {session?.user?.id && (
                <form 
                  action={`/employee-dashboard/${session.user.id}`} 
                  method="GET"
                  className="mt-4"
                >
                  <button 
                    type="submit"
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Form-based Navigation to Dashboard
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg mb-4">You are not logged in or your session has expired</p>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 