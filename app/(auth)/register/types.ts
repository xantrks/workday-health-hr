/**
 * Register action state interface
 */
export interface RegisterActionState {
  status: "idle" | "success" | "user_exists" | "invalid_data" | "failed_organization_creation" | "failed_user_creation" | "failed_role_assignment" | "error";
  errors?: Array<{ message: string }>;
  message?: string;
}

/**
 * Register form data interface
 */
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
  subscriptionPlan: string;
  isNewOrganization: boolean;
}

/**
 * Benefit item props interface for the brand section
 */
export interface BenefitItemProps {
  text: string;
} 