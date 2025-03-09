'use client';

import { FeatureCardProps } from '../types';

/**
 * Feature card component used in the brand section to showcase features
 */
export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
} 