import React from 'react';

interface DataScienceLogoProps {
  className?: string;
}

export const DataScienceLogo: React.FC<DataScienceLogoProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer isometric multidimensional lattice */}
      <path 
        d="M12 2.8L20.2 7.5V16.5L12 21.2L3.8 16.5V7.5L12 2.8Z" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        strokeLinejoin="round" 
        className="opacity-50" 
      />
      {/* Central dimensional coordinate axes & interconnecting vectors */}
      <path 
        d="M12 2.8V12M12 12L20.2 16.5M12 12L3.8 16.5M12 12L20.2 7.5M12 12L3.8 7.5M12 12V21.2" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="opacity-80" 
      />
      {/* Central nucleus node (Data Core) */}
      <circle cx="12" cy="12" r="2.3" fill="currentColor" />
      {/* Vertex data points */}
      <circle cx="12" cy="2.8" r="1.7" fill="currentColor" />
      <circle cx="20.2" cy="7.5" r="1.7" fill="currentColor" />
      <circle cx="20.2" cy="16.5" r="1.7" fill="currentColor" />
      <circle cx="12" cy="21.2" r="1.7" fill="currentColor" />
      <circle cx="3.8" cy="16.5" r="1.7" fill="currentColor" />
      <circle cx="3.8" cy="7.5" r="1.7" fill="currentColor" />
    </svg>
  );
};

export default DataScienceLogo;
