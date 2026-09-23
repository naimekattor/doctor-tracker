'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '@/lib/api/doctors';
import { Heading, Subheading } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { DoctorFilters } from '@/features/doctors/DoctorFilters';
import { DoctorTable } from '@/features/doctors/DoctorTable';
import { DoctorModal } from '@/features/doctors/DoctorModal';
import { Pagination } from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Doctor } from '@/types/doctor';
import { Plus, Stethoscope } from 'lucide-react';

function DoctorsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  // Extract query parameters from URL
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
  const search = searchParams.get('search') || undefined;
  const specialization = searchParams.get('specialization') || undefined;
  const hospital = searchParams.get('hospital') || undefined;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['doctors', { page, limit, search, specialization, hospital }],
    queryFn: () => getDoctors({ page, limit, search, specialization, hospital }),
  });

  const doctors = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Extract distinct specializations and hospitals for filtering options
  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization).filter(Boolean))
  );
  const hospitals = Array.from(
    new Set(doctors.map((d) => d.hospital).filter(Boolean))
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', String(newLimit));
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOpenAddModal = () => {
    setDoctorToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8EDEB]">
        <div>
          <Heading>Doctors Directory</Heading>
          <Subheading>
            Manage hospital staff credentials, clinical specialties, and patient case loads
          </Subheading>
        </div>

        <Button variant="primary" onClick={handleOpenAddModal} className="shrink-0 shadow-xs">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Doctor
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <DoctorFilters specializations={specializations} hospitals={hospitals} />

      {/* Loading Skeleton */}
      {isLoading && <TableSkeleton rows={8} cols={5} />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to Load Doctors"
          message={(error as any)?.message || 'Unable to retrieve doctors directory.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <>
          {doctors.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="No doctors found"
              description={
                search || specialization || hospital
                  ? 'No practitioners match your active filter criteria. Try adjusting or clearing filters.'
                  : 'Start by registering the first doctor in the healthcare system.'
              }
              actionLabel={search || specialization || hospital ? 'Clear Filters' : 'Add First Doctor'}
              onAction={
                search || specialization || hospital
                  ? () => router.push(pathname)
                  : handleOpenAddModal
              }
            />
          ) : (
            <div className="space-y-4">
              <DoctorTable doctors={doctors} onEditDoctor={handleOpenEditModal} />

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalRecords={total}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </div>
          )}
        </>
      )}

      {/* Add / Edit Doctor Modal */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctorToEdit={doctorToEdit}
      />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={8} cols={5} />}>
      <DoctorsContent />
    </Suspense>
  );
}
