// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import { Spin } from 'antd';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading, initialized } = useUser();
    
  // 1) Still restoring session? show spinner (or return null)
  if (!initialized) {
    return <Spin />;
  }

  // 2) API calls in flight? show spinner
  if (loading) {
    return <Spin />;
  }

  // 3) Once init + loading are done, redirect if no token
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // 4) You’re good to go
  return <>{children}</>;
};
