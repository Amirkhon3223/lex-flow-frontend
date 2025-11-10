import { Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';
import type { ContactInfoCardProps } from '@/app/types/clients/clients.interfaces';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function ContactInfoCard({ contactInfo, onEdit }: ContactInfoCardProps) {
  return (
    <Card className="bg-white rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Контактная информация</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-2">
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Email</div>
            <div className="font-medium">{contactInfo.email}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-green-50 p-2">
            <Phone className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Телефон</div>
            <div className="font-medium">{contactInfo.phone}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-purple-50 p-2">
            <MapPin className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Адрес</div>
            <div className="font-medium">{contactInfo.address}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-orange-50 p-2">
            <Calendar className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Дата рождения</div>
            <div className="font-medium">{contactInfo.birthDate}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
