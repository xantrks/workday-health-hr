'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { register } from "../../actions";
import { RegisterActionState, RegisterFormData } from '../types';
import { useRegisterEffect } from '../hooks/useRegisterEffect';

/**
 * Register form component
 * Handles user registration with form submission and state management
 */
export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
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

  // Use custom hook for handling register effects
  useRegisterEffect(state);

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
  );
} 