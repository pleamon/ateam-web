import { request } from '@umijs/max';

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSprintParams {
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  projectId: string;
}

export interface UpdateSprintParams {
  name?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  status?: 'planning' | 'active' | 'completed';
}

// 获取Sprint列表
export async function getSprints(projectId: string, params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  return request<{
    success: boolean;
    data?: {
      list: Sprint[];
      total: number;
    };
    message?: string;
  }>('/api/sprints', {
    method: 'GET',
    params: {
      projectId,
      ...params,
    },
  });
}

// 获取Sprint详情
export async function getSprint(id: string) {
  return request<{
    success: boolean;
    data?: Sprint;
    message?: string;
  }>(`/api/sprints/${id}`, {
    method: 'GET',
  });
}

// 创建Sprint
export async function createSprint(params: CreateSprintParams) {
  return request<{
    success: boolean;
    data?: Sprint;
    message?: string;
  }>('/api/sprints', {
    method: 'POST',
    data: params,
  });
}

// 更新Sprint
export async function updateSprint(id: string, params: UpdateSprintParams) {
  return request<{
    success: boolean;
    data?: Sprint;
    message?: string;
  }>(`/api/sprints/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除Sprint
export async function deleteSprint(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/sprints/${id}`, {
    method: 'DELETE',
  });
}

// 获取Sprint的任务
export async function getSprintTasks(sprintId: string) {
  return request<{
    success: boolean;
    data?: Array<{
      id: string;
      title: string;
      description?: string;
      status: string;
      priority: string;
      assigneeId?: string;
      sprintId: string;
      projectId: string;
    }>;
    message?: string;
  }>(`/api/sprints/${sprintId}/tasks`, {
    method: 'GET',
  });
}