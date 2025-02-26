"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
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
      toast.error("Account already exists");
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
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-8 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-2xl font-semibold dark:text-zinc-50">Create Account</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Join FemTech to manage your health and wellness
          </p>
        </div>

        <AuthForm action={handleSubmit} defaultValues={formData}>
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="firstName">First Name</Label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-2 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="lastName">Last Name</Label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-2 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>

            <div className="flex-1">
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="password">Password</Label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="agreedToTerms" name="agreedToTerms" required />
              <Label htmlFor="agreedToTerms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms and Conditions
                </Link>
              </Label>
            </div>

            <SubmitButton>Create Account</SubmitButton>

            <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </AuthForm>
      </div>
    </div>
  );
}
