import type {
  SpeechRecognitionInstance,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionConfig,
  SpeechRecognitionCallbacks,
} from '@/app/types/ai-assistant/ai-assistant.interfaces';

/**
 * Проверка поддержки браузером
 */
export const isSpeechRecognitionSupported = (): boolean => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

/**
 * Создание экземпляра SpeechRecognition
 */
export const createSpeechRecognition = (
  config?: SpeechRecognitionConfig
): SpeechRecognitionInstance | null => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = config?.lang || 'ru-RU';
  recognition.continuous = config?.continuous ?? true;
  recognition.interimResults = config?.interimResults ?? true;
  recognition.maxAlternatives = config?.maxAlternatives || 1;

  return recognition;
};

/**
 * Установка обработчиков событий
 */
export const setupSpeechRecognitionCallbacks = (
  recognition: SpeechRecognitionInstance,
  callbacks: SpeechRecognitionCallbacks
): void => {
  if (callbacks.onResult) {
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript && callbacks.onResult) {
        callbacks.onResult(finalTranscript, true);
      } else if (interimTranscript && callbacks.onResult) {
        callbacks.onResult(interimTranscript, false);
      }
    };
  }

  if (callbacks.onError) {
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      callbacks.onError?.(event.error);
    };
  }

  if (callbacks.onEnd) {
    recognition.onend = () => {
      callbacks.onEnd?.();
    };
  }

  if (callbacks.onStart) {
    recognition.onstart = () => {
      callbacks.onStart?.();
    };
  }
};

/**
 * Запуск распознавания
 */
export const startSpeechRecognition = (recognition: SpeechRecognitionInstance | null): boolean => {
  if (!recognition) {
    return false;
  }

  try {
    recognition.start();
    return true;
  } catch (error) {
    console.error('Ошибка запуска распознавания:', error);
    return false;
  }
};

/**
 * Остановка распознавания
 */
export const stopSpeechRecognition = (recognition: SpeechRecognitionInstance | null): void => {
  recognition?.stop();
};

/**
 * Очистка ресурсов
 */
export const cleanupSpeechRecognition = (recognition: SpeechRecognitionInstance | null): void => {
  if (recognition) {
    recognition.stop();
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    recognition.onstart = null;
  }
};
