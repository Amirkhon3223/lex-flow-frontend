import { Globe, Check } from 'lucide-react';
import { RussiaFlag } from '@/shared/components/flags/RussiaFlag';
import { TajikistanFlag } from '@/shared/components/flags/TajikistanFlag';
import { UKFlag } from '@/shared/components/flags/UKFlag';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx';

type LanguageCode = 'ru' | 'en' | 'tj';

const LANGUAGES = [
  { code: 'ru' as const, label: 'Русский' },
  { code: 'en' as const, label: 'English' },
  { code: 'tj' as const, label: 'Тоҷикӣ' },
];

export function LanguageSelectorPublic() {
  const { language, setLanguage } = useI18n();

  const currentLanguage = LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  const getFlagComponent = (langCode: LanguageCode) => {
    switch (langCode) {
      case 'ru':
        return <RussiaFlag className="w-5 h-4" />;
      case 'en':
        return <UKFlag className="w-5 h-4" />;
      case 'tj':
        return <TajikistanFlag className="w-5 h-4" />;
      default:
        return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {getFlagComponent(lang.code)}
              <span className={language === lang.code ? 'font-semibold' : ''}>
                {lang.label}
              </span>
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
