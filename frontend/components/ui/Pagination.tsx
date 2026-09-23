import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  if (totalPages <= 1 && totalRecords <= limit) {
    return (
      <div className="flex items-center justify-between py-3 text-xs text-[#5C768D]">
        <span>Showing {totalRecords} results</span>
      </div>
    );
  }

  const startRecord = Math.min((currentPage - 1) * limit + 1, totalRecords);
  const endRecord = Math.min(currentPage * limit, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1">
      <div className="text-sm text-[#5C768D]">
        Showing <span className="font-semibold text-[#1C2D38]">{totalRecords === 0 ? 0 : startRecord}</span> to{' '}
        <span className="font-semibold text-[#1C2D38]">{endRecord}</span> of{' '}
        <span className="font-semibold text-[#1C2D38]">{totalRecords}</span> entries
      </div>

      <div className="flex items-center gap-2">
        {onLimitChange && (
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-xs text-[#5C768D]">Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 rounded border border-[#E8EDEB] bg-white px-2 text-xs text-[#1C2D38] focus:border-[#00684A] focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <Button
          variant="secondary"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5 text-xs"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="text-xs font-medium px-2 text-[#1C2D38]">
          Page {currentPage} of {totalPages || 1}
        </div>

        <Button
          variant="secondary"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5 text-xs"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
