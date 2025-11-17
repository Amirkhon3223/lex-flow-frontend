import { useState } from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save,
  Upload,
  Bell,
  Lock,
  CreditCard,
  Shield,
  LogOut,
  Briefcase,
  Trash2,
  Eye,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { Switch } from '@/shared/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';


export function UserProfileView() {
  const onBack = () => window.history.back();
  const onLogout = () => console.log('Logout clicked');

  const [profileData, setProfileData] = useState({
    firstName: 'Александр',
    lastName: 'Петров',
    middleName: 'Иванович',
    email: 'petrov@lexflow.ru',
    phone: '+7 (999) 999-99-99',
    position: 'Старший юрист',
    company: 'Юридическая фирма "ЛексПро"',
    address: 'г. Москва, ул. Тверская, д. 1, офис 101',
    birthDate: '1985-06-15',
    specialization: 'Трудовое право',
  });

  const [notifications, setNotifications] = useState({
    emailNewCase: true,
    emailNewDocument: true,
    emailMeetingReminder: true,
    emailPayment: true,
    pushNewCase: true,
    pushMeetingReminder: true,
    pushDeadline: true,
    smsUrgent: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    loginNotifications: true,
    sessionTimeout: '30',
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const stats = [
    { label: 'Активных дел', value: '47', icon: Briefcase, color: 'text-blue-500' },
    { label: 'Клиентов', value: '24', icon: User, color: 'text-purple-500' },
    { label: 'Завершено дел', value: '128', icon: Briefcase, color: 'text-green-500' },
    { label: 'Дней в системе', value: '342', icon: Calendar, color: 'text-orange-500' },
  ];

  return (
    <div>
      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="w-10 h-10 rounded-xl hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                </Button>
              )}
              <div>
                <h1 className="text-3xl tracking-tight mb-1">Профиль</h1>
                <p className="text-gray-500">Управление личными данными и настройками</p>
              </div>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md">
              <Save className="w-4 h-4 mr-2" strokeWidth={2} />
              Сохранить изменения
            </Button>
          </div>
        </div>
      </header>

      {}
      <main className="py-6">
        <div className="grid grid-cols-3 gap-6">
          {}
          <div className="space-y-6">
            <Card>
              <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 ring-4 ring-gray-100">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl">
                      АП
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
                  >
                    <Upload className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </div>

                <h3 className="text-xl tracking-tight mb-1">
                  {profileData.lastName} {profileData.firstName}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{profileData.position}</p>
                <Badge className="bg-purple-100 text-purple-700 border-0 mb-4">
                  Pro аккаунт
                </Badge>

                <Separator className="my-4 bg-gray-100" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" strokeWidth={2} />
                    <span className="truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" strokeWidth={2} />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" strokeWidth={2} />
                    <span>Москва, Россия</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card >
              <div className="p-6">
                <h3 className="text-lg tracking-tight mb-4">Статистика</h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                          <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
                        </div>
                        <span className="text-sm text-gray-600">{stat.label}</span>
                      </div>
                      <span className={`text-lg tracking-tight ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card >
              <div className="p-6">
                <h3 className="text-lg tracking-tight mb-2">Сессия</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Выйти из аккаунта на этом устройстве
                </p>
                <Button
                  onClick={onLogout}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" strokeWidth={2} />
                  Выйти из аккаунта
                </Button>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-lg shadow-red-500/20 text-white">
              <div className="p-6">
                <h3 className="text-lg tracking-tight mb-2">Удаление аккаунта</h3>
                <p className="text-sm opacity-90 mb-4">
                  Это действие необратимо. Все ваши данные будут удалены.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl"
                >
                  <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                  Удалить аккаунт
                </Button>
              </div>
            </Card>
          </div>

          {}
          <div className="col-span-2">
            <Card >
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

                <TabsContent value="notifications" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg tracking-tight mb-4">Email уведомления</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Новые дела</div>
                          <div className="text-sm text-gray-500">Уведомления о новых делах</div>
                        </div>
                        <Switch
                          checked={notifications.emailNewCase}
                          onCheckedChange={(checked) => handleNotificationChange('emailNewCase', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Новые документы</div>
                          <div className="text-sm text-gray-500">Уведомления о загрузке документов</div>
                        </div>
                        <Switch
                          checked={notifications.emailNewDocument}
                          onCheckedChange={(checked) => handleNotificationChange('emailNewDocument', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Напоминания о встречах</div>
                          <div className="text-sm text-gray-500">За 30 минут до встречи</div>
                        </div>
                        <Switch
                          checked={notifications.emailMeetingReminder}
                          onCheckedChange={(checked) => handleNotificationChange('emailMeetingReminder', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Платежи</div>
                          <div className="text-sm text-gray-500">Уведомления о полученных платежах</div>
                        </div>
                        <Switch
                          checked={notifications.emailPayment}
                          onCheckedChange={(checked) => handleNotificationChange('emailPayment', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div>
                    <h3 className="text-lg tracking-tight mb-4">Push уведомления</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Новые дела</div>
                          <div className="text-sm text-gray-500">Push уведомления в браузере</div>
                        </div>
                        <Switch
                          checked={notifications.pushNewCase}
                          onCheckedChange={(checked) => handleNotificationChange('pushNewCase', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Напоминания о встречах</div>
                          <div className="text-sm text-gray-500">Push уведомления за 30 минут</div>
                        </div>
                        <Switch
                          checked={notifications.pushMeetingReminder}
                          onCheckedChange={(checked) => handleNotificationChange('pushMeetingReminder', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Срочные дедлайны</div>
                          <div className="text-sm text-gray-500">За 24 часа до истечения срока</div>
                        </div>
                        <Switch
                          checked={notifications.pushDeadline}
                          onCheckedChange={(checked) => handleNotificationChange('pushDeadline', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div>
                    <h3 className="text-lg tracking-tight mb-4">SMS уведомления</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Срочные уведомления</div>
                          <div className="text-sm text-gray-500">Только критически важные события</div>
                        </div>
                        <Switch
                          checked={notifications.smsUrgent}
                          onCheckedChange={(checked) => handleNotificationChange('smsUrgent', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg tracking-tight mb-4">Смена пароля</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm text-gray-600">
                          Текущий пароль
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm text-gray-600">
                          Новый пароль
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm text-gray-600">
                          Подтвердите пароль
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                        />
                      </div>
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                        <Lock className="w-4 h-4 mr-2" strokeWidth={2} />
                        Изменить пароль
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div>
                    <h3 className="text-lg tracking-tight mb-4">Двухфакторная аутентификация</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 mb-4">
                      <div>
                        <div className="tracking-tight mb-1">2FA включена</div>
                        <div className="text-sm text-gray-500">Дополнительная защита аккаунта</div>
                      </div>
                      <Switch
                        checked={security.twoFactor}
                        onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
                      />
                    </div>
                    {security.twoFactor && (
                      <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                        Настроить 2FA
                      </Button>
                    )}
                  </div>

                  <Separator className="bg-gray-100" />

                  <div>
                    <h3 className="text-lg tracking-tight mb-4">Дополнительные настройки</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="tracking-tight mb-1">Уведомления о входе</div>
                          <div className="text-sm text-gray-500">Email при входе с нового устройства</div>
                        </div>
                        <Switch
                          checked={security.loginNotifications}
                          onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginNotifications: checked }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout" className="text-sm text-gray-600">
                          Тайм-аут сессии
                        </Label>
                        <Select
                          value={security.sessionTimeout}
                          onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: value }))}
                        >
                          <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="15">15 минут</SelectItem>
                            <SelectItem value="30">30 минут</SelectItem>
                            <SelectItem value="60">1 час</SelectItem>
                            <SelectItem value="240">4 часа</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div>
                    <h3 className="text-lg tracking-tight mb-4 text-red-600">Активные сессии</h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="tracking-tight">MacBook Pro • Safari</div>
                          <Badge className="bg-green-100 text-green-700 border-0">Текущая</Badge>
                        </div>
                        <div className="text-sm text-gray-500">Москва, Россия • Последняя активность: Сейчас</div>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="tracking-tight">iPhone 14 • Safari</div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 rounded-lg">
                            Завершить
                          </Button>
                        </div>
                        <div className="text-sm text-gray-500">Москва, Россия • 2 часа назад</div>
                      </div>
                    </div>
                  </div>
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
          </div>
        </div>
      </main>
    </div>
  );
}
