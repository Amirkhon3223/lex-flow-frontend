import { ChevronRight } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

interface CaseClientCardProps {
  onViewProfile: () => void;
}

export function CaseClientCard({ onViewProfile }: CaseClientCardProps) {
  const { t } = useI18n();
  return (
    <Card>
      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">{t('CASES.CLIENT.TITLE')}</h3>

        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-border flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-base sm:text-lg">
              ИП
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h4 className="tracking-tight mb-1 text-sm sm:text-base">Иванов Петр</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">{t('CASES.CLIENT.SINCE')} января 2024</p>
          </div>
        </div>

        <Separator className="my-3 sm:my-4 bg-border" />

        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('CASES.CLIENT.PHONE')}</span>
            <span className="text-foreground">+7 (999) 123-45-67</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('CASES.CLIENT.EMAIL')}</span>
            <span className="text-foreground truncate ml-2">ivanov@mail.ru</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('CASES.CLIENT.TOTAL_CASES')}</span>
            <span className="text-foreground">3 {t('CASES.CLIENT.ACTIVE')}</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-3 sm:mt-4 rounded-xl border-border hover:bg-muted text-sm sm:text-base"
          onClick={onViewProfile}
        >
          {t('CASES.CLIENT.PROFILE')}
          <ChevronRight className="w-4 h-4 ml-2" strokeWidth={2} />
        </Button>
      </div>
    </Card>
  );
}
