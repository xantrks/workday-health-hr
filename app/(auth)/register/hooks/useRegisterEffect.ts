'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { RegisterActionState } from '../types';

/**
 * Custom hook for handling register state changes and navigation
 */
export function useRegisterEffect(state: RegisterActionState) {
  const router = useRouter();
  
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
  
  return router;
} 