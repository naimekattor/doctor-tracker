'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { SpecializationStat, GenderStat, TopDoctor } from '@/types/analytics';

interface AnalyticsChartsProps {
  specializationBreakdown: SpecializationStat[];
  genderBreakdown: GenderStat[];
  topDoctors: TopDoctor[];
}

const GENDER_COLORS: Record<string, string> = {
  Male: '#00684A',
  Female: '#00ED64',
  Other: '#E68B00',
};

export function AnalyticsCharts({
  specializationBreakdown,
  genderBreakdown,
  topDoctors,
}: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Specialization Distribution Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Doctors by Specialization</CardTitle>
          <p className="text-xs text-[#5C768D]">Distribution of specialists across the hospital network</p>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={specializationBreakdown}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <XAxis
                  dataKey="specialization"
                  tick={{ fill: '#5C768D', fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#5C768D', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#001E2B',
                    borderColor: '#023430',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#00ED64' }}
                />
                <Bar dataKey="count" name="Doctors" fill="#00684A" radius={[4, 4, 0, 0]}>
                  {specializationBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? '#00684A' : '#00ED64'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gender Distribution Pie Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Patient Demographics by Gender</CardTitle>
          <p className="text-xs text-[#5C768D]">Gender ratio across admitted and registered patients</p>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderBreakdown}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  label={({ name, percent }) =>
                    `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : 0}%`
                  }
                >
                  {genderBreakdown.map((entry) => (
                    <Cell
                      key={`gender-${entry.gender}`}
                      fill={GENDER_COLORS[entry.gender] || '#5C768D'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#001E2B',
                    borderColor: '#023430',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: '12px', color: '#5C768D' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Doctors by Patient Load */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Top Doctors by Patient Load</CardTitle>
          <p className="text-xs text-[#5C768D]">Practitioners currently managing the highest patient cases</p>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topDoctors}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <XAxis type="number" allowDecimals={false} tick={{ fill: '#5C768D', fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: '#1C2D38', fontSize: 12, fontWeight: 500 }}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#001E2B',
                    borderColor: '#023430',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val, name, item) => [
                    `${val} patients (${item.payload.specialization} - ${item.payload.hospital})`,
                    'Assigned Cases',
                  ]}
                />
                <Bar
                  dataKey="patientCount"
                  name="Assigned Patients"
                  fill="#00ED64"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
