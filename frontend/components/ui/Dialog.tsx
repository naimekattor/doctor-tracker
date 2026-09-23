'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#001E2B]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          'relative z-50 w-full max-w-lg rounded-xl border border-[#E8EDEB] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200',
          className
        )}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#E8EDEB]">
          <div>
            <h2 id="dialog-title" className="text-xl font-semibold text-[#1C2D38]">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-[#5C768D]">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#5C768D] hover:bg-[#F9FBFA] hover:text-[#1C2D38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00684A]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
