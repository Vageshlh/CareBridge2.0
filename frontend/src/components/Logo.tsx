import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textColor?: string;
}

const StethoscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  // Source: Tabler Icons "stethoscope" (MIT). SVG inlined and simplified for TS-safe usage.
  // https://tabler.io/icons/icon/stethoscope
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    role="img"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6 4h-1a2 2 0 0 0 -2 2v3.5h0a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1" />
    <path d="M8 15a6 6 0 1 0 12 0v-3" />
    <path d="M11 3v2" />
    <path d="M6 3v2" />
    <path d="M20 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </svg>
);

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  textColor = 'text-primary-600'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Use currentColor so theme classes control the icon color */}
      <StethoscopeIcon className={`${sizeClasses[size]} text-blue-600 dark:text-blue-400`} />
      
      {showText && (
        <span className={`ml-2 font-bold ${textSizeClasses[size]} ${textColor}`}>
          CareBridge
        </span>
      )}
    </div>
  );
};

export default Logo;