'use client';

import Image from "next/image";

import { FeatureCard } from './FeatureCard';

/**
 * Brand section component for the login page
 * Displays the company logo, headline, description, and feature cards
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
        <Image 
          src="/images/sanicle_logo_white.svg" 
          alt="Sanicle Logo" 
          width={180} 
          height={60}
          className="mb-8"
        />
        <h1 className="text-3xl font-bold mb-4">Welcome to FemTech Health Platform</h1>
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
  );
} 