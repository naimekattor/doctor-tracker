'use client';

import React, { useState } from 'react';
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
  Search,
  ChevronLeft,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Only the actual existing routes in Doctor Tracker
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Patients', href: '/patients', icon: Users },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0C2B24]/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0C2B24] text-white transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 select-none border-r border-[#153D34]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#153D34]">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5 group">
            {/* Mint Emblem */}
            <div className="relative w-8 h-8 rounded-[6px] bg-[#00D084] p-1 flex items-center justify-center shadow-md shadow-[#00D084]/20 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Doctor Tracker Logo"
                width={24}
                height={24}
                className="w-full h-full object-contain filter brightness-0"
                priority
              />
            </div>

            {/* Brand Title */}
            <div className="flex items-center tracking-tight">
              <span className="text-[17px] font-bold text-white tracking-wide">
                Doctor Tracker
              </span>
            </div>
          </Link>

          {/* Collapse / Close Button */}
          <div className="flex items-center">
            {onClose ? (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-[6px] text-[#7F9E96] hover:text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}


          </div>
        </div>

        {/* Global Search Bar */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative flex items-center bg-[#133A31] border border-white/10 rounded-[6px] px-3 py-2 text-xs text-white placeholder-gray-400 focus-within:border-[#00D084] transition-all">
            <Search className="h-3.5 w-3.5 text-[#7F9E96] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white placeholder-[#7F9E96] w-full min-w-0"
            />
            <span className="shrink-0 text-[10px] font-mono text-[#7F9E96] bg-black/20 border border-white/10 px-1.5 py-0.5 rounded-[4px] ml-1">
              ⌘ F
            </span>
          </div>
        </div>

        {/* Navigation Items (Only real existing pages) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#6B8B82]">
            Main Menu
          </div>
          {filteredNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center justify-between px-3 py-2.5 rounded-[6px] text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#15463B] text-white font-semibold shadow-inner'
                    : 'text-[#9BB4AE] hover:bg-[#113A31] hover:text-white'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-[#00D084]' : 'text-[#7F9E96] group-hover:text-white'
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {/* Active vertical pill accent on right edge */}
                {isActive && (
                  <span className="absolute right-1.5 w-1 h-5 rounded-[6px] bg-[#00D084]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile & Sign Out at bottom */}
        <div className="p-3 border-t border-[#153D34] bg-[#0A241E]">
          <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#11372E] border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#00D084]/20 border border-[#00D084]/40 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[#00D084]">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] text-[#7F9E96] truncate leading-tight mt-0.5">
                  {user?.role === 'admin' ? 'Administrator' : 'Medical Staff'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-[6px] text-[#7F9E96] hover:text-[#FF6B6B] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
