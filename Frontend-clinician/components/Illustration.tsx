
import React from 'react';

interface IllustrationProps {
  className?: string;
}

const Illustration: React.FC<IllustrationProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <circle cx="200" cy="200" r="180" stroke="#3B82F6" strokeWidth="2" strokeDasharray="8 8" />
      <path 
        d="M140 280C140 280 150 220 200 220C250 220 260 280 260 280" 
        stroke="#3B82F6" 
        strokeWidth="12" 
        strokeLinecap="round" 
      />
      <circle cx="200" cy="140" r="40" stroke="#3B82F6" strokeWidth="8" />
      <path 
        d="M100 320C100 320 110 260 160 260C210 260 220 320 220 320" 
        stroke="#1E40AF" 
        strokeWidth="12" 
        strokeLinecap="round" 
      />
      <circle cx="160" cy="180" r="30" stroke="#1E40AF" strokeWidth="8" />
      <path d="M280 120L310 150L280 180" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 80L100 100L80 120" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default Illustration;
