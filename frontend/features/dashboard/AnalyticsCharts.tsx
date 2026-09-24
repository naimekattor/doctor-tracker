'use client';

import React, { useMemo, useState } from 'react';
import { Stethoscope, Users } from 'lucide-react';
import { SpecializationStat, GenderStat, TopDoctor } from '@/types/analytics';

interface AnalyticsChartsProps {
  specializationBreakdown: SpecializationStat[];
  genderBreakdown: GenderStat[];
  topDoctors: TopDoctor[];
  totalPatients?: number;
}

const BAR_COLORS = ['#00D084', '#0C2B24', '#14B8A6', '#059669', '#10B981', '#34D399'];

export function AnalyticsCharts({
  specializationBreakdown,
  genderBreakdown,
  topDoctors,
  totalPatients = 0,
}: AnalyticsChartsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalDoctorsInSpecialties = useMemo(() => {
    return specializationBreakdown.reduce((sum, item) => sum + item.count, 0);
  }, [specializationBreakdown]);

  const totalGenderPatients = useMemo(() => {
    const sum = genderBreakdown.reduce((acc, curr) => acc + curr.count, 0);
    return sum > 0 ? sum : totalPatients || 1;
  }, [genderBreakdown, totalPatients]);

  // Compute scale for Bar Chart
  const maxCount = useMemo(() => {
    const rawMax = Math.max(...specializationBreakdown.map((s) => s.count), 0);
    return Math.max(rawMax <= 4 ? 4 : Math.ceil(rawMax * 1.15), 4);
  }, [specializationBreakdown]);

  // Y-axis tick intervals (4 steps)
  const yTicks = useMemo(() => {
    const step = Math.ceil(maxCount / 4);
    return [step * 4, step * 3, step * 2, step, 0];
  }, [maxCount]);

  const effectiveMax = yTicks[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Card (2/3 width): Specialization Distribution */}
      <div className="lg:col-span-8 bg-white rounded-[6px] border border-gray-100/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          {/* Header Row: Metric & Mint Icon */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                DOCTORS BY SPECIALIZATION
              </span>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {totalDoctorsInSpecialties}{' '}
                  <span className="text-base sm:text-lg font-medium text-gray-500">Practitioners</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#E8FAF2] text-[#00A86B]">
                  {specializationBreakdown.length} Specialties
                </span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-[6px] bg-[#E8FAF2] text-[#00A86B] flex items-center justify-center">
              <Stethoscope className="h-5 w-5 stroke-[2]" />
            </div>
          </div>

          {/* Sub-toolbar with Legend */}
          <div className="mt-5 flex items-center justify-between gap-3 pb-2 border-b border-gray-50">
            <span className="text-xs text-gray-500 font-medium">
              Distribution of verified specialists across hospital departments
            </span>

            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00D084]" />
              <span>Specialist Count</span>
            </div>
          </div>
        </div>

        {/* High-Performance Native SVG Bar Chart */}
        <div className="h-64 sm:h-72 w-full mt-4 relative flex flex-col justify-end">
          {specializationBreakdown.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              No specialization data available
            </div>
          ) : (
            <div className="relative w-full h-full pt-4 pb-8 pl-8 pr-2">
              {/* Background Grid Lines & Y-Axis Labels */}
              <div className="absolute inset-0 top-4 bottom-8 left-8 right-2 flex flex-col justify-between pointer-events-none">
                {yTicks.map((val) => (
                  <div key={val} className="w-full flex items-center relative">
                    <span className="absolute -left-7 text-[10px] font-medium text-gray-400 w-5 text-right">
                      {val}
                    </span>
                    <div className="w-full border-b border-gray-100 border-dashed" />
                  </div>
                ))}
              </div>

              {/* Bars Container */}
              <div className="relative z-10 w-full h-full flex items-end justify-around gap-2 sm:gap-4">
                {specializationBreakdown.map((item, index) => {
                  const heightPercent =
                    effectiveMax > 0 ? Math.min(100, Math.max(4, (item.count / effectiveMax) * 100)) : 4;
                  const color = BAR_COLORS[index % BAR_COLORS.length];
                  const isHovered = hoveredIdx === index;

                  return (
                    <div
                      key={item.specialization}
                      className="relative flex-1 max-w-[52px] h-full flex flex-col justify-end items-center group cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(index)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onFocus={() => setHoveredIdx(index)}
                      onBlur={() => setHoveredIdx(null)}
                      tabIndex={0}
                      aria-label={`${item.specialization}: ${item.count} doctors`}
                    >
                      {/* Floating Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-12 z-30 bg-gray-900 text-white rounded-[6px] shadow-lg px-2.5 py-1.5 text-xs whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                          <span className="font-semibold block text-[11px] text-gray-200">
                            {item.specialization}
                          </span>
                          <span className="text-[#00D084] font-bold text-xs">
                            {item.count} {item.count === 1 ? 'Doctor' : 'Doctors'}
                          </span>
                          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                      )}

                      {/* Bar Rectangle */}
                      <div
                        className="w-full rounded-t-[5px] transition-all duration-200"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: color,
                          opacity: hoveredIdx !== null && !isHovered ? 0.65 : 1,
                          transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                          transformOrigin: 'bottom',
                        }}
                      />

                      {/* X-Axis Label */}
                      <div className="absolute -bottom-7 w-full text-center">
                        <span
                          title={item.specialization}
                          className={`block text-[11px] font-medium truncate transition-colors ${
                            isHovered ? 'text-gray-900 font-semibold' : 'text-gray-500'
                          }`}
                        >
                          {item.specialization.length > 9
                            ? `${item.specialization.slice(0, 8)}…`
                            : item.specialization}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Card (1/3 width): Dynamic Patient Demographics */}
      <div className="lg:col-span-4 bg-white rounded-[6px] border border-gray-100/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          {/* Header Row: Metric & Mint Icon */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                PATIENT DEMOGRAPHICS
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {totalPatients > 0 ? totalPatients.toLocaleString() : totalGenderPatients.toLocaleString()}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#E8FAF2] text-[#00A86B]">
                  Patients
                </span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-[6px] bg-[#E8FAF2] text-[#00A86B] flex items-center justify-center">
              <Users className="h-5 w-5 stroke-[2]" />
            </div>
          </div>

          {/* Dynamic Gender Breakdown Rows */}
          <div className="mt-6 divide-y divide-gray-100">
            {genderBreakdown.map((item) => {
              const pct = Math.round((item.count / totalGenderPatients) * 100) || 0;
              return (
                <div
                  key={item.gender}
                  className="py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors px-1 rounded-[6px]"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{item.gender} Patients</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{pct}% of admitted patients</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Additional clinical breakdown rows from top doctors */}
            {topDoctors.slice(0, Math.max(0, 4 - genderBreakdown.length)).map((doc) => (
              <div
                key={doc._id}
                className="py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors px-1 rounded-[6px]"
              >
                <div>
                  <p className="text-xs font-semibold text-gray-800">{doc.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{doc.specialization} • {doc.hospital}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {doc.patientCount} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom subtle note */}
        <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
          <span>Patient records verified</span>
          <span className="text-[#00A86B] font-semibold">Active Database</span>
        </div>
      </div>
    </div>
  );
}
