import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const msg = error.response?.data?.message || '请求失败';
    message.error(msg);
    return Promise.reject(error);
  }
);

export const projectAPI = {
  list: (params?: any) => request.get('/projects', { params }),
  get: (id: string) => request.get(`/projects/${id}`),
  create: (data: any) => request.post('/projects', data),
  update: (id: string, data: any) => request.put(`/projects/${id}`, data),
  delete: (id: string) => request.delete(`/projects/${id}`),
};

export const teamAPI = {
  list: (params?: any) => request.get('/teams', { params }),
  get: (id: string) => request.get(`/teams/${id}`),
  create: (data: any) => request.post('/teams', data),
  update: (id: string, data: any) => request.put(`/teams/${id}`, data),
  delete: (id: string) => request.delete(`/teams/${id}`),
  addMember: (teamId: string, data: any) =>
    request.post(`/teams/${teamId}/members`, data),
  updateMember: (teamId: string, memberId: string, data: any) =>
    request.put(`/teams/${teamId}/members/${memberId}`, data),
  removeMember: (teamId: string, memberId: string) =>
    request.delete(`/teams/${teamId}/members/${memberId}`),
};

export const taskAPI = {
  list: (params?: any) => request.get('/tasks', { params }),
  get: (id: string) => request.get(`/tasks/${id}`),
  create: (data: any) => request.post('/tasks', data),
  update: (id: string, data: any) => request.put(`/tasks/${id}`, data),
  delete: (id: string) => request.delete(`/tasks/${id}`),
  updateStatus: (id: string, status: string) =>
    request.patch(`/tasks/${id}/status`, { status }),
};

export const documentAPI = {
  list: (params?: any) => request.get('/documentation', { params }),
  get: (id: string) => request.get(`/documentation/${id}`),
  create: (data: any) => request.post('/documentation', data),
  update: (id: string, data: any) => request.put(`/documentation/${id}`, data),
  delete: (id: string) => request.delete(`/documentation/${id}`),
  getStats: (projectId?: string) => request.get('/documentation/stats', { params: projectId ? { projectId } : {} }),
};

export const dashboardAPI = {
  getStats: () => request.get('/dashboard'),
  getProjectDashboard: (projectId: string) => request.get(`/dashboard/projects/${projectId}`),
};

export const sprintAPI = {
  list: (params?: any) => request.get('/sprints', { params }),
  get: (id: string) => request.get(`/sprints/${id}`),
  create: (data: any) => request.post('/sprints', data),
  update: (id: string, data: any) => request.put(`/sprints/${id}`, data),
  delete: (id: string) => request.delete(`/sprints/${id}`),
};

export const requirementAPI = {
  list: async (_params?: any) => {
    // 由于后端没有提供获取所有需求的接口，暂时返回空数据
    return { success: true, data: [] };
  },
  get: (id: string) => request.get(`/requirements/${id}`),
  create: (data: any) => request.post('/requirements', data),
  update: (id: string, data: any) => request.put(`/requirements/${id}`, data),
  delete: (id: string) => request.delete(`/requirements/${id}`),
  getByProject: (projectId: string) => request.get(`/projects/${projectId}/requirements`),
};

export const questionAPI = {
  list: async (_params?: any) => {
    // 由于后端没有提供获取所有问题的接口，暂时返回空数据
    return { success: true, data: [] };
  },
  get: (id: string) => request.get(`/requirement-questions/${id}`),
  create: (data: any) => request.post('/requirement-questions', data),
  update: (id: string, data: any) => request.put(`/requirement-questions/${id}`, data),
  delete: (id: string) => request.delete(`/requirement-questions/${id}`),
  getByProject: (projectId: string) => request.get(`/projects/${projectId}/questions`),
};

export const domainAPI = {
  list: async (_params?: any) => {
    // 由于后端没有提供获取所有领域知识的接口，暂时返回空数据
    return { success: true, data: [] };
  },
  get: (id: string) => request.get(`/domain-knowledge/${id}`),
  create: (data: any) => request.post('/domain-knowledge', data),
  update: (id: string, data: any) => request.put(`/domain-knowledge/${id}`, data),
  delete: (id: string) => request.delete(`/domain-knowledge/${id}`),
  getByProject: (projectId: string) => request.get(`/projects/${projectId}/domain-knowledge`),
};

export const architectureAPI = {
  list: async (_params?: any) => {
    // 由于后端没有提供获取所有系统架构的接口，暂时返回空数据
    return { success: true, data: [] };
  },
  get: (id: string) => request.get(`/system-architecture/${id}`),
  create: (data: any) => request.post('/system-architecture', data),
  update: (id: string, data: any) => request.put(`/system-architecture/${id}`, data),
  delete: (id: string) => request.delete(`/system-architecture/${id}`),
};

export const roadmapAPI = {
  list: (params?: any) => request.get('/roadmaps', { params }),
  get: (id: string) => request.get(`/roadmaps/${id}`),
  create: (data: any) => request.post('/roadmaps', data),
  update: (id: string, data: any) => request.put(`/roadmaps/${id}`, data),
  delete: (id: string) => request.delete(`/roadmaps/${id}`),
};

export const milestoneAPI = {
  list: (params?: any) => request.get('/milestones', { params }),
  get: (id: string) => request.get(`/milestones/${id}`),
  create: (data: any) => request.post('/milestones', data),
  update: (id: string, data: any) => request.put(`/milestones/${id}`, data),
  delete: (id: string) => request.delete(`/milestones/${id}`),
};

export const versionAPI = {
  list: (params?: any) => request.get('/versions', { params }),
  get: (id: string) => request.get(`/versions/${id}`),
  create: (data: any) => request.post('/versions', data),
  update: (id: string, data: any) => request.put(`/versions/${id}`, data),
  delete: (id: string) => request.delete(`/versions/${id}`),
};

export const featureAPI = {
  list: (params?: any) => request.get('/features', { params }),
  get: (id: string) => request.get(`/features/${id}`),
  create: (data: any) => request.post('/features', data),
  update: (id: string, data: any) => request.put(`/features/${id}`, data),
  delete: (id: string) => request.delete(`/features/${id}`),
};

export const promptTemplateAPI = {
  list: (activeOnly?: boolean) => request.get('/prompt-templates', { params: { activeOnly } }),
  getByResponsibility: (responsibility: string) => request.get(`/prompt-templates/by-responsibility/${responsibility}`),
  get: (id: string) => request.get(`/prompt-templates/${id}`),
  create: (data: any) => request.post('/prompt-templates', data),
  update: (id: string, data: any) => request.put(`/prompt-templates/${id}`, data),
  delete: (id: string) => request.delete(`/prompt-templates/${id}`),
  initialize: () => request.post('/prompt-templates/initialize'),
};

export default request;