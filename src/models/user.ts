import { useState, useCallback } from 'react';
import { history } from '@umijs/max';
import { message } from 'antd';
import { login, logout, getCurrentUser, UserInfo } from '@/services/auth';

export default function useUserModel() {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // 初始化用户信息
  const initUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      const response = await getCurrentUser();
      if (response.success && response.data) {
        setCurrentUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return false;
    }
  }, []);

  // 用户登录
  const loginUser = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await login({ usernameOrEmail: username, password });
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // 保存 token
        localStorage.setItem('token', token);
        
        // 设置用户信息
        setCurrentUser(user);
        
        message.success('登录成功');
        
        // 跳转到首页
        history.push('/');
        
        return true;
      } else {
        message.error(response.message || '登录失败');
        return false;
      }
    } catch (error: any) {
      message.error(error.message || '登录失败');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 用户退出
  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('退出登录失败:', error);
    } finally {
      // 清除本地数据
      localStorage.removeItem('token');
      setCurrentUser(null);
      
      // 跳转到登录页
      history.push('/login');
    }
  }, []);

  // 检查是否已登录
  const isLogin = useCallback(() => {
    return !!currentUser;
  }, [currentUser]);

  // 检查权限
  const hasPermission = useCallback((permission: string) => {
    // TODO: 实现权限检查逻辑
    return true;
  }, [currentUser]);

  return {
    currentUser,
    loading,
    initUser,
    loginUser,
    logoutUser,
    isLogin,
    hasPermission,
  };
}