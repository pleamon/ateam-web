import { request } from '@umijs/max';

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface CreateTeamParams {
  name: string;
  description?: string;
}

export interface UpdateTeamParams {
  name?: string;
  description?: string;
}

// 获取团队列表
export async function getTeams(params?: {
  page?: number;
  pageSize?: number;
}) {
  return request<{
    success: boolean;
    data?: {
      list: Team[];
      total: number;
    };
    message?: string;
  }>('/api/teams', {
    method: 'GET',
    params,
  });
}

// 获取团队详情
export async function getTeam(id: string) {
  return request<{
    success: boolean;
    data?: Team;
    message?: string;
  }>(`/api/teams/${id}`, {
    method: 'GET',
  });
}

// 创建团队
export async function createTeam(params: CreateTeamParams) {
  return request<{
    success: boolean;
    data?: Team;
    message?: string;
  }>('/api/teams', {
    method: 'POST',
    data: params,
  });
}

// 更新团队
export async function updateTeam(id: string, params: UpdateTeamParams) {
  return request<{
    success: boolean;
    data?: Team;
    message?: string;
  }>(`/api/teams/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除团队
export async function deleteTeam(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/teams/${id}`, {
    method: 'DELETE',
  });
}

// 获取团队成员
export async function getTeamMembers(teamId: string) {
  return request<{
    success: boolean;
    data?: Array<{
      id: string;
      userId: string;
      teamId: string;
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
  }>(`/api/teams/${teamId}/members`, {
    method: 'GET',
  });
}

// 添加团队成员
export async function addTeamMember(teamId: string, userId: string, role: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/teams/${teamId}/members`, {
    method: 'POST',
    data: { userId, role },
  });
}

// 移除团队成员
export async function removeTeamMember(teamId: string, userId: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/teams/${teamId}/members/${userId}`, {
    method: 'DELETE',
  });
}

// 更新团队成员
export async function updateTeamMember(teamId: string, userId: string, role: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/teams/${teamId}/members/${userId}`, {
    method: 'PUT',
    data: { role },
  });
}

// 团队 API 对象（兼容旧的调用方式）
export const teamAPI = {
  list: (params?: any) => {
    return request<{
      success: boolean;
      data?: Team[];
      message?: string;
    }>('/api/teams', {
      method: 'GET',
      params,
    });
  },
  
  get: (id: string) => getTeam(id),
  
  create: (data: CreateTeamParams) => createTeam(data),
  
  update: (id: string, data: UpdateTeamParams) => updateTeam(id, data),
  
  delete: (id: string) => deleteTeam(id),
  
  getMembers: (teamId: string) => getTeamMembers(teamId),
  
  addMember: (teamId: string, userId: string, role: string) => addTeamMember(teamId, userId, role),
  
  removeMember: (teamId: string, userId: string) => removeTeamMember(teamId, userId),
  
  updateMember: (teamId: string, userId: string, role: string) => updateTeamMember(teamId, userId, role),
};