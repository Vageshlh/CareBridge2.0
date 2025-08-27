import React, { ButtonHTMLAttributes } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button component with various styles and states
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...rest
}) => {
  const { theme } = useTheme();
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }[size];
  
  // Variant classes based on theme
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 border border-transparent',
    secondary: theme === 'dark' 
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500 border border-transparent' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500 border border-transparent',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 border border-transparent',
    info: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 border border-transparent',
    light: theme === 'dark' 
      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 focus:ring-gray-500 border border-gray-600' 
      : 'bg-white hover:bg-gray-100 text-gray-800 focus:ring-gray-500 border border-gray-300',
    dark: theme === 'dark' 
      ? 'bg-gray-900 hover:bg-black text-white focus:ring-gray-500 border border-transparent' 
      : 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500 border border-transparent',
    link: theme === 'dark' 
      ? 'bg-transparent hover:underline text-primary-400 hover:text-primary-300 focus:ring-0 border-0 shadow-none' 
      : 'bg-transparent hover:underline text-primary-600 hover:text-primary-700 focus:ring-0 border-0 shadow-none'
  }[variant];
  
  // Width classes
  const widthClasses = isFullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClasses} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;