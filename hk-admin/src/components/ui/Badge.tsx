import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gray',
  children,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    gold: 'bg-[#FDF9EC] text-[#9E7C10] border border-[#F5E6B3] font-medium',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
