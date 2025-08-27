import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  pill?: boolean;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  rounded = true,
  pill = false,
  children,
  className = '',
  dot = false
}) => {
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-gray-50 text-gray-600',
    dark: 'bg-gray-800 text-white'
  }[variant];

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  }[size];

  // Shape classes
  const shapeClasses = pill ? 'rounded-full' : rounded ? 'rounded' : '';

  return (
    <span 
      className={`
        inline-flex items-center font-medium
        ${variantClasses}
        ${sizeClasses}
        ${shapeClasses}
        ${className}
      `}
    >
      {dot && (
        <span 
          className={`
            inline-block h-2 w-2 rounded-full mr-1
            ${variant === 'primary' ? 'bg-primary-500' : ''}
            ${variant === 'secondary' ? 'bg-gray-500' : ''}
            ${variant === 'success' ? 'bg-green-500' : ''}
            ${variant === 'danger' ? 'bg-red-500' : ''}
            ${variant === 'warning' ? 'bg-yellow-500' : ''}
            ${variant === 'info' ? 'bg-blue-500' : ''}
            ${variant === 'light' ? 'bg-gray-400' : ''}
            ${variant === 'dark' ? 'bg-gray-200' : ''}
          `}
        />
      )}
      {children}
    </span>
  );
};

// Status badge component
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'error';
  className?: string;
  size?: BadgeSize;
  pill?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
  pill = true
}) => {
  // Map status to variant and label
  const statusConfig = {
    active: { variant: 'success' as BadgeVariant, label: 'Active' },
    inactive: { variant: 'secondary' as BadgeVariant, label: 'Inactive' },
    pending: { variant: 'warning' as BadgeVariant, label: 'Pending' },
    completed: { variant: 'primary' as BadgeVariant, label: 'Completed' },
    cancelled: { variant: 'danger' as BadgeVariant, label: 'Cancelled' },
    error: { variant: 'danger' as BadgeVariant, label: 'Error' }
  }[status];

  return (
    <Badge
      variant={statusConfig.variant}
      size={size}
      pill={pill}
      dot={true}
      className={className}
    >
      {statusConfig.label}
    </Badge>
  );
};

// Counter badge component
interface CounterBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  className?: string;
  size?: BadgeSize;
}

export const CounterBadge: React.FC<CounterBadgeProps> = ({
  count,
  max = 99,
  variant = 'danger',
  className = '',
  size = 'sm'
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();
  
  return (
    <Badge
      variant={variant}
      size={size}
      pill={true}
      className={`min-w-[1.5rem] text-center ${className}`}
    >
      {displayCount}
    </Badge>
  );
};

export default Badge;