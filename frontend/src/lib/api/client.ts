import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const nameLenPlus = (name.length + 1);
  return document.cookie
    .split(';')
    .map(c => c.trim())
    .filter(cookie => {
      return cookie.substring(0, nameLenPlus) === `${name}=`;
    })
    .map(cookie => {
      return decodeURIComponent(cookie.substring(nameLenPlus));
    })[0] || null;
};

api.interceptors.request.use((config) => {
  const token = getCookie('csrf_token');

  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }

  return config;
});