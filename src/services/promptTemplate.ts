import { request } from '@umijs/max';

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  category: string;
  variables?: string[];
  teamId?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptTemplateParams {
  name: string;
  description?: string;
  content: string;
  category: string;
  variables?: string[];
  teamId?: string;
  isPublic?: boolean;
}

export interface UpdatePromptTemplateParams {
  name?: string;
  description?: string;
  content?: string;
  category?: string;
  variables?: string[];
  isPublic?: boolean;
}

// 获取提示词模板列表
export async function getPromptTemplates(params?: {
  page?: number;
  pageSize?: number;
  teamId?: string;
  category?: string;
  isPublic?: boolean;
}) {
  return request<{
    success: boolean;
    data?: {
      list: PromptTemplate[];
      total: number;
    };
    message?: string;
  }>('/api/prompt-templates', {
    method: 'GET',
    params,
  });
}

// 获取提示词模板详情
export async function getPromptTemplate(id: string) {
  return request<{
    success: boolean;
    data?: PromptTemplate;
    message?: string;
  }>(`/api/prompt-templates/${id}`, {
    method: 'GET',
  });
}

// 创建提示词模板
export async function createPromptTemplate(params: CreatePromptTemplateParams) {
  return request<{
    success: boolean;
    data?: PromptTemplate;
    message?: string;
  }>('/api/prompt-templates', {
    method: 'POST',
    data: params,
  });
}

// 更新提示词模板
export async function updatePromptTemplate(id: string, params: UpdatePromptTemplateParams) {
  return request<{
    success: boolean;
    data?: PromptTemplate;
    message?: string;
  }>(`/api/prompt-templates/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除提示词模板
export async function deletePromptTemplate(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/prompt-templates/${id}`, {
    method: 'DELETE',
  });
}

// 使用提示词模板生成内容
export async function generateFromTemplate(id: string, variables: Record<string, string>) {
  return request<{
    success: boolean;
    data?: {
      content: string;
    };
    message?: string;
  }>(`/api/prompt-templates/${id}/generate`, {
    method: 'POST',
    data: { variables },
  });
}

// 根据职责获取提示词模板
export async function getPromptTemplatesByResponsibility(responsibility: string) {
  return request<{
    success: boolean;
    data?: PromptTemplate[];
    message?: string;
  }>('/api/prompt-templates/by-responsibility', {
    method: 'GET',
    params: { responsibility },
  });
}

// 初始化提示词模板
export async function initializePromptTemplates(teamId: string) {
  return request<{
    success: boolean;
    data?: PromptTemplate[];
    message?: string;
  }>('/api/prompt-templates/initialize', {
    method: 'POST',
    data: { teamId },
  });
}