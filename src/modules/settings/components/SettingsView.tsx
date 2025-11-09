import {
  Settings,
  User,
  Bell,
  Lock,
  Globe,
  Shield,
  CreditCard,
  Users,
  Zap,
  Mail,
  Smartphone,
  Clock,
  Download,
} from 'lucide-react';
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


export function SettingsView() {
  return (
    <div>
      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
<div className="px-4 py-6">          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Settings className="w-6 h-6 text-gray-600" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-4xl tracking-tight">Настройки</h1>
              <p className="text-gray-500 text-lg">Управление аккаунтом и предпочтениями</p>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-gray-100 rounded-xl p-1.5 grid grid-cols-5 w-full">
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
              <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Users className="w-4 h-4 mr-2" strokeWidth={2} />
                Команда
              </TabsTrigger>
              <TabsTrigger value="billing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <CreditCard className="w-4 h-4 mr-2" strokeWidth={2} />
                Подписка
              </TabsTrigger>
            </TabsList>

            {}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">Личная информация</h3>

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
                    <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                      Отмена
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                      Сохранить изменения
                    </Button>
                  </div>
                </div>
              </Card>

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
            </TabsContent>

            {}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">Уведомления по email</h3>

                  <div className="space-y-4">
                    {[
                      { label: 'Новые дела', description: 'Уведомления о создании новых дел', checked: true },
                      { label: 'Дедлайны', description: 'Напоминания о приближающихся сроках', checked: true },
                      { label: 'Документы', description: 'Уведомления о новых документах', checked: true },
                      { label: 'Комментарии', description: 'Новые комментарии к делам', checked: false },
                      { label: 'Еженедельный отчет', description: 'Статистика за неделю', checked: true },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <h4 className="tracking-tight mb-1">{item.label}</h4>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <Switch defaultChecked={item.checked} />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">Push-уведомления</h3>

                  <div className="space-y-4">
                    {[
                      { label: 'Срочные дела', description: 'Важные срочные уведомления', checked: true },
                      { label: 'Встречи', description: 'Напоминания о встречах за 30 минут', checked: true },
                      { label: 'Сообщения', description: 'Новые сообщения от клиентов', checked: false },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <h4 className="tracking-tight mb-1">{item.label}</h4>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <Switch defaultChecked={item.checked} />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">Изменить пароль</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <Separator className="my-6 bg-gray-200" />

                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                    <Lock className="w-4 h-4 mr-2" strokeWidth={2} />
                    Обновить пароль
                  </Button>
                </div>
              </Card>

              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">Двухфакторная аутентификация</h3>

                  <div className="flex items-start justify-between p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-green-600" strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="tracking-tight text-green-900 mb-1">2FA активирована</h4>
                        <p className="text-sm text-green-700">Ваш аккаунт защищен двухфакторной аутентификацией</p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl border-green-200 hover:bg-green-100">
                      Отключить
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-4">Активные сессии</h3>
                  <p className="text-gray-500 mb-6">Это устройства, на которых выполнен вход в ваш аккаунт</p>

                  <div className="space-y-3">
                    {[
                      { device: 'MacBook Pro', location: 'Москва, Россия', current: true, time: 'Сейчас' },
                      { device: 'iPhone 14', location: 'Москва, Россия', current: false, time: '2 часа назад' },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="tracking-tight">{session.device}</h4>
                            {session.current && (
                              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                                Текущее
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{session.location} • {session.time}</p>
                        </div>
                        {!session.current && (
                          <Button variant="outline" size="sm" className="rounded-lg border-gray-200 hover:bg-red-50 hover:text-red-600">
                            Завершить
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {}
            <TabsContent value="team" className="space-y-6">
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl tracking-tight">Члены команды</h3>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                      <Users className="w-4 h-4 mr-2" strokeWidth={2} />
                      Пригласить
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Александр Иванов', email: 'a.ivanov@lexflow.ru', role: 'admin', status: 'Администратор' },
                      { name: 'Мария Смирнова', email: 'm.smirnova@lexflow.ru', role: 'lawyer', status: 'Юрист' },
                      { name: 'Дмитрий Петров', email: 'd.petrov@lexflow.ru', role: 'lawyer', status: 'Юрист' },
                      { name: 'Елена Волкова', email: 'e.volkova@lexflow.ru', role: 'assistant', status: 'Ассистент' },
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="tracking-tight mb-1">{member.name}</h4>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`border-0 ${
                            member.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            member.role === 'lawyer' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {member.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <Settings className="w-4 h-4" strokeWidth={2} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {}
            <TabsContent value="billing" className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/30 text-white">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <Badge className="bg-white/20 text-white border-0 mb-3">
                        <Zap className="w-3 h-3 mr-1" strokeWidth={2} />
                        Премиум
                      </Badge>
                      <h3 className="text-3xl tracking-tight mb-2">LexFlow Premium</h3>
                      <p className="opacity-90">Безлимитный доступ ко всем функциям</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl tracking-tight mb-1">12 990 ₽</div>
                      <p className="opacity-90">в месяц</p>
                    </div>
                  </div>

                  <Separator className="my-6 bg-white/20" />

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="opacity-75 mb-1">Следующая оплата</p>
                      <p className="text-lg">20 ноября 2025</p>
                    </div>
                    <div>
                      <p className="opacity-75 mb-1">Метод оплаты</p>
                      <p className="text-lg">•••• 4242</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm">
                      Изменить план
                    </Button>
                    <Button className="flex-1 bg-white text-blue-600 hover:bg-gray-50 border-0 rounded-xl">
                      Управление оплатой
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">История платежей</h3>

                  <div className="space-y-3">
                    {[
                      { date: '20 окт 2025', amount: '12 990 ₽', status: 'Оплачено', invoice: '#INV-001' },
                      { date: '20 сен 2025', amount: '12 990 ₽', status: 'Оплачено', invoice: '#INV-002' },
                      { date: '20 авг 2025', amount: '12 990 ₽', status: 'Оплачено', invoice: '#INV-003' },
                    ].map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <h4 className="tracking-tight mb-1">{payment.invoice}</h4>
                          <p className="text-sm text-gray-500">{payment.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="tracking-tight">{payment.amount}</p>
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                              {payment.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <Download className="w-4 h-4" strokeWidth={2} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
