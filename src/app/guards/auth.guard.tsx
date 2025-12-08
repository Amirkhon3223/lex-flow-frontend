import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children?: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Показываем загрузку пока проверяем аутентификацию
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Если не аутентифицирован, перенаправляем на логин
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  // Если аутентифицирован, показываем контент
  return children || <Outlet />;
};


