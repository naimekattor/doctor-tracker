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
    return 'Dashboard & Analytics';
  };

  return (
    <header className="h-16 border-b border-[#E8EDEB] bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-md text-[#5C768D] hover:bg-[#F9FBFA] hover:text-[#1C2D38]"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="lg:hidden flex items-center">
          <Image
            src="/logo.png"
            alt="Doctor Tracker Logo"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
        </div>

        <h1 className="text-lg font-semibold text-[#1C2D38] tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* System Health Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/20 text-xs font-medium text-[#00684A]">
          <span className="h-2 w-2 rounded-full bg-[#00ED64] animate-pulse" />
          <Activity className="h-3.5 w-3.5" />
          System Operational
        </div>
      </div>
    </header>
  );
}
