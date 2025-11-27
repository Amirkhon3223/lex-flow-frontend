/**
 * @file LanguageSelector.tsx
 * @description Компонент выбора языка приложения
 *
 * НАЗНАЧЕНИЕ:
 * - Отображает текущий язык с флагом
 * - Предоставляет dropdown меню для выбора языка
 * - Красиво интегрируется в хедер приложения
 */

import { Languages, Check } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import type { Language } from '@/app/services/i18n/i18nService';

export function LanguageSelector() {
  const { language, languageInfo, availableLanguages, setLanguage } = useI18n();

  const handleLanguageChange = async (newLanguage: Language) => {
    await setLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl hover:bg-gray-100 cursor-pointer"
        >
          <Languages className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </div>
            {language === lang.code && (
              <Check className="w-4 h-4 text-blue-500" strokeWidth={2} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
