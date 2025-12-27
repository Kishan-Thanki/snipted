import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Required to send/receive cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to extract cookie values manually
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// Request Interceptor: Attach CSRF token to every mutating request
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrf_token');
  if (csrfToken && config.headers) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling (e.g., redirect to login on 401 if session expires)
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Optional: useAuth.getState().logout()
    }
    return Promise.reject(error);
  }
);