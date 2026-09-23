import { getAuthToken } from '../auth/cookies';
import { ApiFieldError } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  statusCode: number;
  errors?: ApiFieldError[];

  constructor(message: string, statusCode: number, errors?: ApiFieldError[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, params, headers, ...customConfig } = options;

  // Build query string if params are provided
  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Resolve auth token (from option or cookie)
  const authToken = token || (typeof window !== 'undefined' ? getAuthToken() : undefined);

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: requestHeaders,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.errors);
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'An unexpected network error occurred';
    throw new ApiError(message, 0);
  }
}
