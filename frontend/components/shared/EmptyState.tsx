import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-[#E8EDEB] border-dashed">
      <div className="p-3 rounded-full bg-[#F9FBFA] text-[#5C768D] mb-4 border border-[#E8EDEB]">
        <Icon className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-[#1C2D38] mb-1">{title}</h3>
      <p className="text-sm text-[#5C768D] max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
