'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getDoctorById } from '@/lib/api/doctors';
import { Heading, Subheading } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DoctorModal } from '@/features/doctors/DoctorModal';
import { DoctorPatientList } from '@/features/doctors/DoctorPatientList';
import { CardSkeleton } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import {
  ChevronLeft,
  Edit2,
  Mail,
  Phone,
  Building,
  Users,
  Calendar,
} from 'lucide-react';

interface DoctorDetailViewProps {
  id: string;
}

export function DoctorDetailView({ id }: DoctorDetailViewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => getDoctorById(id),
  });

  const doctor = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="space-y-4">
        <Link href="/doctors" className="inline-flex items-center text-xs text-[#5C768D] hover:text-[#1C2D38]">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Doctors Directory
        </Link>
        <ErrorState
          title="Doctor Not Found"
          message={(error as any)?.message || 'Unable to locate practitioner details.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/doctors"
          className="inline-flex items-center text-sm font-medium text-[#5C768D] hover:text-[#1C2D38] transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Doctors Directory
        </Link>

        <Button
          variant="secondary"
          onClick={() => setIsEditModalOpen(true)}
          className="h-9 text-xs"
        >
          <Edit2 className="h-3.5 w-3.5 mr-1.5" />
          Edit Profile
        </Button>
      </div>

      {/* Doctor Profile Summary Card */}
      <Card className="border-t-4 border-t-[#00ED64]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Heading as="h1" className="text-2xl">
                  {doctor.name}
                </Heading>
                <Badge variant="info">{doctor.specialization}</Badge>
              </div>
              <Subheading className="mt-1 flex items-center gap-1.5 text-sm">
                <Building className="h-4 w-4 text-[#5C768D]" />
                {doctor.hospital}
              </Subheading>
            </div>

            {/* Total Patient Load Badge */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F9FBFA] border border-[#E8EDEB]">
              <div className="p-2 rounded-lg bg-[#00ED64]/20 text-[#00684A]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#5C768D]">
                  Active Patients
                </p>
                <p className="text-xl font-bold text-[#1C2D38]">
                  {doctor.patientCount ?? 0}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E8EDEB] text-sm text-[#5C768D]">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#5C768D]" />
              <span className="font-medium text-[#1C2D38]">{doctor.email}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <Phone className="h-4 w-4 text-[#5C768D]" />
              <span className="font-medium text-[#1C2D38]">{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-4 w-4 text-[#5C768D]" />
              <span>Registered on {new Date(doctor.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor's Assigned Patients List */}
      <DoctorPatientList doctorId={doctor._id} doctorName={doctor.name} />

      {/* Edit Doctor Dialog */}
      <DoctorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        doctorToEdit={doctor}
      />
    </div>
  );
}
