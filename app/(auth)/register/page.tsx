"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { register, RegisterActionState } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("Email already registered");
    } else if (state.status === "failed") {
      toast.error(state.errors?.[0]?.message || "Failed to create account");
    } else if (state.status === "invalid_data") {
      state.errors?.forEach(error => {
        toast.error(error.message);
      });
    } else if (state.status === "success") {
      toast.success("Account created successfully");
      router.push("/login");
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setFormData({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    });
    formAction(formData);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
      {/* Brand section */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-8">
        <div className="max-w-md text-white">
          <Image 
            src="/images/sanicle_logo_white.svg" 
            alt="Sanicle Logo" 
            width={180} 
            height={60}
            className="mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">Join FemTech Health Platform</h1>
          <p className="text-lg opacity-90 mb-6">
            Create your account and start enjoying our tailored health management services for professional women.
          </p>
          <div className="bg-white/10 p-6 rounded-lg mt-8">
            <h3 className="font-medium text-xl mb-4">Why Choose Us?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Health management solutions designed for professional women</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>AI-powered health assistant providing personalized advice</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Data security guarantee to protect your privacy</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>HR system integration for better work-health balance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Registration form */}
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
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join FemTech to manage your health and work balance
            </p>
          </div>

          <AuthForm action={handleSubmit} defaultValues={formData} variant="register">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="Enter first name"
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Enter last name"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Set password (min 8 characters)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Checkbox id="agreedToTerms" name="agreedToTerms" required />
                <Label htmlFor="agreedToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service and Privacy Policy
                  </Link>
                </Label>
              </div>

              <SubmitButton 
                className="w-full py-2.5 mt-2"
                loading={state.status === "in_progress"}
              >
                Create Account
              </SubmitButton>

              <p className="text-center text-sm text-muted-foreground mt-6 mb-4">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </AuthForm>
        </div>
      </div>
    </div>
  );
}
