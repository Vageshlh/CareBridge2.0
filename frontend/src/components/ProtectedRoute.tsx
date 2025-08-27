import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from './Loader';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireDoctor?: boolean;
  redirectPath?: string;
}

/**
 * ProtectedRoute component for handling authentication and route protection
 * 
 * @param requireAuth - Whether authentication is required for this route
 * @param requireAdmin - Whether admin role is required for this route
 * @param requireDoctor - Whether doctor role is required for this route
 * @param redirectPath - Path to redirect to if conditions are not met
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAuth = true,
  requireAdmin = false,
  requireDoctor = false,
  redirectPath = '/login'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If admin role is required and user is not an admin, redirect
  if (requireAdmin && (!user || user.userType !== 'admin')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If doctor role is required and user is not a doctor, redirect
  if (requireDoctor && (!user || user.userType !== 'doctor')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is authenticated but tries to access login/register pages, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If all conditions are met, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;