'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { SubmitButton } from "@/components/custom/submit-button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import { LoginActionState } from '../types';

/**
 * Login form component
 * Handles user login via email and password
 * Enhanced for mobile responsiveness
 */
export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [formState, setFormState] = useState<LoginActionState>({
    status: "idle"
  });
  
  // Monitor state changes
  useEffect(() => {
    if (formState.status === 'success' && formState.userId) {
      console.log('Login successful:', formState);
      setLoginSuccess(true);
      setUserId(formState.userId);
      toast.success("Login successful!");
      
      // Try multiple automatic redirection approaches with a delay
      // The delay gives auth state time to propagate
      const timer = setTimeout(() => {
        try {
          // Get the target dashboard path based on user role
          const dashboardPath = getDashboardPath(formState.role, formState.userId);
          console.log('Attempting redirect to:', dashboardPath);
          
          // Try multiple navigation methods to increase chances of success
          if (typeof window !== 'undefined') {
            // Method 1: Direct location change
            window.top ? window.top.location.href = dashboardPath : window.location.href = dashboardPath;
            
            // Method 2: Form-based navigation (more compatible) as fallback
            try {
              const form = document.createElement('form');
              form.method = 'GET';
              form.action = dashboardPath;
              form.target = '_top';
              document.body.appendChild(form);
              setTimeout(() => form.submit(), 200);
            } catch (formError) {
              console.error("Form navigation fallback failed:", formError);
            }
          }
        } catch (error) {
          console.error("Automatic redirection failed:", error);
          // No action needed on failure - user will see manual navigation UI
        }
      }, 800); // Give time for auth state to propagate
      
      // Clean up timer
      return () => clearTimeout(timer);
    } else if (formState.status === 'failed') {
      toast.error("Invalid email or password");
      setIsSubmitting(false);
    } else if (formState.status === 'invalid_data') {
      toast.error("Please check your input");
      setIsSubmitting(false);
    }
  }, [formState]);
  
  // Function to determine dashboard path based on role
  const getDashboardPath = (role?: string | null, id?: string | null) => {
    if (!role || !id) return "/dashboard";
    
    const normalizedRole = role.toLowerCase();
    
    if (normalizedRole === 'superadmin') {
      return `/super-admin/${id}`;
    } else if (normalizedRole === 'orgadmin') {
      return `/admin-dashboard/${id}`;
    } else if (normalizedRole === 'hr') {
      return `/hr-dashboard/${id}`;
    } else if (normalizedRole === 'manager') {
      return `/manager-dashboard/${id}`;
    } else {
      return `/employee-dashboard/${id}`;
    }
  };
  
  // Create a wrapper form action processing function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (username === 'user1' && password === '12345') {
      setFormState({ status: 'success', userId: '1', role: 'employee' });
    } else {
      setFormState({ status: 'failed' });
    }
  };
  
  // Handle direct navigation to dashboard
  const handleDirectNavigation = () => {
    try {
      // Get the target dashboard path based on user role
      const dashboardPath = getDashboardPath(formState.role, userId);
      console.log('Manual navigation to:', dashboardPath);
      
      // Try multiple approaches to increase chances of successful navigation
      if (window.top) {
        // Approach 1: Top window navigation (handles iframe scenarios)
        window.top.location.href = dashboardPath;
      } else {
        // Approach 2: Standard window navigation
        window.location.href = dashboardPath;
      }
    } catch (error) {
      console.error("Navigation failed, trying backup method:", error);
      
      // Approach 3: Form-based navigation (most compatible)
      try {
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = getDashboardPath(formState.role, userId);
        form.target = '_top';
        document.body.appendChild(form);
        form.submit();
      } catch (backupError) {
        console.error("Form-based navigation failed:", backupError);
        
        // Approach 4: Static page fallback
        try {
          window.location.href = '/employee-dashboard/static';
        } catch (finalError) {
          console.error("All navigation methods failed:", finalError);
          // Display an error to the user
          toast.error("Navigation failed. Please use one of the other options.");
        }
      }
    }
  };

  // If login is successful, display navigation interface with multiple options
  if (loginSuccess && userId) {
    return (
      <div className="w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-center w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Login Successful</h2>
          <p className="mb-4 text-gray-600">You will be redirected to your dashboard shortly...</p>
          <p className="mb-6 sm:mb-8 text-gray-600">If you are not redirected automatically, please use one of the options below.</p>
          
          <div className="space-y-4">
            <button 
              onClick={handleDirectNavigation}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to my dashboard
            </button>
            
            <a 
              href={getDashboardPath(formState.role, userId)}
              className="block w-full bg-green-600 text-white px-4 py-3 rounded-md text-center hover:bg-green-700 transition-colors"
            >
              Direct link to dashboard
            </a>

            <form 
              action={getDashboardPath(formState.role, userId)} 
              method="GET"
              className="block"
            >
              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-md text-center hover:bg-purple-700 transition-colors"
              >
                Form-based navigation
              </button>
            </form>
            
            <a 
              href="/employee-dashboard/static"
              className="block w-full bg-yellow-600 text-white px-4 py-3 rounded-md text-center hover:bg-yellow-700 transition-colors"
            >
              Static fallback dashboard
            </a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href="/dashboard"
              className="text-blue-600 hover:underline"
            >
              Go to main dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">
            Please log in to your account
          </p>
        </div>

        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-lg">Multi-Tenant Platform</CardTitle>
            <CardDescription>
              Access your organization&apos;s dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <p className="text-sm text-muted-foreground">
              Your login provides access to features based on your role:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
              <li>Organization Admin: Manage users and organization settings</li>
              <li>HR: Configure benefits and handle employee requests</li>
              <li>Employee: Track health and access resources</li>
            </ul>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <Label htmlFor="username" className="text-sm font-medium">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Enter your username"
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <div className="flex items-center justify-between flex-wrap gap-1">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary underline hover:text-primary/80 transition-colors px-1 py-0.5 rounded"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          <SubmitButton 
            className="w-full"
            loading={isSubmitting}
          >
            Log In
          </SubmitButton>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              For testing, use username: <b>user1</b> and password: <b>12345</b>
            </p>
          </div>

          <div className="text-center space-y-3 sm:space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?
            </p>
            <Link
              href="/register"
              className="block w-full py-2.5 border border-primary text-primary hover:bg-primary/10 rounded-md text-center text-sm font-medium transition-colors"
            >
              Register New Organization
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 