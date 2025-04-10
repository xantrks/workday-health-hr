'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { register } from "../../actions";
import { RegisterActionState, RegisterFormData } from '../types';

/**
 * Register form component
 * Handles user registration with form submission and state management
 */
export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [formState, setFormState] = useState<RegisterActionState>({
    status: "idle"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Monitor form state changes
  useEffect(() => {
    if (formState.status === "user_exists") {
      toast.error("Email already registered");
      setIsSubmitting(false);
    } else if (formState.status === "failed") {
      toast.error(formState.errors?.[0]?.message || "Failed to create account");
      setIsSubmitting(false);
    } else if (formState.status === "invalid_data") {
      formState.errors?.forEach(error => {
        toast.error(error.message);
      });
      setIsSubmitting(false);
    } else if (formState.status === "success") {
      toast.success("Account created successfully");
      router.push("/login");
    }
  }, [formState, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    setFormData({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      organizationName: formData.get("organizationName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    });
    
    try {
      const result = await register(formState, formData);
      setFormState(result);
    } catch (error) {
      console.error("Registration error:", error);
      setFormState({
        status: "failed",
        errors: [{ message: "An unexpected error occurred" }]
      });
      setIsSubmitting(false);
    }
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

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">New Organization Setup</CardTitle>
            <CardDescription>
              You will create a new organization and be set as its administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              As an administrator, you&apos;ll be able to:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
              <li>Invite team members</li>
              <li>Manage organization settings</li>
              <li>Configure health benefits</li>
            </ul>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 text-primary"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              className="hidden"
              id="profileImage"
            />
            <Label
              htmlFor="profileImage"
              className="text-sm text-primary cursor-pointer hover:underline"
            >
              Upload Profile Image
            </Label>
          </div>

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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="organizationName" className="text-sm font-medium">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                type="text"
                required
                placeholder="Enter your organization name"
                className="mt-1"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be the name of your company or organization.
              </p>
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
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You&apos;ll use this email to log in and receive notifications.
              </p>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Checkbox id="agreedToTerms" name="agreedToTerms" required disabled={isSubmitting} />
              <Label htmlFor="agreedToTerms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service and Privacy Policy
                </Link>
              </Label>
            </div>

            <SubmitButton 
              className="w-full py-2.5 mt-2"
              loading={formState.status === "in_progress" || isSubmitting}
            >
              Create Account & Organization
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
        </form>
      </div>
    </div>
  );
} 