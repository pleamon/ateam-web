import { request } from 'umi';

// 路线图相关接口
export const roadmapAPI = {
  // 获取路线图列表
  list(params?: any) {
    return request<API.Response<API.Roadmap[]>>('/api/roadmaps', {
      method: 'GET',
      params,
    });
  },

  // 获取单个路线图详情
  get(id: string) {
    return request<API.Response<API.Roadmap>>(`/api/roadmaps/${id}`, {
      method: 'GET',
    });
  },

  // 创建路线图
  create(data: Partial<API.Roadmap>) {
    return request<API.Response<API.Roadmap>>('/api/roadmaps', {
      method: 'POST',
      data,
    });
  },

  // 更新路线图
  update(id: string, data: Partial<API.Roadmap>) {
    return request<API.Response<API.Roadmap>>(`/api/roadmaps/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除路线图
  delete(id: string) {
    return request<API.Response<void>>(`/api/roadmaps/${id}`, {
      method: 'DELETE',
    });
  },
};