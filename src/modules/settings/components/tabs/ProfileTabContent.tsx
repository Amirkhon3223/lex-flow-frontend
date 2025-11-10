import { Clock, Globe, Mail, Smartphone } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';

export function ProfileTabContent() {
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile saved');
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Личная информация</h3>

          <form onSubmit={handleProfileSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input
                    id="firstName"
                    defaultValue="Александр"
                    className="h-12 rounded-xl border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    defaultValue="Иванов"
                    className="h-12 rounded-xl border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                  <Input
                    id="email"
                    type="email"
                    defaultValue="aleksandr.ivanov@lexflow.ru"
                    className="h-12 pl-12 rounded-xl border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue="+7 (999) 123-45-67"
                    className="h-12 pl-12 rounded-xl border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Должность</Label>
                <Input
                  id="position"
                  defaultValue="Старший юрист"
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>
            </div>

            <Separator className="my-6 bg-gray-200" />

            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                Отмена
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                Сохранить изменения
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Regional Settings */}
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <h3 className="text-xl tracking-tight mb-6">Региональные настройки</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Язык</Label>
              <Select defaultValue="ru">
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <Globe className="w-4 h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Часовой пояс</Label>
              <Select defaultValue="msk">
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" strokeWidth={2} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msk">Москва (GMT+3)</SelectItem>
                  <SelectItem value="spb">Санкт-Петербург (GMT+3)</SelectItem>
                  <SelectItem value="ekb">Екатеринбург (GMT+5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
