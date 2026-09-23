import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children: React.ReactNode;
}

export function Heading({ as: Component = 'h1', className, children, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        'text-[28px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#1C2D38]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Subheading({ as: Component = 'h2', className, children, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        'text-[18px] font-medium leading-[1.4] text-[#5C768D]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Body({ as: Component = 'p', className, children, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        'text-[14px] font-normal leading-[1.5] text-[#1C2D38]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
