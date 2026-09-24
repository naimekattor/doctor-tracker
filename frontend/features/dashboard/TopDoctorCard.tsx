'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';
import { TopDoctor } from '@/types/analytics';

interface TopDoctorCardProps {
  topDoctor?: TopDoctor;
  avgPatientsPerDoctor: string;
}

export function TopDoctorCard({ topDoctor, avgPatientsPerDoctor }: TopDoctorCardProps) {
  if (!topDoctor) {
    return (
      <div className="bg-white rounded-[6px] border border-gray-100/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
            TOP PRACTITIONER
          </span>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 mt-1">
            Clinical Overview
          </h3>
          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            No patient allocations recorded yet. Assign patients to practitioners to track clinical workloads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[6px] border border-gray-100/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
              TOP PRACTITIONER
            </span>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 mt-1">
              {topDoctor.name}
            </h3>
          </div>

          <Link
            href={`/doctors/${topDoctor._id}`}
            className="px-3.5 py-1.5 rounded-[6px] bg-[#0C2B24] hover:bg-[#071F1A] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>Profile</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Real description based on doctor's actual data */}
        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          {topDoctor.specialization} specialist affiliated with {topDoctor.hospital}. Currently managing the highest patient case allocations across the facility network.
        </p>
      </div>

      {/* Dual Metrics Sub-Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-[#F8FAF9] rounded-[6px] p-3.5 border border-gray-100/80">
          <span className="text-[11px] text-gray-500 font-medium block">
            Assigned Cases
          </span>
          <div className="mt-1 flex items-center gap-1 text-sm font-bold text-gray-900">
            <span className="text-[#00A86B] font-bold">{topDoctor.patientCount}</span>
            <span className="text-xs text-gray-500 font-normal">Patients</span>
          </div>
        </div>

        <div className="bg-[#F8FAF9] rounded-[6px] p-3.5 border border-gray-100/80">
          <span className="text-[11px] text-gray-500 font-medium block">
            Avg Workload
          </span>
          <div className="mt-1 flex items-center gap-1 text-sm font-bold text-gray-900">
            <span>{avgPatientsPerDoctor}</span>
            <span className="text-xs text-gray-500 font-normal">pts/doc</span>
          </div>
        </div>
      </div>
    </div>
  );
}
