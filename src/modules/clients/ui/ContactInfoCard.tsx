import { Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';
import type { ContactInfoCardProps } from '@/app/types/clients/clients.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { getIconBgColor } from '@/shared/lib/color-utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function ContactInfoCard({ contactInfo, onEdit }: ContactInfoCardProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base sm:text-lg">{t('CLIENTS.FIELDS.CONTACT_INFO')}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 sm:h-10 sm:w-10">
          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-4 pb-1!">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div
            className={`rounded-lg p-1.5 sm:p-2 flex-shrink-0 ${getIconBgColor('text-blue-600')}`}
          >
            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t('CLIENTS.FIELDS.EMAIL')}
            </div>
            <div className="font-medium text-sm sm:text-base truncate">{contactInfo.email}</div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div
            className={`rounded-lg p-1.5 sm:p-2 flex-shrink-0 ${getIconBgColor('text-green-600')}`}
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t('CLIENTS.FIELDS.PHONE')}
            </div>
            <div className="font-medium text-sm sm:text-base">{contactInfo.phone}</div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div
            className={`rounded-lg p-1.5 sm:p-2 flex-shrink-0 ${getIconBgColor('text-purple-600')}`}
          >
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t('CLIENTS.FIELDS.ADDRESS')}
            </div>
            <div className="font-medium text-sm sm:text-base">{contactInfo.address}</div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div
            className={`rounded-lg p-1.5 sm:p-2 flex-shrink-0 ${getIconBgColor('text-orange-600')}`}
          >
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600" />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t('CLIENTS.FIELDS.BIRTH_DATE')}
            </div>
            <div className="font-medium text-sm sm:text-base">{contactInfo.birthDate}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
