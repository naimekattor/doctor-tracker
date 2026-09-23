'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, deletePatient } from '@/lib/api/patients';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ConditionBadge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { PatientModal } from '@/features/patients/PatientModal';
import { TableSkeleton } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Patient } from '@/types/patient';
import { UserPlus, Trash2, Phone, Users } from 'lucide-react';

interface DoctorPatientListProps {
  doctorId: string;
  doctorName: string;
}

export function DoctorPatientList({ doctorId, doctorName }: DoctorPatientListProps) {
  const queryClient = useQueryClient();
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['patients', { doctor: doctorId }],
    queryFn: () => getPatients({ doctor: doctorId, limit: 50 }),
  });

  const patients = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (patientId: string) => deletePatient(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients', { doctor: doctorId }] });
      queryClient.invalidateQueries({ queryKey: ['doctor', doctorId] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setPatientToDelete(null);
    },
  });

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      deleteMutation.mutate(patientToDelete._id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-[#E8EDEB]">
        <div>
          <h2 className="text-lg font-semibold text-[#1C2D38]">Assigned Patients</h2>
          <p className="text-xs text-[#5C768D]">
            Currently active clinical cases under {doctorName} ({patients.length} assigned)
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddPatientModalOpen(true)}
          className="h-9 text-xs"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Assign Patient
        </Button>
      </div>

      {isLoading && <TableSkeleton rows={4} cols={5} />}

      {isError && (
        <ErrorState
          title="Could not load assigned patients"
          message={(error as any)?.message}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <>
          {patients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No patients currently assigned"
              description={`There are currently no active patients under ${doctorName}.`}
              actionLabel="Assign First Patient"
              onAction={() => setIsAddPatientModalOpen(true)}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Demographics</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Contact Phone</TableHead>
                  <TableHead>Admitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell className="font-medium text-[#1C2D38]">
                      {patient.name}
                    </TableCell>
                    <TableCell className="text-[#5C768D]">
                      {patient.age} yrs • {patient.gender}
                    </TableCell>
                    <TableCell>
                      <ConditionBadge condition={patient.condition} />
                    </TableCell>
                    <TableCell className="text-[#5C768D] font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-[#5C768D]/70" />
                        <span>{patient.contactPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#5C768D] text-xs">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => setPatientToDelete(patient)}
                        className="h-8 w-8 p-0 text-[#CF3B3B] hover:text-[#CF3B3B] hover:bg-[#CF3B3B]/10"
                        title="Remove Patient Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}

      {/* Assign Patient Modal */}
      <PatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        fixedDoctorId={doctorId}
      />

      {/* Delete Patient Confirmation Modal */}
      {patientToDelete && (
        <ConfirmDialog
          isOpen={!!patientToDelete}
          onClose={() => setPatientToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Remove Patient Record"
          message={`Are you sure you want to remove ${patientToDelete.name} from ${doctorName}'s care?`}
          confirmLabel="Remove Patient"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
