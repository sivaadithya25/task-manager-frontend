import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL?.trim();
const TOKEN_KEY = 'task_manager_token';

export const api = axios.create({
  baseURL: API_URL?.replace(/\/+$/, ''),
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (!API_URL) {
    return Promise.reject(new Error('VITE_API_URL is not configured. Set it to the deployed API base URL.'));
  }
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.startsWith('/tasks')) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('task_manager_user');
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  register: (details) => api.post('/auth/register', details),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const tasksApi = {
  list: () => api.get('/tasks'),
  get: (id) => api.get(`/tasks/${id}`),
  create: (task) => api.post('/tasks', task),
  update: (id, task) => api.put(`/tasks/${id}`, task),
  remove: (id) => api.delete(`/tasks/${id}`),
};

export function getErrorMessage(error) {
  if (error.message?.includes('VITE_API_URL is not configured')) {
    return error.message;
  }
  if (!error.response) {
    return 'Could not reach the Task Manager API. Check that the backend is running and VITE_API_URL is correct.';
  }
  return error.response.data?.message || 'Something went wrong. Please try again.';
}

export function getValidationMessages(error) {
  const errors = error.response?.data?.errors;
  return Array.isArray(errors) ? errors.map((item) => item.message).filter(Boolean) : [];
}

export { API_URL, TOKEN_KEY };
