import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { i18nService } from '@/app/services/i18n/i18n.service';

interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  retry_after?: number;
}

export const handleApiError = (error: AxiosError<ErrorResponse>) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;

    switch (status) {
      case 400:
        toast.error(i18nService.t('ERRORS.400.TITLE'), {
          description: message || i18nService.t('ERRORS.400.DESCRIPTION'),
        });
        break;
      case 401:
        toast.error(i18nService.t('ERRORS.401.TITLE'), {
          description: message || i18nService.t('ERRORS.401.DESCRIPTION'),
        });
        break;
      case 403:
        toast.error(i18nService.t('ERRORS.403.TITLE'), {
          description: i18nService.t('ERRORS.403.DESCRIPTION'),
        });
        break;
      case 404:
        toast.error(i18nService.t('ERRORS.404.TITLE'), {
          description: message || i18nService.t('ERRORS.404.DESCRIPTION'),
        });
        break;
      case 422:
        toast.error(i18nService.t('ERRORS.422.TITLE'), {
          description: message || i18nService.t('ERRORS.422.DESCRIPTION'),
        });
        break;
      case 429: {
        const retryAfter = error.response.data?.retry_after ||
                          parseInt(error.response.headers?.['retry-after'] || '60');
        toast.error(i18nService.t('ERRORS.429.TITLE'), {
          description: i18nService.t('ERRORS.429.DESCRIPTION', { seconds: retryAfter }),
          duration: 5000,
        });
        break;
      }
      case 500:
        toast.error(i18nService.t('ERRORS.500.TITLE'), {
          description: i18nService.t('ERRORS.500.DESCRIPTION'),
        });
        break;
      case 503:
        toast.error(i18nService.t('ERRORS.503.TITLE'), {
          description: i18nService.t('ERRORS.503.DESCRIPTION'),
        });
        break;
      default:
        toast.error(i18nService.t('ERRORS.DEFAULT.TITLE'), {
          description: message || i18nService.t('ERRORS.DEFAULT.DESCRIPTION'),
        });
    }
  } else if (error.request) {
    toast.error(i18nService.t('ERRORS.NETWORK.TITLE'), {
      description: i18nService.t('ERRORS.NETWORK.DESCRIPTION'),
    });
  } else {
    toast.error(i18nService.t('ERRORS.GENERAL.TITLE'), {
      description: error.message || i18nService.t('ERRORS.DEFAULT.DESCRIPTION'),
    });
  }
};
