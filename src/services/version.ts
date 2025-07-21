import { request } from 'umi';

// 版本相关接口
export const versionAPI = {
  // 获取版本列表
  list(params?: any) {
    return request<API.Response<API.Version[]>>('/api/versions', {
      method: 'GET',
      params,
    });
  },

  // 获取单个版本详情
  get(id: string) {
    return request<API.Response<API.Version>>(`/api/versions/${id}`, {
      method: 'GET',
    });
  },

  // 创建版本
  create(data: Partial<API.Version>) {
    return request<API.Response<API.Version>>('/api/versions', {
      method: 'POST',
      data,
    });
  },

  // 更新版本
  update(id: string, data: Partial<API.Version>) {
    return request<API.Response<API.Version>>(`/api/versions/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除版本
  delete(id: string) {
    return request<API.Response<void>>(`/api/versions/${id}`, {
      method: 'DELETE',
    });
  },
};