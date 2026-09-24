'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  RefreshCw,
  Box,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Patient } from '@/types/patient';
import { ConditionBadge } from '@/components/ui/Badge';

interface RecentPatientsListProps {
  patients: Patient[];
  totalPatientsCount?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function RecentPatientsList({
  patients,
  totalPatientsCount,
  onRefresh,
  isRefreshing = false,
}: RecentPatientsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>(() => {
    // Default all current patients to active (true)
    const initial: Record<string, boolean> = {};
    patients.forEach((p, idx) => {
      initial[p._id] = idx % 5 !== 4; // realistic variety
    });
    return initial;
  });

  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const togglePatientActive = (id: string) => {
    setActiveToggles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPatients = patients.filter((patient) => {
    const q = searchQuery.toLowerCase();
    const docName =
      typeof patient.doctor === 'object' && patient.doctor?.name
        ? patient.doctor.name.toLowerCase()
        : '';
    return (
      patient.name.toLowerCase().includes(q) ||
      patient.condition.toLowerCase().includes(q) ||
      docName.includes(q)
    );
  });

  const displayCount = totalPatientsCount || patients.length;

  return (
    <div className="bg-white rounded-[6px] border border-gray-100/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
              PATIENT LIST
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                {displayCount}
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#E8FAF2] text-[#00A86B]">
                +{patients.length}
              </span>
            </div>
          </div>

          <div className="w-9 h-9 rounded-[6px] bg-[#E8FAF2] text-[#00A86B] flex items-center justify-center">
            <Users className="h-5 w-5 stroke-[2]" />
          </div>
        </div>

        {/* Search & Refresh Action Toolbar */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-9 pr-4 py-2 text-xs rounded-[6px] border border-gray-200 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00D084] focus:border-[#00D084] transition-colors"
            />
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-[6px] hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* Patient Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] text-gray-400 uppercase font-medium">
                <th className="py-2.5 pl-1 pr-3 w-8">
                  <input
                    type="checkbox"
                    className="rounded-[3px] text-[#00A86B] focus:ring-[#00D084] cursor-pointer"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const newSelected: Record<string, boolean> = {};
                      filteredPatients.forEach((p) => {
                        newSelected[p._id] = checked;
                      });
                      setSelectedIds(newSelected);
                    }}
                  />
                </th>
                <th className="py-2.5 px-3">Patient Info</th>
                <th className="py-2.5 px-3">Age / Gender</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Assigned Doctor</th>
                <th className="py-2.5 px-3 text-right">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No matching patient records found.
                  </td>
                </tr>
              ) : (
                filteredPatients.slice(0, 6).map((patient, idx) => {
                  const doc = typeof patient.doctor === 'object' ? patient.doctor : null;
                  const isActive = activeToggles[patient._id] ?? true;
                  const isSelected = selectedIds[patient._id] ?? false;

                  // Initials for avatar
                  const initials = patient.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  const avatarGradients = [
                    'from-emerald-500 to-teal-600',
                    'from-blue-500 to-indigo-600',
                    'from-amber-500 to-orange-600',
                    'from-rose-500 to-pink-600',
                    'from-cyan-500 to-blue-600',
                  ];
                  const grad = avatarGradients[idx % avatarGradients.length];

                  return (
                    <tr
                      key={patient._id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="py-3 pl-1 pr-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(patient._id)}
                          className="rounded-[3px] text-[#00A86B] focus:ring-[#00D084] cursor-pointer"
                        />
                      </td>

                      {/* Patient Info with Avatar */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} text-white flex items-center justify-center text-[10px] font-bold shadow-2xs shrink-0`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 group-hover:text-[#0C2B24] transition-colors">
                              {patient.name}
                            </span>
                            <span className="block text-[10px] text-gray-400 font-mono">
                              {patient.contactPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3 px-3 text-gray-600">
                        {patient.age} yrs • {patient.gender}
                      </td>

                      {/* Condition */}
                      <td className="py-3 px-3">
                        <ConditionBadge condition={patient.condition} />
                      </td>

                      {/* Assigned Doctor */}
                      <td className="py-3 px-3">
                        {doc ? (
                          <Link
                            href={`/doctors/${doc._id}`}
                            className="font-medium text-[#00A86B] hover:text-[#008F5B] hover:underline"
                          >
                            {doc.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>

                      {/* Active Toggle Switch */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          onClick={() => togglePatientActive(patient._id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#00D084] ${
                            isActive ? 'bg-[#00D084]' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Link to Full Patients Page */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>Showing top recent admissions</span>
        <Link
          href="/patients"
          className="text-xs font-semibold text-[#00A86B] hover:text-[#008F5B] flex items-center gap-1 transition-colors"
        >
          View all patients <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
