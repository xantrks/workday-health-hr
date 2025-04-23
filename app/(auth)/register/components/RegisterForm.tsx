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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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
    subscriptionPlan: "basic",
    isNewOrganization: true,
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
    } else if (formState.status === "error" || formState.status === "failed_organization_creation" || 
              formState.status === "failed_user_creation" || formState.status === "failed_role_assignment") {
      toast.error(formState.message || "Failed to create account");
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
      subscriptionPlan: formData.get("subscriptionPlan") as string || "basic",
      isNewOrganization: formData.get("isNewOrganization") === "on",
    });
    
    try {
      const result = await register(null, formData);
      setFormState(result);
    } catch (error) {
      console.error("Registration error:", error);
      setFormState({
        status: "error",
        message: "An unexpected error occurred"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-md">       
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Register your organization and start managing women&apos;s health
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    autoComplete="given-name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    autoComplete="family-name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Organization Details</CardTitle>
              <CardDescription>
                You will be registered as the Organization Administrator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="isNewOrganization" 
                  name="isNewOrganization" 
                  defaultChecked 
                  disabled={isSubmitting}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="isNewOrganization" className="text-sm font-medium">
                    Register a new organization
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Uncheck if you want to join an existing organization (requires admin approval)
                  </p>
                </div>
              </div>
              <Separator className="my-1" />
              
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  placeholder="Company or Organization Name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
                <Select name="subscriptionPlan" defaultValue="basic" disabled={isSubmitting}>
                  <SelectTrigger id="subscriptionPlan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  You can upgrade or change your plan anytime
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Agreement */}
          <div className="flex items-center space-x-2">
            <Checkbox id="agreedToTerms" name="agreedToTerms" required disabled={isSubmitting} />
            <Label htmlFor="agreedToTerms" className="text-sm font-medium leading-none">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Submit button */}
          <SubmitButton loading={isSubmitting} className="w-full">
            Create Account
          </SubmitButton>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 