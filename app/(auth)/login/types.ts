/**
 * Login action state interface
 */
export interface LoginActionState {
  status: "idle" | "success" | "failed" | "invalid_data";
  role?: string | null;
  userId?: string | null;
}

/**
 * Feature card props interface
 */
export interface FeatureCardProps {
  title: string;
  description: string;
} 