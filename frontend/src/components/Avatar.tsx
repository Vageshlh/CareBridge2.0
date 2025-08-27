import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
  name?: string;
  rounded?: 'full' | 'md' | 'none';
  bordered?: boolean;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  className = '',
  name,
  rounded = 'full',
  bordered = false,
  onClick
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  }[size];

  // Rounded classes
  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded-md',
    none: ''
  }[rounded];

  // Status classes
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  // Status size classes
  const statusSizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5'
  }[size];

  // Get initials from name
  const getInitials = () => {
    if (!name) return '';
    
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (
      names[0].charAt(0).toUpperCase() + 
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  // Generate random color based on name
  const getRandomColor = () => {
    if (!name) return 'bg-gray-500';
    
    const colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500'
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  return (
    <div className="relative inline-block">
      {src ? (
        // Image avatar
        <img
          src={src}
          alt={alt}
          className={`
            ${sizeClasses}
            ${roundedClasses}
            ${bordered ? 'border-2 border-white ring-2 ring-gray-200' : ''}
            object-cover
            ${onClick ? 'cursor-pointer' : ''}
            ${className}
          `}
          onClick={onClick}
        />
      ) : (
        // Initials avatar
        <div
          className={`
            ${sizeClasses}
            ${roundedClasses}
            ${getRandomColor()}
            text-white
            flex items-center justify-center
            font-medium
            ${bordered ? 'border-2 border-white ring-2 ring-gray-200' : ''}
            ${onClick ? 'cursor-pointer' : ''}
            ${className}
          `}
          onClick={onClick}
        >
          {getInitials()}
        </div>
      )}
      
      {/* Status indicator */}
      {status && (
        <span 
          className={`
            absolute bottom-0 right-0 block
            ${statusSizeClasses}
            ${statusClasses[status]}
            rounded-full
            ring-2 ring-white
          `}
        />
      )}
    </div>
  );
};

// Avatar group component
interface AvatarGroupProps {
  avatars: Array<Omit<AvatarProps, 'size' | 'rounded'>>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  className = ''
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  // Calculate negative margin based on size
  const marginClasses = {
    xs: '-space-x-1',
    sm: '-space-x-2',
    md: '-space-x-2',
    lg: '-space-x-3',
    xl: '-space-x-4'
  }[size];

  return (
    <div className={`flex ${marginClasses} ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <div key={index} className="relative">
          <Avatar
            {...avatar}
            size={size}
            rounded="full"
            bordered
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className="relative">
          <div
            className={`
              ${size === 'xs' ? 'h-6 w-6 text-xs' : ''}
              ${size === 'sm' ? 'h-8 w-8 text-sm' : ''}
              ${size === 'md' ? 'h-10 w-10 text-base' : ''}
              ${size === 'lg' ? 'h-12 w-12 text-lg' : ''}
              ${size === 'xl' ? 'h-16 w-16 text-xl' : ''}
              rounded-full
              bg-gray-300
              text-gray-600
              flex items-center justify-center
              font-medium
              border-2 border-white
            `}
          >
            +{remainingCount}
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;