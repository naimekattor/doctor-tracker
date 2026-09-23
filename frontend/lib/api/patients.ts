import { apiClient } from './client';
import { Patient, PatientInput, PatientQueryParams } from '@/types/patient';
import { PaginatedResponse, ApiResponse } from '@/types/api';

export async function getPatients(params?: PatientQueryParams): Promise<PaginatedResponse<Patient>> {
  return apiClient<PaginatedResponse<Patient>>('/patients', {
    method: 'GET',
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getPatientById(id: string): Promise<ApiResponse<Patient>> {
  return apiClient<ApiResponse<Patient>>(`/patients/${id}`, {
    method: 'GET',
  });
}

export async function createPatient(data: PatientInput): Promise<ApiResponse<Patient>> {
  return apiClient<ApiResponse<Patient>>('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePatient(id: string, data: Partial<PatientInput>): Promise<ApiResponse<Patient>> {
  return apiClient<ApiResponse<Patient>>(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePatient(id: string): Promise<ApiResponse<void>> {
  return apiClient<ApiResponse<void>>(`/patients/${id}`, {
    method: 'DELETE',
  });
}
