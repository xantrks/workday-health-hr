'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { LoginActionState } from '../types';

/**
 * Custom hook to handle login state changes and navigation
 */
export function useLoginEffect(state: LoginActionState) {
  const router = useRouter();

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid email or password");
    } else if (state.status === "invalid_data") {
      toast.error("Please check your input");
    } else if (state.status === "success" && state.userId) {
      toast.success("Login successful");
      
      // Only log, no longer perform redirection to avoid conflict with LoginForm
      console.log("Login successful, role:", state.role, "User ID:", state.userId);
    }
  }, [state.status, state.userId, state.role]);
} 