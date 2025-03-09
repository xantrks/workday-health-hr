"use client";

import { BrandSection } from './components/BrandSection';
import { LoginForm } from './components/LoginForm';

/**
 * Login page component
 * Combines brand section and login form
 */
export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
      {/* Brand section with features */}
      <BrandSection />
      
      {/* Login form section */}
      <LoginForm />
    </div>
  );
}
