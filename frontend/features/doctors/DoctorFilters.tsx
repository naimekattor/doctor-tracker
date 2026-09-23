'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DoctorFiltersProps {
  specializations: string[];
  hospitals: string[];
}

export function DoctorFilters({ specializations, hospitals }: DoctorFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const currentSpecialization = searchParams.get('specialization') || '';
  const currentHospital = searchParams.get('hospital') || '';

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // reset page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchTerm.trim());
  };

  const handleClearAll = () => {
    setSearchTerm('');
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(searchTerm || currentSpecialization || currentHospital);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-4 rounded-xl border border-[#E8EDEB] shadow-xs">
      <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#5C768D]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search doctors by name, email, or hospital..."
          className="h-[40px] w-full rounded-[6px] border border-[#E8EDEB] bg-[#F9FBFA] pl-9 pr-8 text-sm text-[#1C2D38] placeholder:text-[#5C768D]/70 focus:bg-white focus:border-[#00684A] focus:outline-none focus:ring-2 focus:ring-[#00ED64]/25"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              updateParam('search', '');
            }}
            className="absolute right-2.5 top-3 text-[#5C768D] hover:text-[#1C2D38]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Specialization Filter */}
        <select
          value={currentSpecialization}
          onChange={(e) => updateParam('specialization', e.target.value)}
          className="h-[40px] rounded-[6px] border border-[#E8EDEB] bg-white px-3 text-xs text-[#1C2D38] focus:border-[#00684A] focus:outline-none cursor-pointer"
        >
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        {/* Hospital Filter */}
        <select
          value={currentHospital}
          onChange={(e) => updateParam('hospital', e.target.value)}
          className="h-[40px] rounded-[6px] border border-[#E8EDEB] bg-white px-3 text-xs text-[#1C2D38] focus:border-[#00684A] focus:outline-none cursor-pointer"
        >
          <option value="">All Hospitals</option>
          {hospitals.map((hosp) => (
            <option key={hosp} value={hosp}>
              {hosp}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="h-[40px] px-3 text-xs text-[#CF3B3B] hover:bg-[#CF3B3B]/10 hover:text-[#CF3B3B]"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
