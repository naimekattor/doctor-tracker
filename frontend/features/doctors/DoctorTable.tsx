'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Doctor } from '@/types/doctor';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDoctor } from '@/lib/api/doctors';
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building,
  AlertCircle,
} from 'lucide-react';

interface DoctorTableProps {
  doctors: Doctor[];
  onEditDoctor: (doctor: Doctor) => void;
}

export function DoctorTable({ doctors, onEditDoctor }: DoctorTableProps) {
  const queryClient = useQueryClient();
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setDoctorToDelete(null);
      setDeleteError(null);
    },
    onError: (err: any) => {
      setDeleteError(
        err?.message || 'Failed to delete doctor. Please reassign patients first.'
      );
    },
  });

  const handleConfirmDelete = () => {
    if (doctorToDelete) {
      deleteMutation.mutate(doctorToDelete._id);
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
            <TableHead>Doctor Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Hospital / Clinic</TableHead>
            <TableHead>Contact Information</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor._id}>
              <TableCell>
                <Link
                  href={`/doctors/${doctor._id}`}
                  className="font-semibold text-[#1C2D38] hover:text-[#00684A] hover:underline flex items-center gap-1.5"
                >
                  {doctor.name}
                </Link>
              </TableCell>

              <TableCell>
                <Badge variant="info">{doctor.specialization}</Badge>
              </TableCell>

              <TableCell className="text-[#5C768D]">
                <div className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-[#5C768D]/70 shrink-0" />
                  <span>{doctor.hospital}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-0.5 text-xs text-[#5C768D]">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-[#5C768D]/70" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="h-3 w-3 text-[#5C768D]/70" />
                    <span>{doctor.phone}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/doctors/${doctor._id}`}>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="View Doctor Profile & Patients"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => onEditDoctor(doctor)}
                    className="h-8 w-8 p-0 text-[#00684A] hover:text-[#00ED64]"
                    title="Edit Doctor Details"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDeleteError(null);
                      setDoctorToDelete(doctor);
                    }}
                    className="h-8 w-8 p-0 text-[#CF3B3B] hover:text-[#CF3B3B] hover:bg-[#CF3B3B]/10"
                    title="Delete Doctor"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      {doctorToDelete && (
        <ConfirmDialog
          isOpen={!!doctorToDelete}
          onClose={() => setDoctorToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Doctor Profile"
          message={`Are you sure you want to delete ${doctorToDelete.name}? Note: Doctors with assigned patients cannot be deleted until cases are reassigned.`}
          confirmLabel="Delete Doctor"
          isLoading={deleteMutation.isPending}
        />
      )}
    </>
  );
}
