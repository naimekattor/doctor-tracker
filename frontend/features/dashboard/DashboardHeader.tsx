'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { Info, Download, Check, Plus } from 'lucide-react';
import { DashboardStats } from '@/types/analytics';

interface DashboardHeaderProps {
  stats?: DashboardStats;
  onRefresh?: () => void;
}

const AVATAR_COLORS = [
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-indigo-500',
  'from-amber-500 to-orange-400',
];

export function DashboardHeader({ stats, onRefresh }: DashboardHeaderProps) {
  const { user } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [exported, setExported] = useState(false);

  const displayName = user?.email
    ? user.email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase())
    : 'Doctor';

  const handleExport = () => {
    if (!stats) return;
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: stats.summary,
      specializations: stats.specializationBreakdown,
      genders: stats.genderBreakdown,
      hospitals: stats.hospitalBreakdown,
      recentPatientsCount: stats.recentPatients.length,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctor-tracker-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  // Generate real initials from actual doctors in system
  const topDoctors = stats?.topDoctorsByPatients || [];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      {/* Left Title & Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
          Welcome back {displayName}
        </p>
      </div>

      {/* Right Action Icons & Export */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Real Doctors Avatars Stack */}
        <div className="flex items-center -space-x-2 mr-1">
          {topDoctors.slice(0, 3).map((doc, idx) => {
            const initials = doc.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();
            return (
              <div
                key={doc._id}
                title={`${doc.name} (${doc.specialization})`}
                className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-tr ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[11px] font-bold shadow-xs cursor-default`}
              >
                {initials}
              </div>
            );
          })}
          <Link
            href="/doctors"
            title="View all medical practitioners"
            className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 flex items-center justify-center text-gray-500 text-xs font-semibold shadow-xs hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Info Button with diagnostics modal */}
        <div className="relative">
          <button
            onClick={() => setShowInfo(!showInfo)}
            title="System Diagnostics"
            className="w-9 h-9 rounded-[6px] border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Info className="h-4 w-4" />
          </button>

          {showInfo && (
            <div className="absolute right-0 mt-2 w-64 p-3 bg-white rounded-[6px] shadow-xl border border-gray-100 z-50 text-xs space-y-2 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <span className="font-semibold text-gray-900">System Information</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[6px] font-bold">
                  Operational
                </span>
              </div>
              <p className="text-gray-500 text-[11px]">
                Doctor Tracker v1.2 Enterprise edition. Real-time patient flow and doctor scheduling.
              </p>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="h-9 px-4 rounded-[6px] bg-[#0C2B24] hover:bg-[#071F1A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
        >
          {exported ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#00D084]" />
              <span>Exported</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
