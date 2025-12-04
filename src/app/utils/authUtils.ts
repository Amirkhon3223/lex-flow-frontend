import { useAuthStore } from '@/app/store/auth.store';

/**
 * Обработчик logout - удаляет токен через сервис, очищает стор и редиректит на логин
 * @param navigate функция навигации из useNavigate()
 */
export const handleLogout = async (navigate: (path: string) => void) => {
  try {
    const { logout } = useAuthStore.getState();
    await logout();
    // Стор и сервис уже очистили localStorage, просто редиректим
    navigate('/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Даже если было исключение, редиректим на логин (стор уже очистил данные)
    navigate('/login');
  }
};
