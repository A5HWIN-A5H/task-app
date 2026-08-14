import { api } from './api';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  createdAt: string;
}

export interface FetchTasksParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export type TaskInput = {
  title: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
};

export const taskApi = {
  getTasks: async (params?: FetchTasksParams) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },
  
  createTask: async (data: TaskInput) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async ({ id, data }: { id: string; data: Partial<TaskInput> }) => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },
  
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};