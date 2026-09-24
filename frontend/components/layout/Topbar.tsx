'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Activity } from 'lucide-react';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/doctors/')) return 'Doctor Profile';
    if (pathname.startsWith('/doctors')) return 'Doctors Directory';
    if (pathname.startsWith('/patients')) return 'Patients Directory';
    return 'Dashboard';
  };

  return (
    <header className="lg:hidden h-14 border-b border-[#E8ECE9] bg-white px-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#00D084] p-0.5 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Doctor Tracker Logo"
              width={20}
              height={20}
              className="w-full h-full object-contain filter brightness-0"
            />
          </div>
          <h1 className="text-sm font-bold text-gray-900 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8FAF2] text-[11px] font-semibold text-[#00A86B]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00D084] animate-pulse" />
          Active
        </div>
      </div>
    </header>
  );
}
