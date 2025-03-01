"use client";

import { useFormStatus } from "react-dom";

import { LoaderIcon } from "@/components/custom/icons";

import { Button } from "../ui/button";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function SubmitButton({ children, className = "", loading = false }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className={`flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {loading && (
        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit Form"}
      </span>
    </Button>
  );
}
