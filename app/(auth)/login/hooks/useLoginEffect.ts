'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { LoginActionState } from '../types';

/**
 * Custom hook for handling login state changes and navigation
 */
export function useLoginEffect(state: LoginActionState) {
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
} 