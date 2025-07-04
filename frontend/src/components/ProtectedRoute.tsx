import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/dashboard-login/context/AuthContext';
import React from 'react';
import { CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    // Puoi mostrare un loader o null per non renderizzare niente finché non carica
    return <CircularProgress size={50} color="inherit" />;
  }

  if (!token || !user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Authenticated but role not allowed, redirect to a forbidden page or dashboard
    // For now, let's redirect to a generic dashboard or home. You can change this.
    console.warn(
      `User ${user.username} with role ${
        user.role
      } attempted to access a restricted route. Required roles: ${allowedRoles.join(', ')}`
    );
    // Redirect to the user's dashboard based on their role, or a forbidden page
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'operator':
        return <Navigate to="/operator" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Authenticated and role is allowed, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
