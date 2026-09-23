'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Patient, PatientInput, PatientCondition, PatientGender } from '@/types/patient';
import { Doctor } from '@/types/doctor';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createPatient, updatePatient } from '@/lib/api/patients';
import { getDoctors } from '@/lib/api/doctors';
import { AlertCircle } from 'lucide-react';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientToEdit?: Patient | null;
  fixedDoctorId?: string; // When opening from doctor profile
}

const CONDITIONS: PatientCondition[] = [
  'Stable',
  'Critical',
  'Under Observation',
  'Recovered',
  'Chronic',
  'Routine Checkup',
];

const GENDERS: PatientGender[] = ['Male', 'Female', 'Other'];

export function PatientModal({
  isOpen,
  onClose,
  patientToEdit,
  fixedDoctorId,
}: PatientModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!patientToEdit;

  // Fetch available doctors for selection if not fixed
  const { data: doctorsData } = useQuery({
    queryKey: ['doctors', 'all'],
    queryFn: () => getDoctors({ limit: 100 }),
    enabled: isOpen && !fixedDoctorId,
  });

  const doctorsList = doctorsData?.data || [];

  const [formData, setFormData] = useState<PatientInput>({
    name: '',
    age: 30,
    gender: 'Male',
    condition: 'Stable',
    contactPhone: '',
    doctor: fixedDoctorId || '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (patientToEdit) {
      const docId =
        typeof patientToEdit.doctor === 'object'
          ? patientToEdit.doctor._id
          : patientToEdit.doctor;

      setFormData({
        name: patientToEdit.name,
        age: patientToEdit.age,
        gender: patientToEdit.gender,
        condition: patientToEdit.condition,
        contactPhone: patientToEdit.contactPhone,
        doctor: docId || fixedDoctorId || '',
      });
    } else {
      setFormData({
        name: '',
        age: 30,
        gender: 'Male',
        condition: 'Stable',
        contactPhone: '',
        doctor: fixedDoctorId || '',
      });
    }
    setErrorMessage(null);
  }, [patientToEdit, fixedDoctorId, isOpen]);

  const mutation = useMutation({
    mutationFn: async (payload: PatientInput) => {
      if (isEditing && patientToEdit) {
        return updatePatient(patientToEdit._id, payload);
      }
      return createPatient(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      if (fixedDoctorId) {
        queryClient.invalidateQueries({ queryKey: ['doctor', fixedDoctorId] });
      }
      onClose();
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Failed to save patient information.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name || !formData.contactPhone || !formData.doctor) {
      setErrorMessage('Please complete all required fields and ensure a doctor is assigned.');
      return;
    }

    mutation.mutate({
      ...formData,
      age: Number(formData.age),
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Patient Record' : 'Register & Assign Patient'}
      description={
        isEditing
          ? 'Update medical condition, age, contact, or assigned physician.'
          : 'Enroll a patient into the care system and assign to a practitioner.'
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
          placeholder="e.g. Liam Smith"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            min={0}
            max={125}
            required
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
          />

          <Select
            label="Gender"
            required
            value={formData.gender}
            options={GENDERS.map((g) => ({ label: g, value: g }))}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value as PatientGender })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Clinical Condition"
            required
            value={formData.condition}
            options={CONDITIONS.map((c) => ({ label: c, value: c }))}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value as PatientCondition })
            }
          />

          <Input
            label="Contact Phone"
            type="tel"
            required
            placeholder="+1-555-1024"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          />
        </div>

        {!fixedDoctorId && (
          <div>
            <label className="text-sm font-medium text-[#1C2D38] block mb-1.5">
              Assigned Doctor <span className="text-[#CF3B3B]">*</span>
            </label>
            <select
              required
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              className="h-[40px] w-full rounded-[6px] border border-[#E8EDEB] bg-white px-3 py-2 text-[14px] text-[#1C2D38] focus:border-[#00684A] focus:outline-none focus:ring-2 focus:ring-[#00ED64]/25 cursor-pointer"
            >
              <option value="">Select a Doctor</option>
              {doctorsList.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} — {doc.specialization} ({doc.hospital})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E8EDEB]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            {isEditing ? 'Save Changes' : 'Register Patient'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
