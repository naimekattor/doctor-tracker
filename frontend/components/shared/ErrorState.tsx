import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-[#CF3B3B]/30 bg-[#CF3B3B]/5 my-4">
      <div className="p-2.5 rounded-full bg-[#CF3B3B]/10 text-[#CF3B3B] mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#1C2D38] mb-1">{title}</h3>
      <p className="text-sm text-[#5C768D] max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="h-9 text-xs">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
