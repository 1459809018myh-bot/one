import axios from 'axios';
import type { ApiResponse } from '@shared/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

// Goals API
export const goalsAPI = {
  getAll: (status?: string) =>
    api.get<any, ApiResponse>('/goals', { params: { status } }),

  getOne: (id: string) =>
    api.get<any, ApiResponse>(`/goals/${id}`),

  create: (data: any) =>
    api.post<any, ApiResponse>('/goals', data),

  update: (id: string, data: any) =>
    api.patch<any, ApiResponse>(`/goals/${id}`, data),

  delete: (id: string) =>
    api.delete<any, ApiResponse>(`/goals/${id}`),

  updateProgress: (id: string) =>
    api.patch<any, ApiResponse>(`/goals/${id}/progress`),
};

// Tasks API
export const tasksAPI = {
  getAll: (filters?: { goalId?: string; status?: string; date?: string }) =>
    api.get<any, ApiResponse>('/tasks', { params: filters }),

  create: (data: any) =>
    api.post<any, ApiResponse>('/tasks', data),

  update: (id: string, data: any) =>
    api.patch<any, ApiResponse>(`/tasks/${id}`, data),

  delete: (id: string) =>
    api.delete<any, ApiResponse>(`/tasks/${id}`),
};

// Study Sessions API
export const studyAPI = {
  createSession: (data: any) =>
    api.post<any, ApiResponse>('/study/sessions', data),

  getSessions: (filters?: { goalId?: string; from?: string; to?: string }) =>
    api.get<any, ApiResponse>('/study/sessions', { params: filters }),
};

// Quiz API
export const quizAPI = {
  create: (data: any) =>
    api.post<any, ApiResponse>('/quiz', data),

  submitAttempt: (id: string, data: any) =>
    api.post<any, ApiResponse>(`/quiz/${id}/attempts`, data),
};

// Stats API
export const statsAPI = {
  getDashboard: (from: string, to: string) =>
    api.get<any, ApiResponse>('/stats/dashboard', { params: { from, to } }),
};

// AI API
export const aiAPI = {
  generatePlan: (goal: any) =>
    api.post<any, ApiResponse>('/ai/plan', goal),

  generateQuiz: (options: any) =>
    api.post<any, ApiResponse>('/ai/quiz', options),

  reviewProgress: (data: any) =>
    api.post<any, ApiResponse>('/ai/review', data),

  getMotivation: (context: any) =>
    api.post<any, ApiResponse>('/ai/motivation', context),
};

// Settings API
export const settingsAPI = {
  get: () =>
    api.get<any, ApiResponse>('/settings'),

  update: (data: any) =>
    api.put<any, ApiResponse>('/settings', data),
};

export default api;
