'use client';

import { BenefitItem } from './BenefitItem';

/**
 * Brand section component for the register page
 * Displays the company logo, headline, description, and benefit items
 * Enhanced with mobile-specific design
 */
export function BrandSection() {
  const benefits = [
    {
      title: "User-friendly Interface",
      description: "Easy to use platform for everyone in your organization"
    },
    {
      title: "Multi-tenant Architecture",
      description: "Separate spaces for different departments with role-based access"
    },
    {
      title: "Data Security",
      description: "Enterprise-grade security for all your sensitive information"
    },
    {
      title: "AI-powered Assistant",
      description: "Smart health assistant available 24/7 for all your questions"
    }
  ];

  return (
    <>
      {/* Mobile brand banner - visible only on small screens */}
      <div 
        className="block lg:hidden w-full relative p-4 text-center"
        style={{
          backgroundImage: 'url(/images/professional-corporate-setting.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 py-8 text-white">
          <h1 className="text-2xl font-bold mb-2">FemTech Health Platform</h1>
          <p className="text-sm opacity-90">
            Register your organization today
          </p>
        </div>
      </div>

      {/* Desktop brand section - hidden on small screens */}
      <div 
        className="hidden lg:flex w-1/2 relative items-center justify-center p-8 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/professional-corporate-setting.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="max-w-md text-white relative z-10">
          <h1 className="text-3xl font-bold mb-4">Register Your Organization</h1>
          <p className="text-lg opacity-90 mb-6">
            Join our platform and provide your employees with cutting-edge health management services
          </p>
          
          <div className="grid grid-cols-1 gap-4 mt-8">
            {benefits.map((benefit, index) => (
              <BenefitItem 
                key={index}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 