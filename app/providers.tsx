"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

// Component that checks for pending logins and redirects if needed
const LoginRedirectCheck = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Only run this check once on initial load
    try {
      const hasLoginSuccess = localStorage.getItem('loginSuccess') === 'true';
      
      if (hasLoginSuccess && session?.user && (pathname === '/login' || pathname === '/')) {
        // Get stored login info
        const userId = localStorage.getItem('loginUserId');
        const role = localStorage.getItem('loginRole');
        const timestamp = localStorage.getItem('loginTimestamp');
        const now = new Date().getTime();
        const ts = timestamp ? parseInt(timestamp) : 0;
        
        // Only redirect if login is recent (within last hour)
        if (userId && (now - ts) < 60 * 60 * 1000) {
          console.log("Found recent login success, redirecting to dashboard");
          
          // Clear login success flag to prevent future redirects
          localStorage.removeItem('loginSuccess');
          
          // Choose appropriate dashboard
          let dashboardPath = '/dashboard';
          
          const normalizedRole = (role || '').toLowerCase().trim();
          
          if (normalizedRole === 'superadmin') {
            dashboardPath = `/super-admin/${userId}`;
          } else if (normalizedRole === 'orgadmin' || normalizedRole === 'admin') {
            dashboardPath = `/admin-dashboard/${userId}`;
          } else if (normalizedRole === 'hr') {
            dashboardPath = `/hr-dashboard/${userId}`;
          } else if (normalizedRole === 'manager') {
            dashboardPath = `/manager-dashboard/${userId}`;
          } else {
            dashboardPath = `/employee-dashboard/${userId}`;
          }
          
          // Redirect to dashboard
          window.location.href = `${dashboardPath}?t=${now}`;
        }
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  }, [session, pathname, router]);
  
  return null;
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LoginRedirectCheck />
        {children}
      </NextThemesProvider>
    </SessionProvider>
  );
} 