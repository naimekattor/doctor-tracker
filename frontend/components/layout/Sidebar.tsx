'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  Shield,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Patients', href: '/patients', icon: Users },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#001E2B]/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#001E2B] text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#023430]">
          <Link href="/dashboard" className="inline-flex items-center gap-3 group">
            {/* Logo */}
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center p-1 rounded-xl bg-white/10 border border-white/10 shadow-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden">
              <Image
                src="/logo.png"
                alt="Doctor Tracker Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* Brand Title + Administrative Subtext */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[19px] font-extrabold tracking-tight text-white">
                  DOCTOR
                </span>
                <span className="text-[19px] font-extrabold tracking-tight text-[#00ED64]">
                  TRACKER
                </span>
              </div>
              <span className="text-[9px] font-semibold tracking-[0.2em] text-[#5C768D] uppercase mt-1">
                Administrative Portal
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded text-[#5C768D] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#5C768D]">
            Navigation
          </div>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#023430] text-[#00ED64] font-semibold border-l-2 border-[#00ED64]'
                    : 'text-zinc-300 hover:bg-[#023430]/60 hover:text-white'
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-[#00ED64]' : 'text-[#5C768D]')} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#023430] bg-[#001721]/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00684A] text-white font-semibold text-xs shrink-0">
              <Shield className="h-4 w-4 text-[#00ED64]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.email || 'admin@doctortracker.com'}
              </p>
              <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#00ED64] uppercase tracking-wide">
                {user?.role || 'Administrator'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[#5C768D] hover:text-[#CF3B3B] hover:bg-[#CF3B3B]/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
