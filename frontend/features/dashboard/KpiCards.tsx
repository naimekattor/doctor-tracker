'use client';

import React from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Users,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { DashboardStats } from '@/types/analytics';

interface KpiCardsProps {
  stats: DashboardStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const { summary, specializationBreakdown, hospitalBreakdown } = stats;
  const { totalDoctors, totalPatients } = summary;

  const avgPatientsPerDoctor =
    totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : '0';

  const specialtiesCount = specializationBreakdown?.length || 0;
  const hospitalsCount = hospitalBreakdown?.length || 0;

  const cards = [
    {
      id: 'doctors',
      label: 'TOTAL PRACTITIONERS',
      value: totalDoctors.toLocaleString(),
      badgeText: 'Active',
      subtext: 'Verified medical practitioners',
      href: '/doctors',
      icon: Stethoscope,
    },
    {
      id: 'patients',
      label: 'TOTAL PATIENTS',
      value: totalPatients.toLocaleString(),
      badgeText: 'Tracked',
      subtext: 'Admitted across facilities',
      href: '/patients',
      icon: Users,
    },
    {
      id: 'workload',
      label: 'WORKLOAD RATIO',
      value: `${avgPatientsPerDoctor} pts`,
      badgeText: 'Per Doctor',
      subtext: 'Current patient-to-practitioner ratio',
      href: '/doctors',
      icon: Activity,
    },
    {
      id: 'specialties',
      label: 'CLINICAL SPECIALTIES',
      value: `${specialtiesCount} Depts`,
      badgeText: `${hospitalsCount} Hospitals`,
      subtext: 'Specialized clinical departments',
      href: '/doctors',
      icon: Layers,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="group relative bg-white rounded-[6px] border border-gray-100/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Header row: Uppercase label & Light Mint Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  {card.label}
                </span>
                <div className="w-8 h-8 rounded-[6px] bg-[#E8FAF2] text-[#00A86B] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Icon className="h-4 w-4 stroke-[2.2]" />
                </div>
              </div>

              {/* Metric Value & Dynamic Badge */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-gray-900">
                  {card.value}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#E8FAF2] text-[#00A86B]">
                  {card.badgeText}
                </span>
              </div>
            </div>

            {/* Bottom row: Real subtext & Right Arrow Link */}
            <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
              <span className="font-normal truncate pr-2">{card.subtext}</span>
              <Link
                href={card.href}
                className="text-gray-400 group-hover:text-gray-700 transition-colors p-1 -mr-1 shrink-0"
                aria-label={`View details for ${card.label}`}
              >
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
