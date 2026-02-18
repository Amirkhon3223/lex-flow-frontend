/**
 * @file i18n.service.ts
 * @description Сервис для управления интернационализацией приложения
 *
 * НАЗНАЧЕНИЕ:
 * - Управление текущим языком приложения
 * - Загрузка переводов из JSON файлов
 * - Получение переведенных строк по ключу
 * - Сохранение выбранного языка в localStorage
 */

export type Language = 'ru' | 'en' | 'tj';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tj', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯' },
];

const STORAGE_KEY = 'app-language';
const DEFAULT_LANGUAGE: Language = 'en';

type Translations = { [key: string]: string | Translations };

class I18nService {
  private currentLanguage: Language;
  private translations: Translations = {};
  public ready: Promise<void>;

  constructor() {
    const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language;
    this.currentLanguage =
      savedLanguage && this.isValidLanguage(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;

    this.ready = this.loadTranslations(this.currentLanguage);
  }

  /**
   * Проверяет, является ли язык валидным
   */
  private isValidLanguage(lang: string): lang is Language {
    return ['ru', 'en', 'tj'].includes(lang);
  }

  /**
   * Загружает переводы для указанного языка
   */
  private async loadTranslations(language: Language): Promise<void> {
    try {
      const translations = await import(`../../../assets/i18n/${language}.json`);
      this.translations = translations.default || translations;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Failed to load translations for language: ${language}`, error);
      }
      if (language !== DEFAULT_LANGUAGE) {
        const fallbackTranslations = await import(`../../../assets/i18n/${DEFAULT_LANGUAGE}.json`);
        this.translations = fallbackTranslations.default || fallbackTranslations;
      }
    }
  }

  /**
   * Получает текущий язык
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Получает информацию о текущем языке
   */
  getCurrentLanguageInfo(): LanguageInfo {
    return LANGUAGES.find((lang) => lang.code === this.currentLanguage) || LANGUAGES[0];
  }

  /**
   * Устанавливает новый язык
   */
  async setLanguage(language: Language): Promise<void> {
    if (!this.isValidLanguage(language)) {
      if (import.meta.env.DEV) {
        console.error(`Invalid language: ${language}`);
      }
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem(STORAGE_KEY, language);
    await this.loadTranslations(language);

    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language } }));
  }

  /**
   * Получает перевод по ключу
   * Поддерживает вложенные ключи через точку: "DASHBOARD.WELCOME"
   * Поддерживает интерполяцию параметров: "DASHBOARD.TASKS_TODAY" с params: { count: 5 }
   */
  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: string | Translations | undefined = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k] as string | Translations;
      } else {
        if (import.meta.env.DEV) {
          console.warn(`Translation key not found: ${key}`);
        }
        return key;
      }
    }

    if (typeof value !== 'string') {
      if (import.meta.env.DEV) {
        console.warn(`Translation value is not a string: ${key}`);
      }
      return key;
    }

    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match;
      });
    }

    return value;
  }

  /**
   * Получает все доступные языки
   */
  getAvailableLanguages(): LanguageInfo[] {
    return LANGUAGES;
  }
}

export const i18nService = new I18nService();
