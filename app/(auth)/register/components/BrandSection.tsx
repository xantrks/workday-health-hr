'use client';

import Image from "next/image";

import { BenefitItem } from './BenefitItem';

/**
 * Brand section component for the register page
 * Displays the company logo, headline, description, and benefits list
 */
export function BrandSection() {
  const benefits = [
    "Health management solutions designed for professional women",
    "AI-powered health assistant providing personalized advice",
    "Data security guarantee to protect your privacy",
    "HR system integration for better work-health balance"
  ];

  return (
    <div 
      className="hidden lg:flex w-1/2 relative items-center justify-center p-8 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/a-black-woman-scheduling-a-hospital-check.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="max-w-md text-white relative z-10">
        <Image 
          src="/images/sanicle_logo_white.svg" 
          alt="Sanicle Logo" 
          width={180} 
          height={60}
          className="mb-8"
        />
        <h1 className="text-3xl font-bold mb-4">Join FemTech Health Platform</h1>
        <p className="text-lg opacity-90 mb-6">
          Create your account and start enjoying our tailored health management services for professional women.
        </p>
        <div className="bg-white/10 p-6 rounded-lg mt-8">
          <h3 className="font-medium text-xl mb-4">Why Choose Us?</h3>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <BenefitItem key={index} text={benefit} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 