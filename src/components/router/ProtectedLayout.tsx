// ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import { Spin } from 'antd';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { token, loading } = useUser();

    if (loading) return <Spin />; // or a spinner

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    return <>{children}</>;
};
