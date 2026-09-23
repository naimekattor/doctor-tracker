import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1C2D38]">
            {label}
            {props.required && <span className="text-[#CF3B3B] ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'h-[40px] w-full rounded-[6px] border border-[#E8EDEB] bg-white px-3 py-2 text-[14px] text-[#1C2D38] placeholder:text-[#5C768D]/70 transition-colors focus:border-[#00684A] focus:outline-none focus:ring-2 focus:ring-[#00ED64]/25 disabled:cursor-not-allowed disabled:bg-[#F9FBFA] disabled:opacity-60',
            error && 'border-[#CF3B3B] focus:border-[#CF3B3B] focus:ring-[#CF3B3B]/20',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-[#CF3B3B] font-medium">{error}</span>}
        {helperText && !error && <span className="text-xs text-[#5C768D]">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
