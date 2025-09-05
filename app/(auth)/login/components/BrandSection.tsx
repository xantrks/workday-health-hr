'use client';

import Image from "next/image";

import { FeatureCard } from './FeatureCard';

/**
 * Brand section component for the login page
 * Displays the company logo, headline, description, and feature cards
 * Now responsive with mobile-specific design
 */
export function BrandSection() {
  const features = [
    {
      title: "Period Tracking",
      description: "Smart cycle prediction to help you better plan work and life"
    },
    {
      title: "Health Consultation",
      description: "Chat with AI health assistant anytime for professional advice"
    },
    {
      title: "Medical Appointments",
      description: "Convenient medical service booking system to save your time"
    },
    {
      title: "Data Analysis",
      description: "Personalized health data analysis to help you monitor your health"
    }
  ];

  return (
    <>
      {/* Mobile brand banner - visible only on small screens */}
      <div 
        className="block lg:hidden w-full relative p-4 text-center"
        style={{
          backgroundImage: 'url(/images/a-diverse-group-of-women.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 py-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Workday</h1>
          <p className="text-sm opacity-90">
            Comprehensive health management for professional women
          </p>
        </div>
      </div>

      {/* Desktop brand section - hidden on small screens */}
      <div 
        className="hidden lg:flex w-1/2 relative items-center justify-center p-8 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/a-diverse-group-of-women.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="max-w-md text-white relative z-10">
          <h1 className="text-3xl font-bold mb-4">Welcome to Workday</h1>
          <p className="text-lg opacity-90 mb-6">
            We are dedicated to providing comprehensive health management solutions for professional women, helping you better balance work and health.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 