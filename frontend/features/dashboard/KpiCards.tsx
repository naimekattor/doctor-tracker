'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Stethoscope, Users, UserCheck } from 'lucide-react';
import { DashboardSummary } from '@/types/analytics';

interface KpiCardsProps {
  summary: DashboardSummary;
}

export function KpiCards({ summary }: KpiCardsProps) {
  const { totalDoctors, totalPatients } = summary;
  const avgPatientsPerDoctor =
    totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : '0';

  const metrics = [
    {
      label: 'Total Doctors',
      value: totalDoctors,
      subtext: 'Active verified medical practitioners',
      icon: Stethoscope,
      accentColor: 'text-[#00684A] bg-[#00ED64]/20',
      borderColor: 'border-l-4 border-l-[#00ED64]',
    },
    {
      label: 'Total Patients',
      value: totalPatients,
      subtext: 'Under clinical tracking and care',
      icon: Users,
      accentColor: 'text-[#001E2B] bg-[#E8EDEB]',
      borderColor: 'border-l-4 border-l-[#001E2B]',
    },
    {
      label: 'Avg Patients per Doctor',
      value: avgPatientsPerDoctor,
      subtext: 'Current practitioner workload ratio',
      icon: UserCheck,
      accentColor: 'text-[#E68B00] bg-[#E68B00]/15',
      borderColor: 'border-l-4 border-l-[#E68B00]',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.label}
            className={`p-6 transition-all hover:shadow-md ${metric.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C768D]">
                  {metric.label}
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#1C2D38]">
                  {metric.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${metric.accentColor}`}>
                <Icon className="h-6 w-6 stroke-[2]" />
              </div>
            </div>
            <p className="mt-3 text-xs text-[#5C768D]">{metric.subtext}</p>
          </Card>
        );
      })}
    </div>
  );
}
