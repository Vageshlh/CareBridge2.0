import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AppointmentDetailPage from './pages/AppointmentDetailPage';
import VideoConsultationPage from './pages/VideoConsultationPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import ThemeTestPage from './pages/ThemeTestPage';

// Lazy-loaded pages
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const UnauthorizedPage = React.lazy(() => import('./pages/UnauthorizedPage'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
            <Router>
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                }
              >
                <Routes>
                  {/* Layout wrapper */}
                  <Route path="/" element={<Layout />}>
                    {/* Public routes */}
                    <Route index element={<HomePage />} />
                    <Route path="unauthorized" element={<UnauthorizedPage />} />
                    
                    {/* Auth routes - accessible only when not logged in */}
                    <Route element={<ProtectedRoute requireAuth={false} />}>
                      <Route path="login" element={<LoginPage />} />
                      <Route path="register" element={<RegisterPage />} />
                    </Route>
                    
                    {/* Public doctor listing */}
                    <Route path="doctors" element={<DoctorsPage />} />
                    
                    {/* Protected routes - require authentication */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="appointments" element={<AppointmentsPage />} />
                      <Route path="appointments/:id" element={<AppointmentDetailPage />} />
                      <Route path="video-consultation/:id" element={<VideoConsultationPage />} />
                      <Route path="notifications" element={<NotificationsPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="doctors/:id" element={<DoctorDetailPage />} />
                      <Route path="theme-test" element={<ThemeTestPage />} />
                    </Route>
                    
                    {/* Admin routes */}
                    <Route element={<ProtectedRoute requireAdmin={true} />}>
                      {/* Add admin routes here */}
                    </Route>
                    
                    {/* Doctor routes */}
                    <Route element={<ProtectedRoute requireDoctor={true} />}>
                      {/* Add doctor-specific routes here */}
                    </Route>
                    
                    {/* 404 route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </React.Suspense>
            </Router>
            </ToastProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;