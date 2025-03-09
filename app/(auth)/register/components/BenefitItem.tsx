'use client';

import { BenefitItemProps } from '../types';

/**
 * Benefit item component for displaying feature benefits
 */
export function BenefitItem({ text }: BenefitItemProps) {
  return (
    <li className="flex items-start">
      <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>{text}</span>
    </li>
  );
} 