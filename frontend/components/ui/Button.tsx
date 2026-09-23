import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'h-[40px] px-4 text-[16px] font-medium rounded-[6px] inline-flex items-center justify-center gap-2 transition-colors duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00684A] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[#00ED64] text-[#001E2B] hover:bg-[#00684A] hover:text-white active:bg-[#00553c]',
      secondary:
        'bg-transparent border border-[#E8EDEB] text-[#1C2D38] hover:bg-[#F9FBFA] hover:border-[#d0d7d4] active:bg-[#edf2f0]',
      destructive: 'bg-[#CF3B3B] text-white hover:bg-[#b02f2f] active:bg-[#962626]',
      ghost: 'bg-transparent text-[#5C768D] hover:bg-[#F9FBFA] hover:text-[#1C2D38] active:bg-[#edf2f0]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
