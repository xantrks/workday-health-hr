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

import { login } from "../../actions";
import { LoginActionState } from '../types';

/**
 * Login form component
 * Handles user login via email and password
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
      
      // Try automatic redirection (but keep backup UI in case of failure)
      const timer = setTimeout(() => {
        try {
          // Get the target dashboard path based on user role
          const dashboardPath = getDashboardPath(formState.role, formState.userId);
          // Navigate to appropriate dashboard
          window.location.href = dashboardPath;
        } catch (error) {
          console.error("Automatic redirection failed, waiting for user manual selection:", error);
          // No action on failure, user will see manual choice buttons
        }
      }, 800); // Give toast enough time to display
      
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
    
    try {
      const result = await login(null, formData);
      setFormState(result);
    } catch (error) {
      console.error("Login error:", error);
      setFormState({
        status: "failed"
      });
      setIsSubmitting(false);
    }
  };
  
  // Handle direct navigation to dashboard
  const handleDirectNavigation = () => {
    try {
      // Get the target dashboard path based on user role
      const dashboardPath = getDashboardPath(formState.role, userId);
        
      if (window.top) {
        // Directly navigate to user-specific dashboard
        window.top.location.href = dashboardPath;
      } else {
        window.location.href = dashboardPath;
      }
    } catch (error) {
      console.error("Navigation failed:", error);
      
      // Backup method: Create form and submit directly
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = getDashboardPath(formState.role, userId);
      form.target = '_top';
      document.body.appendChild(form);
      form.submit();
    }
  };

  // If login is successful, display navigation interface
  if (loginSuccess && userId) {
    return (
      <div className="w-full flex items-center justify-center p-6 md:p-8">
        <div className="text-center max-w-md bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Login Successful</h2>
          <p className="mb-8 text-gray-600">Please select a way to go to your dashboard</p>
          
          <div className="space-y-4">
            <button 
              onClick={handleDirectNavigation}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to my dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please log in to your account
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Multi-Tenant Platform</CardTitle>
            <CardDescription>
              Access your organization&apos;s dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
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

          <div className="text-center space-y-4">
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