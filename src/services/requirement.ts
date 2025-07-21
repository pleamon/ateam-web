import { request } from '@umijs/max';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequirementParams {
  title: string;
  description: string;
  type: string;
  priority: string;
  projectId: string;
}

export interface UpdateRequirementParams {
  title?: string;
  description?: string;
  type?: string;
  priority?: string;
  status?: string;
}

// 获取需求列表
export async function getRequirements(params?: {
  page?: number;
  pageSize?: number;
  projectId?: string;
}) {
  return request<{
    success: boolean;
    data?: {
      list: Requirement[];
      total: number;
    };
    message?: string;
  }>('/api/requirements', {
    method: 'GET',
    params,
  });
}

// 获取需求详情
export async function getRequirement(id: string) {
  return request<{
    success: boolean;
    data?: Requirement;
    message?: string;
  }>(`/api/requirements/${id}`, {
    method: 'GET',
  });
}

// 创建需求
export async function createRequirement(params: CreateRequirementParams) {
  return request<{
    success: boolean;
    data?: Requirement;
    message?: string;
  }>('/api/requirements', {
    method: 'POST',
    data: params,
  });
}

// 更新需求
export async function updateRequirement(id: string, params: UpdateRequirementParams) {
  return request<{
    success: boolean;
    data?: Requirement;
    message?: string;
  }>(`/api/requirements/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除需求
export async function deleteRequirement(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/requirements/${id}`, {
    method: 'DELETE',
  });
}

// 根据项目获取需求
export async function getRequirementsByProject(projectId: string) {
  return request<{
    success: boolean;
    data?: Requirement[];
    message?: string;
  }>(`/api/projects/${projectId}/requirements`, {
    method: 'GET',
  });
}

// 需求 API 对象（兼容旧的调用方式）
export const requirementAPI = {
  list: (params?: any) => {
    return request<{
      success: boolean;
      data?: Requirement[];
      message?: string;
    }>('/api/requirements', {
      method: 'GET',
      params,
    });
  },
  
  get: (id: string) => getRequirement(id),
  
  create: (data: CreateRequirementParams) => createRequirement(data),
  
  update: (id: string, data: UpdateRequirementParams) => updateRequirement(id, data),
  
  delete: (id: string) => deleteRequirement(id),
  
  getByProject: (projectId: string) => getRequirementsByProject(projectId),
};