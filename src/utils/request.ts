import { request as umiRequest } from '@umijs/max';
import { message } from 'antd';

const request = (url: string, options?: any) => {
  const token = localStorage.getItem('token');
  
  return umiRequest(url, {
    prefix: '/api',
    timeout: 10000,
    ...options,
    headers: {
      ...options?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    errorHandler: (error: any) => {
      const { response } = error;
      if (response && response.status) {
        const errorText = response.statusText;
        const { status } = response;
        message.error(`请求错误 ${status}: ${errorText}`);
      } else if (!response) {
        message.error('网络异常');
      }
      throw error;
    },
  });
};

export default request;