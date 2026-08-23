import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  const variantClasses = {
    primary: 'bg-[#111111] text-white hover:bg-[#222222] border border-[#111111] shadow-sm',
    gold: 'bg-[#D4AF37] text-black hover:bg-[#b89628] font-semibold border border-[#D4AF37] shadow-sm',
    secondary: 'bg-[#F8F7F3] text-[#111111] hover:bg-[#E8E5DE] border border-[#E8E5DE]',
    outline: 'bg-transparent text-[#111111] border border-[#E8E5DE] hover:border-[#D4AF37] hover:text-[#D4AF37]',
    ghost: 'bg-transparent text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F7F3]',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
};

export default Button;
