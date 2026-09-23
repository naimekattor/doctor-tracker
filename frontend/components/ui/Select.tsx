import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#1C2D38]">
            {label}
            {props.required && <span className="text-[#CF3B3B] ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'h-[40px] w-full rounded-[6px] border border-[#E8EDEB] bg-white px-3 py-2 text-[14px] text-[#1C2D38] transition-colors focus:border-[#00684A] focus:outline-none focus:ring-2 focus:ring-[#00ED64]/25 disabled:cursor-not-allowed disabled:bg-[#F9FBFA] disabled:opacity-60 cursor-pointer',
            error && 'border-[#CF3B3B] focus:border-[#CF3B3B] focus:ring-[#CF3B3B]/20',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-[#CF3B3B] font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
