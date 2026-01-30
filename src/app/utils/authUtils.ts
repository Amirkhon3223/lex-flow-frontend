import { useAuthStore } from '@/app/store/auth.store';

/**
 * Обработчик logout - удаляет токен через сервис, очищает стор и редиректит на логин
 * @param navigate функция навигации из useNavigate()
 */
export const handleLogout = async (navigate: (path: string) => void) => {
  try {
    const { logout } = useAuthStore.getState();
    await logout();
    navigate('/login');
  } catch {
    // Redirect to login even if logout fails
    navigate('/login');
  }
};
