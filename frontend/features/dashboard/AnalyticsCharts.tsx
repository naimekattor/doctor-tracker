'use client';

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  Stethoscope,
  Users,
} from 'lucide-react';
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
  const totalDoctorsInSpecialties = useMemo(() => {
    return specializationBreakdown.reduce((sum, item) => sum + item.count, 0);
  }, [specializationBreakdown]);

  const totalGenderPatients = useMemo(() => {
    const sum = genderBreakdown.reduce((acc, curr) => acc + curr.count, 0);
    return sum > 0 ? sum : totalPatients || 1;
  }, [genderBreakdown, totalPatients]);

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

        {/* Dynamic Specialization Bar Chart */}
        <div className="h-64 sm:h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={specializationBreakdown}
              margin={{ top: 15, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F3F2" />
              <XAxis
                dataKey="specialization"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as SpecializationStat;
                    return (
                      <div className="bg-white rounded-[6px] shadow-lg border border-gray-100 p-3 text-xs min-w-[160px]">
                        <span className="font-semibold text-gray-800 block pb-1 border-b border-gray-100">
                          {data.specialization}
                        </span>
                        <div className="mt-1.5 flex items-center justify-between text-[#00A86B] font-bold">
                          <span>Doctors:</span>
                          <span>{data.count}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" name="Doctors" radius={[6, 6, 0, 0]} maxBarSize={45}>
                {specializationBreakdown.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
