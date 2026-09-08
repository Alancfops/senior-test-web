import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

const CHANGE_PASSWORD_PATH = '/change-password';

export function ProtectedRoute() {
  const { isAuthenticated, mustChangePassword } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const isChangePasswordRoute = location.pathname === CHANGE_PASSWORD_PATH;

  if (mustChangePassword && !isChangePasswordRoute) {
    return <Navigate to={CHANGE_PASSWORD_PATH} replace />;
  }

  if (!mustChangePassword && isChangePasswordRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { isAuthenticated, mustChangePassword } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate to={mustChangePassword ? CHANGE_PASSWORD_PATH : '/dashboard'} replace />
    );
  }

  return <Outlet />;
}
