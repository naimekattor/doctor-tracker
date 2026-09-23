'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Patient } from '@/types/patient';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePatient } from '@/lib/api/patients';
import { Edit2, Trash2, Phone, Stethoscope, AlertCircle } from 'lucide-react';

interface PatientTableProps {
  patients: Patient[];
  onEditPatient: (patient: Patient) => void;
}

export function PatientTable({ patients, onEditPatient }: PatientTableProps) {
  const queryClient = useQueryClient();
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setPatientToDelete(null);
      setDeleteError(null);
    },
    onError: (err: any) => {
      setDeleteError(err?.message || 'Failed to delete patient record.');
    },
  });

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      deleteMutation.mutate(patientToDelete._id);
    }
  };

  return (
    <>
      {deleteError && (
        <div className="mb-4 flex items-center justify-between p-3.5 rounded-lg bg-[#CF3B3B]/10 border border-[#CF3B3B]/20 text-[#CF3B3B] text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{deleteError}</span>
          </div>
          <button
            onClick={() => setDeleteError(null)}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Demographics</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Contact Phone</TableHead>
            <TableHead>Assigned Doctor</TableHead>
            <TableHead>Admitted Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const doc = typeof patient.doctor === 'object' ? patient.doctor : null;

            return (
              <TableRow key={patient._id}>
                <TableCell className="font-semibold text-[#1C2D38]">
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

                <TableCell>
                  {doc ? (
                    <Link
                      href={`/doctors/${doc._id}`}
                      className="inline-flex items-center gap-1.5 font-medium text-[#00684A] hover:underline"
                    >
                      <Stethoscope className="h-3.5 w-3.5 text-[#00ED64]" />
                      <span>{doc.name}</span>
                    </Link>
                  ) : (
                    <span className="text-[#5C768D] italic">Unassigned</span>
                  )}
                </TableCell>

                <TableCell className="text-[#5C768D] text-xs">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      onClick={() => onEditPatient(patient)}
                      className="h-8 w-8 p-0 text-[#00684A] hover:text-[#00ED64]"
                      title="Edit Patient Details"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDeleteError(null);
                        setPatientToDelete(patient);
                      }}
                      className="h-8 w-8 p-0 text-[#CF3B3B] hover:text-[#CF3B3B] hover:bg-[#CF3B3B]/10"
                      title="Delete Patient Record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Delete Patient Confirmation Modal */}
      {patientToDelete && (
        <ConfirmDialog
          isOpen={!!patientToDelete}
          onClose={() => setPatientToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Patient Record"
          message={`Are you sure you want to permanently delete the patient record for ${patientToDelete.name}?`}
          confirmLabel="Delete Patient"
          isLoading={deleteMutation.isPending}
        />
      )}
    </>
  );
}
