/**
 * @file I18nContext.tsx
 * @description React контекст для интернационализации
 *
 * НАЗНАЧЕНИЕ:
 * - Предоставляет доступ к переводам во всех компонентах
 * - Управляет сменой языка
 * - Автоматически обновляет компоненты при смене языка
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { i18nService, type Language, type LanguageInfo } from '@/app/services/i18n/i18nService';

interface I18nContextValue {
  language: Language;
  languageInfo: LanguageInfo;
  availableLanguages: LanguageInfo[];
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(i18nService.getCurrentLanguage());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Слушаем событие смены языка
    const handleLanguageChange = () => {
      setLanguageState(i18nService.getCurrentLanguage());
      forceUpdate({});
    };

    window.addEventListener('languageChange', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const handleSetLanguage = async (newLanguage: Language) => {
    await i18nService.setLanguage(newLanguage);
    setLanguageState(newLanguage);
    forceUpdate({});
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    return i18nService.t(key, params);
  };

  const value: I18nContextValue = {
    language,
    languageInfo: i18nService.getCurrentLanguageInfo(),
    availableLanguages: i18nService.getAvailableLanguages(),
    setLanguage: handleSetLanguage,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Хук для использования i18n в компонентах
 * @example
 * const { t, language, setLanguage } = useI18n();
 * const title = t('DASHBOARD.WELCOME');
 * const tasksText = t('DASHBOARD.TASKS_TODAY', { count: 5 });
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
}
