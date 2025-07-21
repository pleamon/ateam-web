import { request } from '@umijs/max';

export interface SystemArchitecture {
  id: string;
  name: string;
  type: string;
  description: string;
  diagram?: string;
  components?: any[];
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSystemArchitectureParams {
  name: string;
  type: string;
  description: string;
  diagram?: string;
  components?: any[];
  projectId: string;
}

export interface UpdateSystemArchitectureParams {
  name?: string;
  type?: string;
  description?: string;
  diagram?: string;
  components?: any[];
}

// 获取系统架构列表
export async function getSystemArchitectures(params?: {
  page?: number;
  pageSize?: number;
  projectId?: string;
  type?: string;
}) {
  return request<{
    success: boolean;
    data?: {
      list: SystemArchitecture[];
      total: number;
    };
    message?: string;
  }>('/api/system-architecture', {
    method: 'GET',
    params,
  });
}

// 获取系统架构详情
export async function getSystemArchitecture(id: string) {
  return request<{
    success: boolean;
    data?: SystemArchitecture;
    message?: string;
  }>(`/api/system-architecture/${id}`, {
    method: 'GET',
  });
}

// 创建系统架构
export async function createSystemArchitecture(params: CreateSystemArchitectureParams) {
  return request<{
    success: boolean;
    data?: SystemArchitecture;
    message?: string;
  }>('/api/system-architecture', {
    method: 'POST',
    data: params,
  });
}

// 更新系统架构
export async function updateSystemArchitecture(id: string, params: UpdateSystemArchitectureParams) {
  return request<{
    success: boolean;
    data?: SystemArchitecture;
    message?: string;
  }>(`/api/system-architecture/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除系统架构
export async function deleteSystemArchitecture(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/system-architecture/${id}`, {
    method: 'DELETE',
  });
}

// 架构 API 对象（兼容旧的调用方式）
export const architectureAPI = {
  list: (params?: any) => {
    return request<{
      success: boolean;
      data?: SystemArchitecture[];
      message?: string;
    }>('/api/system-architecture', {
      method: 'GET',
      params,
    });
  },
  
  get: (id: string) => getSystemArchitecture(id),
  
  create: (data: CreateSystemArchitectureParams) => createSystemArchitecture(data),
  
  update: (id: string, data: UpdateSystemArchitectureParams) => updateSystemArchitecture(id, data),
  
  delete: (id: string) => deleteSystemArchitecture(id),
};