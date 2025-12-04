import type { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export const handleApiError = (error: AxiosError<ErrorResponse>) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;

    switch (status) {
      case 400:
        toast.error('Ошибка запроса', {
          description: message || 'Проверьте введенные данные',
        });
        break;
      case 401:
        toast.error('Не авторизован', {
          description: message || 'Пожалуйста, войдите в систему',
        });
        localStorage.removeItem('access_token');
        break;
      case 403:
        toast.error('Доступ запрещен', {
          description: 'У вас нет прав для выполнения этого действия',
        });
        break;
      case 404:
        toast.error('Не найдено', {
          description: message || 'Запрашиваемый ресурс не найден',
        });
        break;
      case 422:
        toast.error('Ошибка валидации', {
          description: message || 'Проверьте правильность данных',
        });
        break;
      case 500:
        toast.error('Ошибка сервера', {
          description: 'Что-то пошло не так. Попробуйте позже',
        });
        break;
      case 503:
        toast.error('Сервис недоступен', {
          description: 'Сервер временно недоступен',
        });
        break;
      default:
        toast.error('Произошла ошибка', {
          description: message || 'Что-то пошло не так',
        });
    }
  } else if (error.request) {
    toast.error('Ошибка сети', {
      description: 'Не удалось соединиться с сервером. Проверьте подключение и убедитесь, что сервер запущен на http://localhost:8080',
    });
  } else {
    toast.error('Ошибка', {
      description: error.message || 'Что-то пошло не так',
    });
  }
};
