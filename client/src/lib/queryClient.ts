import { QueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : '';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// API request function with authentication
export const apiRequest = async (
  method: string,
  url: string,
  data?: any,
  options: RequestInit = {}
) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (data && (method !== 'GET')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`${response.status}: ${errorData.error || response.statusText}`);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// Default query function for react-query
const defaultQueryFn = async ({ queryKey }: { queryKey: any[] }) => {
  const [url] = queryKey;
  return apiRequest('GET', url);
};

// Create query client with default configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 401 Unauthorized
        if (error?.message?.includes('401:')) return false;
        return failureCount < 3;
      },
    },
  },
});

// Auth utilities
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthError = (error: any): boolean => {
  return error?.message?.includes('401:');
};