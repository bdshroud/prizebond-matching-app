import {
  IUser,
  IPrizeBond,
  IDraw,
  IWinningNumber,
  IMatch,
  INotification,
  IDashboardStats
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : '/api';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pb_token');
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('pb_token', token);
  } else {
    localStorage.removeItem('pb_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Auth
  auth: {
    register: (body: any) => request<{ token: string; user: IUser }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: any) => request<{ token: string; user: IUser }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => request<IUser>('/auth/me'),
    updateProfile: (body: any) => request<IUser>('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
    changePassword: (body: any) => request<{ success: boolean; message: string }>('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),
    forgotPassword: (email: string) => request<{ success: boolean; message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (body: any) => request<{ success: boolean; message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
    verifyEmail: (token: string) => request<{ success: boolean; message: string }>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) })
  },

  // Bonds
  bonds: {
    list: (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') searchParams.append(k, String(v));
      });
      return request<{ bonds: IPrizeBond[]; total: number; page: number; limit: number; totalPages: number }>(`/bonds?${searchParams.toString()}`);
    },
    getById: (id: string) => request<IPrizeBond>(`/bonds/${id}`),
    add: (body: any) => request<IPrizeBond>('/bonds', { method: 'POST', body: JSON.stringify(body) }),
    bulkAdd: (bonds: any[]) => request<{ addedCount: number; duplicateCount: number; errors: string[] }>('/bonds/bulk', { method: 'POST', body: JSON.stringify({ bonds }) }),
    update: (id: string, body: any) => request<IPrizeBond>(`/bonds/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request<{ success: boolean }>(`/bonds/${id}`, { method: 'DELETE' }),
    deleteMany: (ids: string[]) => request<{ success: boolean; deletedCount: number }>('/bonds', { method: 'DELETE', body: JSON.stringify({ ids }) }),
    importCSV: async (file: File) => {
      const token = getStoredToken();
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/bonds/import-csv`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Import failed');
      return data.data;
    },
    exportCSVUrl: () => `${API_BASE}/bonds/export-csv`
  },

  // Draws
  draws: {
    list: (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') searchParams.append(k, String(v));
      });
      return request<{ draws: IDraw[]; total: number; page: number; limit: number; totalPages: number }>(`/draws?${searchParams.toString()}`);
    },
    getById: (id: string) => request<{ draw: IDraw; winningNumbers: IWinningNumber[]; winnerCount: number }>(`/draws/${id}`),
    create: (body: any) => request<IDraw>('/draws', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request<IDraw>(`/draws/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request<{ success: boolean }>(`/draws/${id}`, { method: 'DELETE' }),
    addWinningNumbers: (id: string, winningNumbers: any[]) => request<{ success: boolean; addedCount: number }>(`/draws/${id}/winning-numbers`, { method: 'POST', body: JSON.stringify({ winningNumbers }) }),
    publish: (id: string) => request<{ success: boolean; draw: IDraw; matchingResult: any }>(`/draws/${id}/publish`, { method: 'POST' }),
    triggerMatch: (id: string) => request<{ success: boolean; message: string; data: any }>(`/draws/${id}/trigger-match`, { method: 'POST' })
  },

  // Matching
  matching: {
    checkInstant: (body: { numbers: string[]; series?: string; drawId?: string }) =>
      request<{
        wins: Array<{
          bondNumber: string;
          series: string;
          prizeCategory: string;
          prizeAmount: number;
          estimatedTax: number;
          estimatedNet: number;
          drawId: string;
          drawNumber: string;
          drawDate: string;
          description: string;
        }>;
        checkedNumbers: string[];
        totalChecked: number;
        totalWins: number;
        totalGross: number;
        totalTax: number;
        totalNet: number;
        message?: string;
      }>('/matching/check', { method: 'POST', body: JSON.stringify(body) }),
    getHistory: (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') searchParams.append(k, String(v));
      });
      return request<{
        matches: IMatch[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        summary: { totalGross: number; totalNet: number };
      }>(`/matching/history?${searchParams.toString()}`);
    },
    getById: (id: string) => request<IMatch>(`/matching/history/${id}`)
  },

  // Notifications
  notifications: {
    list: (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) searchParams.append(k, String(v));
      });
      return request<{ notifications: INotification[]; total: number; unreadCount: number }>(`/notifications?${searchParams.toString()}`);
    },
    markAsRead: (id: string) => request<INotification>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: () => request<{ success: boolean }>('/notifications/read-all', { method: 'PUT' }),
    delete: (id: string) => request<{ success: boolean }>(`/notifications/${id}`, { method: 'DELETE' })
  },

  // Dashboard
  dashboard: {
    getStats: () => request<IDashboardStats>('/dashboard/stats')
  },

  // Admin
  admin: {
    getStats: () => request<any>('/admin/stats'),
    getUsers: (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') searchParams.append(k, String(v));
      });
      return request<any>(`/admin/users?${searchParams.toString()}`);
    },
    updateUserRole: (userId: string, role: string) => request<any>(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    getJobs: (params: Record<string, any> = {}) => request<any>('/admin/jobs'),
    runMatchingJob: (drawId: string) => request<any>('/admin/jobs/run-matcher', { method: 'POST', body: JSON.stringify({ drawId }) }),
    getEmailLogs: (params: Record<string, any> = {}) => request<any>('/admin/email-logs'),
    retryEmail: (id: string) => request<any>(`/admin/email-logs/${id}/retry`, { method: 'POST' }),
    getAuditLogs: (params: Record<string, any> = {}) => request<any>('/admin/audit-logs')
  }
};
