import { request } from '@umijs/max';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  role: string;
}

// 用户登录
export async function login(params: LoginParams) {
  return request<{
    success: boolean;
    data?: {
      user: UserInfo;
      token: string;
    };
    message?: string;
  }>('/api/auth/login', {
    method: 'POST',
    data: params,
    skipErrorHandler: true,
  });
}

// 用户注册
export async function register(params: RegisterParams) {
  return request<{
    success: boolean;
    data?: {
      user: UserInfo;
      token: string;
    };
    message?: string;
  }>('/api/auth/register', {
    method: 'POST',
    data: params,
    skipErrorHandler: true,
  });
}

// 退出登录
export async function logout() {
  return request<{
    success: boolean;
    message?: string;
  }>('/api/auth/logout', {
    method: 'POST',
  });
}

// 获取当前用户信息
export async function getCurrentUser() {
  return request<{
    success: boolean;
    data?: UserInfo;
    message?: string;
  }>('/api/auth/me', {
    method: 'GET',
  });
}

// 获取用户权限
export async function getUserPermissions(projectId?: string) {
  return request<{
    success: boolean;
    data?: string[];
    message?: string;
  }>('/api/auth/permissions', {
    method: 'GET',
    params: projectId ? { projectId } : {},
  });
}