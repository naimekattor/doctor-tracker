'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Doctor } from '@/types/doctor';

interface PatientFiltersProps {
  doctors: Doctor[];
}

const CONDITIONS = [
  'Stable',
  'Critical',
  'Under Observation',
  'Recovered',
  'Chronic',
  'Routine Checkup',
];

const GENDERS = ['Male', 'Female', 'Other'];

export function PatientFilters({ doctors }: PatientFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const currentCondition = searchParams.get('condition') || '';
  const currentGender = searchParams.get('gender') || '';
  const currentDoctor = searchParams.get('doctor') || '';

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
    params.set('page', '1');
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

  const hasActiveFilters = Boolean(
    searchTerm || currentCondition || currentGender || currentDoctor
  );

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white p-4 rounded-xl border border-[#E8EDEB] shadow-xs">
      <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#5C768D]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patients by name or phone number..."
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

      <div className="flex flex-wrap items-center gap-2">
        {/* Condition Filter */}
        <select
          value={currentCondition}
          onChange={(e) => updateParam('condition', e.target.value)}
          className="h-[40px] rounded-[6px] border border-[#E8EDEB] bg-white px-3 text-xs text-[#1C2D38] focus:border-[#00684A] focus:outline-none cursor-pointer"
        >
          <option value="">All Conditions</option>
          {CONDITIONS.map((cond) => (
            <option key={cond} value={cond}>
              {cond}
            </option>
          ))}
        </select>

        {/* Gender Filter */}
        <select
          value={currentGender}
          onChange={(e) => updateParam('gender', e.target.value)}
          className="h-[40px] rounded-[6px] border border-[#E8EDEB] bg-white px-3 text-xs text-[#1C2D38] focus:border-[#00684A] focus:outline-none cursor-pointer"
        >
          <option value="">All Genders</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Doctor Filter */}
        <select
          value={currentDoctor}
          onChange={(e) => updateParam('doctor', e.target.value)}
          className="h-[40px] rounded-[6px] border border-[#E8EDEB] bg-white px-3 text-xs text-[#1C2D38] focus:border-[#00684A] focus:outline-none cursor-pointer max-w-[200px] truncate"
        >
          <option value="">All Doctors</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name}
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
