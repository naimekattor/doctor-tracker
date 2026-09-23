import { apiClient } from './client';
import { AuthResponse, LoginCredentials, User } from '@/types/auth';
import { ApiResponse } from '@/types/api';

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function getMeApi(token?: string): Promise<{ success: boolean; user: User }> {
  return apiClient<{ success: boolean; user: User }>('/auth/me', {
    method: 'GET',
    token,
  });
}
