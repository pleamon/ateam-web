import { request } from '@umijs/max';

export interface DomainKnowledge {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDomainKnowledgeParams {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  projectId: string;
}

export interface UpdateDomainKnowledgeParams {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

// 获取领域知识列表
export async function getDomainKnowledge(params?: {
  page?: number;
  pageSize?: number;
  projectId?: string;
  category?: string;
}) {
  return request<{
    success: boolean;
    data?: {
      list: DomainKnowledge[];
      total: number;
    };
    message?: string;
  }>('/api/domain-knowledge', {
    method: 'GET',
    params,
  });
}

// 获取领域知识详情
export async function getDomainKnowledgeItem(id: string) {
  return request<{
    success: boolean;
    data?: DomainKnowledge;
    message?: string;
  }>(`/api/domain-knowledge/${id}`, {
    method: 'GET',
  });
}

// 创建领域知识
export async function createDomainKnowledge(params: CreateDomainKnowledgeParams) {
  return request<{
    success: boolean;
    data?: DomainKnowledge;
    message?: string;
  }>('/api/domain-knowledge', {
    method: 'POST',
    data: params,
  });
}

// 更新领域知识
export async function updateDomainKnowledge(id: string, params: UpdateDomainKnowledgeParams) {
  return request<{
    success: boolean;
    data?: DomainKnowledge;
    message?: string;
  }>(`/api/domain-knowledge/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除领域知识
export async function deleteDomainKnowledge(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/domain-knowledge/${id}`, {
    method: 'DELETE',
  });
}

// 根据项目获取领域知识
export async function getDomainKnowledgeByProject(projectId: string) {
  return request<{
    success: boolean;
    data?: DomainKnowledge[];
    message?: string;
  }>(`/api/projects/${projectId}/domain-knowledge`, {
    method: 'GET',
  });
}

// 领域知识 API 对象（兼容旧的调用方式）
export const domainAPI = {
  list: (params?: any) => {
    return request<{
      success: boolean;
      data?: DomainKnowledge[];
      message?: string;
    }>('/api/domain-knowledge', {
      method: 'GET',
      params,
    });
  },
  
  get: (id: string) => getDomainKnowledgeItem(id),
  
  create: (data: CreateDomainKnowledgeParams) => createDomainKnowledge(data),
  
  update: (id: string, data: UpdateDomainKnowledgeParams) => updateDomainKnowledge(id, data),
  
  delete: (id: string) => deleteDomainKnowledge(id),
  
  getByProject: (projectId: string) => getDomainKnowledgeByProject(projectId),
};