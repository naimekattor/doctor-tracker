import { Patient } from './patient';

export interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
}

export interface SpecializationStat {
  specialization: string;
  count: number;
}

export interface GenderStat {
  gender: string;
  count: number;
}

export interface HospitalStat {
  hospital: string;
  count: number;
}

export interface TopDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  patientCount: number;
}

export interface DashboardStats {
  summary: DashboardSummary;
  specializationBreakdown: SpecializationStat[];
  genderBreakdown: GenderStat[];
  hospitalBreakdown: HospitalStat[];
  topDoctorsByPatients: TopDoctor[];
  recentPatients: Patient[];
}
