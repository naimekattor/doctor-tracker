import React from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'stable'
  | 'critical'
  | 'observation'
  | 'recovered'
  | 'chronic';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-xs font-medium tracking-wide transition-colors';

  const variants: Record<BadgeVariant, string> = {
    default: 'bg-[#F9FBFA] text-[#1C2D38] border border-[#E8EDEB]',
    success: 'bg-[#00ED64]/15 text-[#00684A] border border-[#00ED64]/30',
    danger: 'bg-[#CF3B3B]/10 text-[#CF3B3B] border border-[#CF3B3B]/20',
    warning: 'bg-[#E68B00]/10 text-[#E68B00] border border-[#E68B00]/25',
    info: 'bg-[#5C768D]/10 text-[#1C2D38] border border-[#5C768D]/20',
    stable: 'bg-[#00ED64]/15 text-[#00684A] border border-[#00ED64]/30',
    critical: 'bg-[#CF3B3B]/15 text-[#CF3B3B] border border-[#CF3B3B]/30 font-semibold animate-pulse',
    observation: 'bg-[#E68B00]/15 text-[#E68B00] border border-[#E68B00]/30',
    recovered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    chronic: 'bg-purple-50 text-purple-700 border border-purple-200',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

export function ConditionBadge({ condition }: { condition: string }) {
  const normalized = condition.toLowerCase();
  let variant: BadgeVariant = 'default';

  if (normalized.includes('stable')) variant = 'stable';
  else if (normalized.includes('critical')) variant = 'critical';
  else if (normalized.includes('observation')) variant = 'observation';
  else if (normalized.includes('recovered')) variant = 'recovered';
  else if (normalized.includes('chronic')) variant = 'chronic';
  else if (normalized.includes('checkup') || normalized.includes('routine')) variant = 'info';

  return <Badge variant={variant}>{condition}</Badge>;
}
