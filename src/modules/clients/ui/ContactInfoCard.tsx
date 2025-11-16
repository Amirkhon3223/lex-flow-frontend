import { Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';
import type { ContactInfoCardProps } from '@/app/types/clients/clients.interfaces';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function ContactInfoCard({ contactInfo, onEdit }: ContactInfoCardProps) {
  return (
    <Card className="bg-white rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Контактная информация</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 sm:h-10 sm:w-10">
          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="rounded-lg bg-blue-50 p-1.5 sm:p-2 flex-shrink-0">
            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm text-gray-600">Email</div>
            <div className="font-medium text-sm sm:text-base truncate">{contactInfo.email}</div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="rounded-lg bg-green-50 p-1.5 sm:p-2 flex-shrink-0">
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-600">Телефон</div>
            <div className="font-medium text-sm sm:text-base">{contactInfo.phone}</div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="rounded-lg bg-purple-50 p-1.5 sm:p-2 flex-shrink-0">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm text-gray-600">Адрес</div>
            <div className="font-medium text-sm sm:text-base">{contactInfo.address}</div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="rounded-lg bg-orange-50 p-1.5 sm:p-2 flex-shrink-0">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600" />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-600">Дата рождения</div>
            <div className="font-medium text-sm sm:text-base">{contactInfo.birthDate}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
