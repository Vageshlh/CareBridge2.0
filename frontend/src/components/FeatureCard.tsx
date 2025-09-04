import React, { useState } from 'react';
import { useTilt } from '../hooks/useTilt';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  href,
  className = ''
}) => {
  const cardId = `feature-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const { elementRef, glareRef } = useTilt({ maxTilt: 7, perspective: 1000, scale: 1.02 });
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      {/* Ambient glow layer */}
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Focus ring for accessibility */}
      {isFocused && (
        <div 
          className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl opacity-60 blur-sm pointer-events-none"
          aria-hidden="true"
        />
      )}
      
      <div
        ref={elementRef}
        role="article"
        className={`relative rounded-2xl bg-white/80 dark:bg-slate-800/70 backdrop-blur shadow-sm transition-all duration-200 p-6 ring-1 ring-slate-200/70 dark:ring-slate-700 overflow-hidden transform-gpu h-full flex flex-col ${isPressed ? 'scale-98 shadow-sm' : 'hover:shadow-xl'} ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease'
        }}
        tabIndex={href ? 0 : undefined}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Animated edge lighting */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
            backgroundSize: '200% 100%',
            animation: 'sweep 2s ease-in-out infinite'
          }}
          aria-hidden="true"
        />
        
        {/* Glare effect */}
        <div 
          ref={glareRef}
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mix-blend-overlay"
          aria-hidden="true"
        />
        
        {/* Edge border gradient */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, rgba(56, 189, 248, 0.3), rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.3))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            padding: '1px'
          }}
          aria-hidden="true"
        />
      <div className="size-12 rounded-xl grid place-content-center bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 mb-4">
        <div aria-hidden="true">
          {icon}
        </div>
      </div>
      
      <h3
        id={cardId}
        className="text-xl font-semibold text-slate-900 dark:text-slate-100"
      >
        {title}
      </h3>
      
      <p
        className="text-slate-600 dark:text-slate-300 leading-relaxed mt-1 flex-grow"
        aria-labelledby={cardId}
      >
        {description}
      </p>
      
      {href && (
        <a
          href={href}
          className="group inline-flex items-center gap-1 text-blue-600 dark:text-blue-300 hover:underline mt-3 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          Learn more
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      )}
      </div>
    </div>
  );
};

export default FeatureCard;