"use client";

import { BrandSection } from './components/BrandSection';
import { RegisterForm } from './components/RegisterForm';

/**
 * Register page component
 * Combines brand section and register form
 */
export default function RegisterPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
      {/* Brand section with benefits */}
      <BrandSection />
      
      {/* Register form section */}
      <RegisterForm />
    </div>
  );
}
