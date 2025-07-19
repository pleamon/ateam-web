import { Navigate, Outlet, useModel } from '@umijs/max';
import { useEffect } from 'react';

export default function AuthWrapper() {
  const { currentUser, initUser } = useModel('user');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && !currentUser) {
      initUser();
    }
  }, [token, currentUser]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}