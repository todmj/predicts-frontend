import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white';

  const variantClasses = {
    primary: 'bg-[#3D0C63] text-white hover:bg-[#4a0f78] focus:ring-[#3D0C63]',
    secondary: 'bg-[#F3F3F3] text-[#1C1526] hover:bg-[#E5E5E5] focus:ring-[#767771]',
    success: 'bg-[#22c55e] text-white hover:bg-[#16a34a] focus:ring-[#22c55e]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444]',
    outline: 'bg-transparent border-2 border-[#1C1526] text-[#1C1526] hover:bg-[#F3F3F3] focus:ring-[#1C1526]',
    ghost: 'bg-transparent text-[#767771] hover:text-[#1C1526] hover:bg-[#F3F3F3] focus:ring-[#767771]',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;


