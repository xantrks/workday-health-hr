'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
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
  
  const [state, formAction] = useFormState<LoginActionState, FormData>(login, {
    status: "idle"
  });
  
  // Monitor state changes
  useEffect(() => {
    if (state.status === 'success' && state.userId) {
      console.log('Login successful:', state);
      setLoginSuccess(true);
      setUserId(state.userId);
      toast.success("Login successful!");
      
      // Try automatic redirection (but keep backup UI in case of failure)
      const timer = setTimeout(() => {
        try {
          // Get the target dashboard path based on user role
          const dashboardPath = state.role === 'hr' ? 
            `/hr-dashboard/${state.userId}` : 
            `/employee-dashboard/${state.userId}`;
            
          // Navigate to appropriate dashboard based on role
          window.location.href = dashboardPath;
        } catch (error) {
          console.error("Automatic redirection failed, waiting for user manual selection:", error);
          // No action on failure, user will see manual choice buttons
        }
      }, 800); // Give toast enough time to display
      
      // Clean up timer
      return () => clearTimeout(timer);
    } else if (state.status === 'failed') {
      toast.error("Invalid email or password");
      setIsSubmitting(false);
    } else if (state.status === 'invalid_data') {
      toast.error("Please check your input");
      setIsSubmitting(false);
    }
  }, [state]);
  
  // Create a wrapper form action processing function
  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true);
    formAction(formData);
  };
  
  // Modify navigation target address - directly navigate to user-specific dashboard
  const handleDirectNavigation = () => {
    try {
      // Get the target dashboard path based on user role
      const dashboardPath = state.role === 'hr' ? 
        `/hr-dashboard/${userId}` : 
        `/employee-dashboard/${userId}`;
        
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
      
      // Set action based on user role
      form.action = state.role === 'hr' ? 
        `/hr-dashboard/${userId}` : 
        `/employee-dashboard/${userId}`;
        
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
              Go directly to my dashboard
            </button>
            
            <form action={state.role === 'hr' ? `/hr-dashboard/${userId}` : `/employee-dashboard/${userId}`} method="GET" target="_top">
              <button 
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Go through form
              </button>
            </form>
            
            <a 
              href={state.role === 'hr' ? `/hr-dashboard/${userId}` : `/employee-dashboard/${userId}`}
              className="block w-full bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 transition-colors text-center"
            >
              Use direct link
            </a>
          </div>
          
          {/* Use iframe to preload static page */}
          <iframe 
            ref={iframeRef}
            src={state.role === 'hr' ? "/hr-dashboard/static" : "/employee-dashboard/static"}
            style={{ display: 'none' }}
            title="Preload Page"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="lg:hidden flex justify-center mb-8">
          <Image 
            src="/images/sanicle_logo.svg" 
            alt="Sanicle Logo" 
            width={150} 
            height={50}
          />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please log in to your account
          </p>
        </div>

        <AuthForm action={handleSubmit} variant="login">
          <div className="space-y-5">
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
              className="w-full py-2.5"
              loading={state.status === "in_progress" || isSubmitting}
            >
              Login
            </SubmitButton>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mb-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </AuthForm>
      </div>
    </div>
  );
} 