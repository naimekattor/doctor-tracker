'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getPatients } from '@/lib/api/patients';
import { getDoctors } from '@/lib/api/doctors';
import { Heading, Subheading } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { PatientFilters } from '@/features/patients/PatientFilters';
import { PatientTable } from '@/features/patients/PatientTable';
import { PatientModal } from '@/features/patients/PatientModal';
import { Pagination } from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Patient } from '@/types/patient';
import { Plus, Users } from 'lucide-react';

function PatientsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  // Extract query parameters from URL
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
  const search = searchParams.get('search') || undefined;
  const condition = searchParams.get('condition') || undefined;
  const gender = searchParams.get('gender') || undefined;
  const doctor = searchParams.get('doctor') || undefined;

  // Query patients
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['patients', { page, limit, search, condition, gender, doctor }],
    queryFn: () => getPatients({ page, limit, search, condition, gender, doctor }),
  });

  // Query doctors for filter dropdown
  const { data: doctorsData } = useQuery({
    queryKey: ['doctors', 'filterList'],
    queryFn: () => getDoctors({ limit: 100 }),
  });

  const patients = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const doctors = doctorsData?.data || [];

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
    setPatientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsModalOpen(true);
  };

  const hasActiveFilters = Boolean(search || condition || gender || doctor);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8EDEB]">
        <div>
          <Heading>Patients Directory</Heading>
          <Subheading>
            Track patient admissions, clinical observations, and physician assignments
          </Subheading>
        </div>

        <Button variant="primary" onClick={handleOpenAddModal} className="shrink-0 shadow-xs">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Patient
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <PatientFilters doctors={doctors} />

      {/* Loading Skeleton */}
      {isLoading && <TableSkeleton rows={8} cols={6} />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to Load Patients"
          message={(error as any)?.message || 'Unable to retrieve patients directory.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <>
          {patients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No patients found"
              description={
                hasActiveFilters
                  ? 'No patient records match your active search or filter criteria. Try adjusting or clearing filters.'
                  : 'Start by enrolling the first patient into the healthcare management system.'
              }
              actionLabel={hasActiveFilters ? 'Clear Filters' : 'Add First Patient'}
              onAction={
                hasActiveFilters
                  ? () => router.push(pathname)
                  : handleOpenAddModal
              }
            />
          ) : (
            <div className="space-y-4">
              <PatientTable
                patients={patients}
                onEditPatient={handleOpenEditModal}
              />

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

      {/* Add / Edit Patient Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientToEdit={patientToEdit}
      />
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={8} cols={6} />}>
      <PatientsContent />
    </Suspense>
  );
}
