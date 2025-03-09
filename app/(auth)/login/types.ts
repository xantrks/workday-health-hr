/**
 * Login action state interface
 */
export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
  role?: string;
  userId?: string;
}

/**
 * Feature card props interface
 */
export interface FeatureCardProps {
  title: string;
  description: string;
} 