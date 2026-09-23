import React from 'react';
import { DoctorDetailView } from '@/features/doctors/DoctorDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doctor Profile | Doctor Tracker',
  description: 'View doctor credentials, assigned patients and care management',
};

interface DoctorPageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const { id } = await params;
  return <DoctorDetailView id={id} />;
}
