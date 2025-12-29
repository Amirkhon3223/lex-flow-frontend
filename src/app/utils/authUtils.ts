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
  } catch (error) {
    console.error('Logout error:', error);
    navigate('/login');
  }
};
