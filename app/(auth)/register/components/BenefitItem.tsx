'use client';

interface BenefitItemProps {
  title: string;
  description: string;
}

/**
 * Benefit item component for displaying feature benefits
 * Enhanced with title and description layout
 */
export function BenefitItem({ title, description }: BenefitItemProps) {
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
} 