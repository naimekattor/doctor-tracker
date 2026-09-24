'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics } from '@/lib/api/analytics';
import { DashboardHeader } from '@/features/dashboard/DashboardHeader';
import { KpiCards } from '@/features/dashboard/KpiCards';
import { TopDoctorCard } from '@/features/dashboard/TopDoctorCard';
import { RecentPatientsList } from '@/features/dashboard/RecentPatientsList';
import { AnalyticsCharts } from '@/features/dashboard/AnalyticsCharts';
import { CardSkeleton } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: getDashboardAnalytics,
  });

  const stats = data?.data;

  const avgPatientsPerDoctor =
    stats?.summary && stats.summary.totalDoctors > 0
      ? (stats.summary.totalPatients / stats.summary.totalDoctors).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Top Header: Title, Real Team Stack, Info Diagnostics, Bell, Export Button */}
      <DashboardHeader stats={stats} onRefresh={() => refetch()} />

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8"><CardSkeleton /></div>
            <div className="lg:col-span-4"><CardSkeleton /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4"><CardSkeleton /></div>
            <div className="lg:col-span-8"><CardSkeleton /></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to Load Dashboard Analytics"
          message={
            (error as any)?.message ||
            'Unable to communicate with the analytics service. Please verify backend connectivity.'
          }
          onRetry={() => refetch()}
        />
      )}

      {/* Analytics Loaded State */}
      {stats && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top 4 KPI Summary Cards with 100% Real Dynamic Data */}
          <KpiCards stats={stats} />

          {/* Middle Section: 2/3 Doctors by Specialization + 1/3 Patient Demographics */}
          <AnalyticsCharts
            specializationBreakdown={stats.specializationBreakdown}
            genderBreakdown={stats.genderBreakdown}
            topDoctors={stats.topDoctorsByPatients}
            totalPatients={stats.summary.totalPatients}
          />

          {/* Bottom Section: 1/3 Top Practitioner Overview + 2/3 Real Recent Patients Admissions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 flex flex-col">
              <TopDoctorCard
                topDoctor={stats.topDoctorsByPatients?.[0]}
                avgPatientsPerDoctor={avgPatientsPerDoctor}
              />
            </div>
            <div className="lg:col-span-8 flex flex-col">
              <RecentPatientsList
                patients={stats.recentPatients}
                totalPatientsCount={stats.summary.totalPatients}
                onRefresh={() => refetch()}
                isRefreshing={isFetching}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
