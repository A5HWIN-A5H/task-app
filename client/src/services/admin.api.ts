import { api } from './api';

export interface SystemStats {
  totalUsers: number;
  totalTasks: number;
  statusCounts: {
    TODO: number;
    IN_PROGRESS: number;
    COMPLETED: number;
  };
}

export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const adminApi = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data as SystemStats;
  },
  
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data.data.users as UserDetails[];
  },

  toggleUserStatus: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  }
};