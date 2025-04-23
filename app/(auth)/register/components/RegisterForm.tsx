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
 * Enhanced for mobile responsiveness
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
    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">       
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Create an Account
          </h2>
          <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">
            Register your organization and start managing women&apos;s health
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <Card>
            <CardHeader className="py-2 sm:py-3 px-4 sm:px-6">
              <CardTitle className="text-lg">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <CardHeader className="py-2 sm:py-3 px-4 sm:px-6">
              <CardTitle className="text-lg">Organization Details</CardTitle>
              <CardDescription>
                You will be registered as the Organization Administrator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="isNewOrganization" 
                  name="isNewOrganization" 
                  defaultChecked 
                  disabled={isSubmitting}
                />
                <Label htmlFor="isNewOrganization" className="text-sm font-normal">
                  I am creating a new organization
                </Label>
              </div>

              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  placeholder="Your organization's name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
                <Select name="subscriptionPlan" defaultValue="basic" disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (Free)</SelectItem>
                    <SelectItem value="standard">Standard ($29/month)</SelectItem>
                    <SelectItem value="premium">Premium ($49/month)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (Custom pricing)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  You can change your plan anytime after registration
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="termsAndConditions" 
                name="termsAndConditions" 
                required
                disabled={isSubmitting}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="termsAndConditions" 
                  className="text-sm font-normal"
                >
                  I agree to the 
                  <Link 
                    href="/terms" 
                    className="underline text-primary ml-1"
                    target="_blank"
                  >
                    terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link 
                    href="/privacy" 
                    className="underline text-primary"
                    target="_blank"
                  >
                    privacy policy
                  </Link>
                </Label>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="marketing" 
                name="marketing"
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="marketing" 
                className="text-sm font-normal"
              >
                I agree to receive marketing communications
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <SubmitButton 
            className="w-full" 
            loading={isSubmitting}
          >
            Create Account
          </SubmitButton>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-primary underline hover:text-primary/90 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 