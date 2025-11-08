import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Briefcase,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  Edit,
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

export default function ClientDetailPage() {
  const { id: _id } = useParams();

  const client = {
    id: 1,
    name: 'Иванов Петр Алексеевич',
    initials: 'ИП',
    type: 'Физическое лицо',
    since: 'Клиент с января 2024',
    vip: true,
    status: 'Активный клиент',
    email: 'ivanov@mail.ru',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Ленина, д. 10, кв. 25',
    birthDate: '15 марта 1985 (39 лет)',
    activeCases: 3,
    documents: 25,
    totalRevenue: '250 000 ₽',
    hoursWorked: 45,
    interactions: 12,
  };

  const cases = [
    {
      id: 1,
      title: 'Трудовой спор - незаконное увольнение',
      status: 'urgent',
      statusText: 'Срочно',
      inProgress: true,
      documents: 8,
      deadline: '20 окт 2025',
      timeLeft: '2 часа назад',
      progress: 75,
    },
    {
      id: 2,
      title: 'Восстановление на работе',
      status: 'review',
      statusText: 'На проверке',
      inProgress: true,
      documents: 5,
      deadline: '15 ноя 2025',
      timeLeft: '1 день назад',
      progress: 45,
    },
    {
      id: 3,
      title: 'Взыскание задолженности по зарплате',
      status: 'completed',
      statusText: 'Завершено',
      inProgress: false,
      documents: 12,
      deadline: '5 окт 2025',
      timeLeft: '5 дней назад',
      progress: 100,
    },
  ];

  return (
    <div className="space-y-6">
      {}
      <Link to="/clients" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Все клиенты
      </Link>

      {}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-600 text-xl text-white">
              {client.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {client.status}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
              <span>🏢 {client.type}</span>
              <span>📅 {client.since}</span>
              {client.vip && <span>⭐ VIP клиент</span>}
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Mail className="h-4 w-4" />
                {client.email}
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Phone className="h-4 w-4" />
                {client.phone}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Написать
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Новое дело
          </Button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Активных дел</p>
                <p className="mt-2 text-3xl font-bold">{client.activeCases}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Документов</p>
                <p className="mt-2 text-3xl font-bold">{client.documents}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Общий гонорар</p>
                <p className="mt-2 text-3xl font-bold">{client.totalRevenue}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Часов работы</p>
                <p className="mt-2 text-3xl font-bold">{client.hoursWorked}</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Взаимодействий</p>
                <p className="mt-2 text-3xl font-bold">{client.interactions}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Дела клиента</CardTitle>
              <span className="text-sm text-gray-600">3 дел</span>
            </CardHeader>
            <CardContent className="space-y-4">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{caseItem.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                        <span>📄 {caseItem.documents} документов</span>
                        <span>📅 {caseItem.deadline}</span>
                        <span>🕐 {caseItem.timeLeft}</span>
                      </div>
                    </div>
                    <Badge
                      className={
                        caseItem.status === 'urgent'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : caseItem.status === 'review'
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : 'bg-green-100 text-green-700 border-green-200'
                      }
                    >
                      {caseItem.statusText}
                    </Badge>
                  </div>
                  {caseItem.inProgress && (
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Прогресс</span>
                        <span className="font-medium">{caseItem.progress}%</span>
                      </div>
                      <Progress value={caseItem.progress} />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {}
        <div className="space-y-6">
          {}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Контактная информация</CardTitle>
              <Button variant="ghost" size="icon">
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
                  <div className="font-medium">{client.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-50 p-2">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Телефон</div>
                  <div className="font-medium">{client.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-50 p-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Адрес</div>
                  <div className="font-medium">{client.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-orange-50 p-2">
                  <CalendarIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Дата рождения</div>
                  <div className="font-medium">{client.birthDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-white">Финансы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Всего к оплате</span>
                <span className="text-xl font-bold">250 000 ₽</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Оплачено</span>
                <span className="text-xl font-bold">125 000 ₽</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Остаток</span>
                <span className="text-xl font-bold">125 000 ₽</span>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-blue-100">Процент оплаты</span>
                  <span className="font-medium">50%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-1/2 bg-white"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
