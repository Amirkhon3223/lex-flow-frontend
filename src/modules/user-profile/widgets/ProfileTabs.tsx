import React from "react";
import { User, Bell, Shield, CreditCard, Eye } from 'lucide-react';
import { NotificationsTabContent } from '@/modules/settings/components/tabs/NotificationsTabContent';
import { SecurityTabContent } from '@/modules/settings/components/tabs/SecurityTabContent';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  ManagedSelect as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/managed-select';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function ProfileTabs({
  profileData,
  handleProfileChange,
}: {
  profileData: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    position: string;
    company: string;
    address: string;
    specialization: string;
  };
  handleProfileChange: (field: string, value: string) => void;
}) {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <Tabs defaultValue="profile" className="w-full">
        <div className="border-b border-gray-100 px-6 pt-6">
          <TabsList className="bg-gray-100 rounded-xl p-1">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="w-4 h-4 mr-2" strokeWidth={2} />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bell className="w-4 h-4 mr-2" strokeWidth={2} />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Shield className="w-4 h-4 mr-2" strokeWidth={2} />
              Безопасность
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CreditCard className="w-4 h-4 mr-2" strokeWidth={2} />
              Подписка
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="p-6 space-y-6">
          <div>
            <h3 className="text-lg tracking-tight mb-4">Личная информация</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm text-gray-600">
                  Фамилия
                </Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm text-gray-600">
                  Имя
                </Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-sm text-gray-600">
                  Отчество
                </Label>
                <Input
                  id="middleName"
                  value={profileData.middleName}
                  onChange={(e) => handleProfileChange('middleName', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          <div>
            <h3 className="text-lg tracking-tight mb-4">Контактные данные</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-gray-600">
                  Телефон
                </Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          <div>
            <h3 className="text-lg tracking-tight mb-4">Профессиональная информация</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm text-gray-600">
                    Должность
                  </Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => handleProfileChange('position', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-sm text-gray-600">
                    Специализация
                  </Label>
                  <Select
                    value={profileData.specialization}
                    onValueChange={(value) => handleProfileChange('specialization', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Трудовое право">Трудовое право</SelectItem>
                      <SelectItem value="Договорное право">Договорное право</SelectItem>
                      <SelectItem value="Семейное право">Семейное право</SelectItem>
                      <SelectItem value="Уголовное право">Уголовное право</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm text-gray-600">
                  Компания
                </Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm text-gray-600">
                  Адрес офиса
                </Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleProfileChange('address', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTabContent />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTabContent />
        </TabsContent>

        <TabsContent value="billing" className="p-6 space-y-6">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg shadow-purple-500/20 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl tracking-tight mb-1">Pro Plan</h3>
                  <p className="text-sm opacity-90">Активна до 15 января 2026</p>
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  Активна
                </Badge>
              </div>
              <div className="text-3xl tracking-tight mb-6">2 990 ₽ / месяц</div>
              <Button className="w-full bg-white/20 hover:bg-white/30 border-0 rounded-xl backdrop-blur-sm text-white">
                Управление подпиской
              </Button>
            </div>
          </Card>

          <div>
            <h3 className="text-lg tracking-tight mb-4">Возможности плана</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="tracking-tight mb-1">Клиенты</div>
                <div className="text-2xl text-blue-500">Безлимит</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="tracking-tight mb-1">Дела</div>
                <div className="text-2xl text-purple-500">Безлимит</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="tracking-tight mb-1">Хранилище</div>
                <div className="text-2xl text-green-500">100 ГБ</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="tracking-tight mb-1">Пользователи</div>
                <div className="text-2xl text-orange-500">5</div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          <div>
            <h3 className="text-lg tracking-tight mb-4">История платежей</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <div className="tracking-tight mb-1">Pro Plan - Октябрь 2025</div>
                  <div className="text-sm text-gray-500">15 октября 2025</div>
                </div>
                <div className="text-right">
                  <div className="tracking-tight">2 990 ₽</div>
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4 mr-1" strokeWidth={2} />
                    Чек
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <div className="tracking-tight mb-1">Pro Plan - Сентябрь 2025</div>
                  <div className="text-sm text-gray-500">15 сентября 2025</div>
                </div>
                <div className="text-right">
                  <div className="tracking-tight">2 990 ₽</div>
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4 mr-1" strokeWidth={2} />
                    Чек
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
