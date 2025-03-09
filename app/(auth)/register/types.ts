/**
 * Register action state interface
 */
export interface RegisterActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "user_exists" | "invalid_data";
  errors?: Array<{ message: string }>;
}

/**
 * Register form data interface
 */
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Benefit item props interface for the brand section
 */
export interface BenefitItemProps {
  text: string;
} 