import { apiClient } from './client';
import { Doctor, DoctorDetail, DoctorInput, DoctorQueryParams } from '@/types/doctor';
import { PaginatedResponse, ApiResponse } from '@/types/api';

export async function getDoctors(params?: DoctorQueryParams): Promise<PaginatedResponse<Doctor>> {
  return apiClient<PaginatedResponse<Doctor>>('/doctors', {
    method: 'GET',
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getDoctorById(id: string): Promise<ApiResponse<DoctorDetail>> {
  return apiClient<ApiResponse<DoctorDetail>>(`/doctors/${id}`, {
    method: 'GET',
  });
}

export async function createDoctor(data: DoctorInput): Promise<ApiResponse<Doctor>> {
  return apiClient<ApiResponse<Doctor>>('/doctors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDoctor(id: string, data: Partial<DoctorInput>): Promise<ApiResponse<Doctor>> {
  return apiClient<ApiResponse<Doctor>>(`/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDoctor(id: string): Promise<ApiResponse<void>> {
  return apiClient<ApiResponse<void>>(`/doctors/${id}`, {
    method: 'DELETE',
  });
}
