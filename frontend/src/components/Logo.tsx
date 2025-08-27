import React from 'react';

const Stetho: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    role="img"
    aria-label="CareBridge"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* simple, bold stethoscope for clarity at small sizes */}
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* U-shaped earpiece */}
      <path d="M6 3v3a4 4 0 1 0 8 0V3" />
      {/* tube to chestpiece */}
      <path d="M14 14v1a4 4 0 0 1-4 4h-1" />
      {/* chestpiece circle */}
      <circle cx="19" cy="15" r="2" />
      {/* link from tube to chestpiece */}
      <path d="M14 14c1.5 0 3 .5 4 1" />
    </g>
  </svg>
);

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Stetho className={`${sizeClasses[size]} text-blue-600 dark:text-blue-400`} />
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold`}>CareBridge</span>
      )}
    </div>
  );
};

export default Logo;