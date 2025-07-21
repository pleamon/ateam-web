import { request } from 'umi';

// 里程碑相关接口
export const milestoneAPI = {
  // 获取里程碑列表
  list(params?: any) {
    return request<API.Response<API.Milestone[]>>('/api/milestones', {
      method: 'GET',
      params,
    });
  },

  // 获取单个里程碑详情
  get(id: string) {
    return request<API.Response<API.Milestone>>(`/api/milestones/${id}`, {
      method: 'GET',
    });
  },

  // 创建里程碑
  create(data: Partial<API.Milestone>) {
    return request<API.Response<API.Milestone>>('/api/milestones', {
      method: 'POST',
      data,
    });
  },

  // 更新里程碑
  update(id: string, data: Partial<API.Milestone>) {
    return request<API.Response<API.Milestone>>(`/api/milestones/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除里程碑
  delete(id: string) {
    return request<API.Response<void>>(`/api/milestones/${id}`, {
      method: 'DELETE',
    });
  },
};