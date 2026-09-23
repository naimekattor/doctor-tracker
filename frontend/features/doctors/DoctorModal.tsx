'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Doctor, DoctorInput } from '@/types/doctor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDoctor, updateDoctor } from '@/lib/api/doctors';
import { AlertCircle } from 'lucide-react';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorToEdit?: Doctor | null;
}

export function DoctorModal({ isOpen, onClose, doctorToEdit }: DoctorModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!doctorToEdit;

  const [formData, setFormData] = useState<DoctorInput>({
    name: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (doctorToEdit) {
      setFormData({
        name: doctorToEdit.name,
        specialization: doctorToEdit.specialization,
        hospital: doctorToEdit.hospital,
        phone: doctorToEdit.phone,
        email: doctorToEdit.email,
      });
    } else {
      setFormData({
        name: '',
        specialization: '',
        hospital: '',
        phone: '',
        email: '',
      });
    }
    setErrorMessage(null);
  }, [doctorToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: async (payload: DoctorInput) => {
      if (isEditing && doctorToEdit) {
        return updateDoctor(doctorToEdit._id, payload);
      }
      return createDoctor(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      if (doctorToEdit) {
        queryClient.invalidateQueries({ queryKey: ['doctor', doctorToEdit._id] });
      }
      onClose();
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Failed to save doctor information.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.name || !formData.specialization || !formData.hospital || !formData.phone || !formData.email) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Doctor Record' : 'Register New Doctor'}
      description={
        isEditing
          ? 'Update practitioner credentials, department, and contact details.'
          : 'Add a new medical professional to the healthcare tracking system.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#CF3B3B]/10 text-[#CF3B3B] text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        <Input
          label="Full Name"
          required
          placeholder="e.g. Dr. Sarah Jenkins"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Specialization"
            required
            placeholder="e.g. Cardiology"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />

          <Input
            label="Hospital / Clinic"
            required
            placeholder="e.g. City General Hospital"
            value={formData.hospital}
            onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="sjenkins@hospital.org"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Phone Number"
            type="tel"
            required
            placeholder="+1-555-0101"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E8EDEB]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            {isEditing ? 'Update Doctor' : 'Register Doctor'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
