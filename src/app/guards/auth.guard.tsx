import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children?: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading, initializing, emailVerificationRequired, initializeAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      initializeAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (emailVerificationRequired && location.pathname !== ROUTES.AUTH.VERIFY_EMAIL) {
    return <Navigate to={ROUTES.AUTH.VERIFY_EMAIL} replace />;
  }

  return children || <Outlet />;
};
