'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics } from '@/lib/api/analytics';
import { Heading, Subheading } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { KpiCards } from '@/features/dashboard/KpiCards';
import { AnalyticsCharts } from '@/features/dashboard/AnalyticsCharts';
import { RecentPatientsList } from '@/features/dashboard/RecentPatientsList';
import { CardSkeleton } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { RefreshCw } from 'lucide-react';

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

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8EDEB]">
        <div>
          <Heading>Clinical Operations & Analytics</Heading>
          <Subheading>
            Real-time administrative metrics, practitioner capacities, and patient demographics
          </Subheading>
        </div>

        <Button
          variant="secondary"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto h-9 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </Button>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSkeleton />
            <CardSkeleton />
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
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* KPI Summary Cards */}
          <KpiCards summary={stats.summary} />

          {/* Visual Analytics Charts */}
          <AnalyticsCharts
            specializationBreakdown={stats.specializationBreakdown}
            genderBreakdown={stats.genderBreakdown}
            topDoctors={stats.topDoctorsByPatients}
          />

          {/* Recent Registrations Table */}
          <RecentPatientsList patients={stats.recentPatients} />
        </div>
      )}
    </div>
  );
}
