import { request } from '@umijs/max';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  teamId: string;
  ownerId: string;
}

export interface CreateProjectParams {
  name: string;
  description?: string;
  teamId: string;
  startDate: string;
  endDate?: string;
}

export interface UpdateProjectParams {
  name?: string;
  description?: string;
  status?: 'active' | 'archived' | 'completed';
  startDate?: string;
  endDate?: string;
}

// 获取项目列表
export async function getProjects(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  teamId?: string;
}) {
  return request<{
    success: boolean;
    data?: {
      list: Project[];
      total: number;
    };
    message?: string;
  }>('/api/projects', {
    method: 'GET',
    params,
  });
}

// 获取项目详情
export async function getProject(id: string) {
  return request<{
    success: boolean;
    data?: Project;
    message?: string;
  }>(`/api/projects/${id}`, {
    method: 'GET',
  });
}

// 创建项目
export async function createProject(params: CreateProjectParams) {
  return request<{
    success: boolean;
    data?: Project;
    message?: string;
  }>('/api/projects', {
    method: 'POST',
    data: params,
  });
}

// 更新项目
export async function updateProject(id: string, params: UpdateProjectParams) {
  return request<{
    success: boolean;
    data?: Project;
    message?: string;
  }>(`/api/projects/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除项目
export async function deleteProject(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/projects/${id}`, {
    method: 'DELETE',
  });
}

// 获取项目成员
export async function getProjectMembers(projectId: string) {
  return request<{
    success: boolean;
    data?: Array<{
      id: string;
      userId: string;
      projectId: string;
      role: string;
      user: {
        id: string;
        username: string;
        email: string;
        name?: string;
        avatar?: string;
      };
    }>;
    message?: string;
  }>(`/api/projects/${projectId}/members`, {
    method: 'GET',
  });
}

// 添加项目成员
export async function addProjectMember(projectId: string, userId: string, role: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/projects/${projectId}/members`, {
    method: 'POST',
    data: { userId, role },
  });
}

// 移除项目成员
export async function removeProjectMember(projectId: string, userId: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/projects/${projectId}/members/${userId}`, {
    method: 'DELETE',
  });
}

// 项目 API 对象（兼容旧的调用方式）
export const projectAPI = {
  list: (params?: any) => {
    return request<{
      success: boolean;
      data?: Project[];
      message?: string;
    }>('/api/projects', {
      method: 'GET',
      params,
    });
  },
  
  get: (id: string) => getProject(id),
  
  create: (data: CreateProjectParams) => createProject(data),
  
  update: (id: string, data: UpdateProjectParams) => updateProject(id, data),
  
  delete: (id: string) => deleteProject(id),
};