import { request } from '@umijs/max';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'feature' | 'bug' | 'task' | 'improvement';
  assigneeId?: string;
  reporterId: string;
  projectId: string;
  sprintId?: string;
  labels?: string[];
  storyPoints?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskParams {
  title: string;
  description?: string;
  type: 'feature' | 'bug' | 'task' | 'improvement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  assigneeId?: string;
  sprintId?: string;
  labels?: string[];
  storyPoints?: number;
  dueDate?: string;
}

export interface UpdateTaskParams {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  type?: 'feature' | 'bug' | 'task' | 'improvement';
  assigneeId?: string;
  sprintId?: string;
  labels?: string[];
  storyPoints?: number;
  dueDate?: string;
}

// 获取任务列表
export async function getTasks(params?: {
  page?: number;
  pageSize?: number;
  projectId?: string;
  sprintId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  type?: string;
}) {
  return request<{
    success: boolean;
    data?: {
      list: Task[];
      total: number;
    };
    message?: string;
  }>('/api/tasks', {
    method: 'GET',
    params,
  });
}

// 获取任务详情
export async function getTask(id: string) {
  return request<{
    success: boolean;
    data?: Task;
    message?: string;
  }>(`/api/tasks/${id}`, {
    method: 'GET',
  });
}

// 创建任务
export async function createTask(params: CreateTaskParams) {
  return request<{
    success: boolean;
    data?: Task;
    message?: string;
  }>('/api/tasks', {
    method: 'POST',
    data: params,
  });
}

// 更新任务
export async function updateTask(id: string, params: UpdateTaskParams) {
  return request<{
    success: boolean;
    data?: Task;
    message?: string;
  }>(`/api/tasks/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除任务
export async function deleteTask(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
}

// 移动任务到其他Sprint
export async function moveTaskToSprint(taskId: string, sprintId: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/tasks/${taskId}/move`, {
    method: 'POST',
    data: { sprintId },
  });
}