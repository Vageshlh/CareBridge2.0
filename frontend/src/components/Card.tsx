import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component for displaying content in a card format
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  bordered = true,
  shadow = 'md'
}) => {
  const { theme } = useTheme();
  
  // Base classes
  const baseClasses = `rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`;
  
  // Border classes
  const borderClasses = bordered ? `border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}` : '';
  
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg'
  }[shadow];
  
  // Hover classes
  const hoverClasses = hoverable ? 'transition-all duration-200 hover:shadow-lg' : '';
  
  // Click classes
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${borderClasses} ${shadowClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card header component
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = ''
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-200'} ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card body component
 */
export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = ''
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : ''} ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card footer component
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = ''
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-200'} ${className}`}>
      {children}
    </div>
  );
};

export default Card;