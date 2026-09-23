import { apiClient } from './client';
import { DashboardStats } from '@/types/analytics';
import { ApiResponse } from '@/types/api';

export async function getDashboardAnalytics(): Promise<ApiResponse<DashboardStats>> {
  return apiClient<ApiResponse<DashboardStats>>('/analytics', {
    method: 'GET',
  });
}
