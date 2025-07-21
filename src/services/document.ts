import { request } from '@umijs/max';

export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'requirement' | 'design' | 'api' | 'user_guide' | 'other';
  projectId: string;
  authorId: string;
  version: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentParams {
  title: string;
  content: string;
  type: 'requirement' | 'design' | 'api' | 'user_guide' | 'other';
  projectId: string;
  tags?: string[];
}

export interface UpdateDocumentParams {
  title?: string;
  content?: string;
  type?: 'requirement' | 'design' | 'api' | 'user_guide' | 'other';
  tags?: string[];
}

// 获取文档列表
export async function getDocuments(params?: {
  page?: number;
  pageSize?: number;
  projectId?: string;
  type?: string;
  authorId?: string;
}) {
  return request<{
    success: boolean;
    data?: {
      list: Document[];
      total: number;
    };
    message?: string;
  }>('/api/documents', {
    method: 'GET',
    params,
  });
}

// 获取文档详情
export async function getDocument(id: string) {
  return request<{
    success: boolean;
    data?: Document;
    message?: string;
  }>(`/api/documents/${id}`, {
    method: 'GET',
  });
}

// 创建文档
export async function createDocument(params: CreateDocumentParams) {
  return request<{
    success: boolean;
    data?: Document;
    message?: string;
  }>('/api/documents', {
    method: 'POST',
    data: params,
  });
}

// 更新文档
export async function updateDocument(id: string, params: UpdateDocumentParams) {
  return request<{
    success: boolean;
    data?: Document;
    message?: string;
  }>(`/api/documents/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除文档
export async function deleteDocument(id: string) {
  return request<{
    success: boolean;
    message?: string;
  }>(`/api/documents/${id}`, {
    method: 'DELETE',
  });
}

// 获取文档历史版本
export async function getDocumentHistory(id: string) {
  return request<{
    success: boolean;
    data?: Array<{
      id: string;
      documentId: string;
      version: number;
      content: string;
      authorId: string;
      createdAt: string;
    }>;
    message?: string;
  }>(`/api/documents/${id}/history`, {
    method: 'GET',
  });
}

// 获取文档统计信息
export async function getDocumentStats(projectId?: string) {
  return request<{
    success: boolean;
    data?: {
      total: number;
      byType: Record<string, number>;
      byProject: Record<string, number>;
    };
    message?: string;
  }>('/api/documentation/stats', {
    method: 'GET',
    params: projectId ? { projectId } : {},
  });
}

// 文档 API 对象（兼容旧的调用方式）
export const documentAPI = {
  list: (params?: any) => {
    return request<{
      success: boolean;
      data?: Document[];
      message?: string;
    }>('/api/documents', {
      method: 'GET',
      params,
    });
  },
  
  get: (id: string) => getDocument(id),
  
  create: (data: CreateDocumentParams) => createDocument(data),
  
  update: (id: string, data: UpdateDocumentParams) => updateDocument(id, data),
  
  delete: (id: string) => deleteDocument(id),
  
  getHistory: (id: string) => getDocumentHistory(id),
  
  getStats: (projectId?: string) => getDocumentStats(projectId),
};