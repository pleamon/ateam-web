import { request } from 'umi';

// 功能特性相关接口
export const featureAPI = {
  // 获取功能特性列表
  list(params?: any) {
    return request<API.Response<API.Feature[]>>('/api/features', {
      method: 'GET',
      params,
    });
  },

  // 获取单个功能特性详情
  get(id: string) {
    return request<API.Response<API.Feature>>(`/api/features/${id}`, {
      method: 'GET',
    });
  },

  // 创建功能特性
  create(data: Partial<API.Feature>) {
    return request<API.Response<API.Feature>>('/api/features', {
      method: 'POST',
      data,
    });
  },

  // 更新功能特性
  update(id: string, data: Partial<API.Feature>) {
    return request<API.Response<API.Feature>>(`/api/features/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除功能特性
  delete(id: string) {
    return request<API.Response<void>>(`/api/features/${id}`, {
      method: 'DELETE',
    });
  },
};