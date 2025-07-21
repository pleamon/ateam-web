import { request } from '@umijs/max';

export interface Question {
  id: string;
  question: string;
  answer?: string;
  category: string;
  requirementId?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionParams {
  question: string;
  answer?: string;
  category: string;
  requirementId?: string;
  projectId: string;
}

export interface UpdateQuestionParams {
  question?: string;
  answer?: string;
  category?: string;
}

// 获取问答列表
export async function getQuestions(params?: {
  page?: number;
  pageSize?: number;
  projectId?: string;
  requirementId?: string;
}) {
  return request<{
    success: boolean;
    data?: {
      list: Question[];
      total: number;
    };
    message?: string;
  }>('/api/requirement-questions', {
    method: 'GET',
    params,
  });
}

// 获取问答详情
export async function getQuestion(id: string) {
  return request<{
    success: boolean;
    data?: Question;
    message?: string;
  }>(`/api/requirement-questions/${id}`, {
    method: 'GET',
  });
}

// 创建问答
export async function createQuestion(params: CreateQuestionParams) {
  return request<{
    success: boolean;
    data?: Question;
    message?: string;
  }>('/api/requirement-questions', {
    method: 'POST',
    data: params,
  });
}

// 更新问答
export async function updateQuestion(id: string, params: UpdateQuestionParams) {
  return request<{
    success: boolean;
    data?: Question;
    message?: string;
  }>(`/api/requirement-questions/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除问答
export async function deleteQuestion(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/requirement-questions/${id}`, {
    method: 'DELETE',
  });
}

// 根据项目获取问答
export async function getQuestionsByProject(projectId: string) {
  return request<{
    success: boolean;
    data?: Question[];
    message?: string;
  }>(`/api/projects/${projectId}/questions`, {
    method: 'GET',
  });
}

// 问答 API 对象（兼容旧的调用方式）
export const questionAPI = {
  list: (params?: any) => {
    return request<{
      success: boolean;
      data?: Question[];
      message?: string;
    }>('/api/requirement-questions', {
      method: 'GET',
      params,
    });
  },
  
  get: (id: string) => getQuestion(id),
  
  create: (data: CreateQuestionParams) => createQuestion(data),
  
  update: (id: string, data: UpdateQuestionParams) => updateQuestion(id, data),
  
  delete: (id: string) => deleteQuestion(id),
  
  getByProject: (projectId: string) => getQuestionsByProject(projectId),
};