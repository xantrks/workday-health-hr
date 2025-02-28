"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from 'react-dom';
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "../actions";

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
  role?: string;
  userId?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, {
    status: "idle"
  });

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid email or password");
    } else if (state.status === "invalid_data") {
      toast.error("Please check your input");
    } else if (state.status === "success" && state.userId) {
      toast.success("Login successful");
      const basePath = window.location.origin;
      const dashboardPath = state.role === "hr" ? 
        `/hr-dashboard/${state.userId}` : 
        `/employee-dashboard/${state.userId}`;
      window.location.href = `${basePath}${dashboardPath}`;
    }
  }, [state.status, state.role, state.userId]);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
      {/* Brand section */}
      <div 
        className="hidden lg:flex w-1/2 relative items-center justify-center p-8 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/a-diverse-group-of-women.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="max-w-md text-white relative z-10">
          <Image 
            src="/images/sanicle_logo_white.svg" 
            alt="Sanicle Logo" 
            width={180} 
            height={60}
            className="mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">Welcome to FemTech Health Platform</h1>
          <p className="text-lg opacity-90 mb-6">
            We are dedicated to providing comprehensive health management solutions for professional women, helping you better balance work and health.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Period Tracking</h3>
              <p className="text-sm opacity-80">Smart cycle prediction to help you better plan work and life</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Health Consultation</h3>
              <p className="text-sm opacity-80">Chat with AI health assistant anytime for professional advice</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Medical Appointments</h3>
              <p className="text-sm opacity-80">Convenient medical service booking system to save your time</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Data Analysis</h3>
              <p className="text-sm opacity-80">Personalized health data analysis to help you monitor your health</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login form */}
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
              Please sign in to your account
            </p>
          </div>

          <AuthForm action={formAction} variant="login">
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
                />
              </div>

              <SubmitButton
                className="w-full py-2.5"
                loading={state.status === "in_progress"}
              >
                Sign In
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
                  Sign Up
                </Link>
              </p>
            </div>
          </AuthForm>
        </div>
      </div>
    </div>
  );
}
