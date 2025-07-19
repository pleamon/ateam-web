import { history, RequestConfig } from '@umijs/max';
import { message } from 'antd';

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
export async function getInitialState(): Promise<{
  currentUser?: any;
  loading?: boolean;
}> {
  // 如果不是登录页面，检查用户登录状态
  const { location } = history;
  if (location.pathname !== '/login') {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // 未登录，跳转到登录页
        history.push('/login');
        return {};
      }
      // 获取用户信息将在 model 中处理
      return {
        currentUser: null,
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      history.push('/login');
    }
  }
  return {};
}

// 请求配置
export const request: RequestConfig = {
  // 统一的请求设定
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },

  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      // 添加 token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 请求成功
      const { data } = response as any;
      if (data?.success === false) {
        message.error(data.message || '请求失败');
      }
      return response;
    },
  ],

  // 错误处理
  errorConfig: {
    errorHandler: (error: any) => {
      const { response } = error;
      
      if (response?.status === 401) {
        // 未授权，跳转到登录页
        localStorage.removeItem('token');
        history.push('/login');
        message.error('登录已过期，请重新登录');
      } else if (response?.status === 403) {
        message.error('没有权限访问该资源');
      } else if (response?.status === 404) {
        message.error('请求的资源不存在');
      } else if (response?.status === 500) {
        message.error('服务器错误，请稍后重试');
      } else {
        message.error('网络错误，请检查网络连接');
      }
    },
  },
};