import { useState } from 'react';
import {
  ArrowLeft,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Link,
  Mail as MailIcon,
  Briefcase,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  Edit,
  Send,
  Star,
  Building2,
  ChevronRight,
  Plus,
  Download,
  Share2,
  MessageSquare,
  Video,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { CaseStatusEnum, CasePriorityEnum } from '@/app/types/cases/cases.enums';
import { ClientTimelineTypeEnum } from '@/app/types/clients/clients.enums';
import { AddCaseDialog } from '@/shared/components/AddCaseDialog';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Progress } from '@/shared/ui/progress';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ClientMeetingsCalendar } from './ClientMeetingsCalendar';
import { EditClientDialog } from './EditClientDialog';

export function ClientDetailView() {
  const navigate = useNavigate();
  const onBack = () => navigate(ROUTES.CLIENTS.BASE);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddCaseDialogOpen, setIsAddCaseDialogOpen] = useState(false);

  const handleDownloadDocument = (docName: string) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = docName;
    link.click();
    console.log('Downloading:', docName);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    console.log('Link copied:', url);
  };

  const handleShareEmail = () => {
    const url = window.location.href;
    const subject = 'Поделиться клиентом';
    const body = `Посмотрите этого клиента: ${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const clientCases = [
    {
      id: 1,
      title: 'Трудовой спор - незаконное увольнение',
      status: CaseStatusEnum.IN_PROGRESS,
      priority: CasePriorityEnum.HIGH,
      deadline: '20 окт 2025',
      progress: 75,
      documents: 8,
      lastUpdate: '2 часа назад',
    },
    {
      id: 2,
      title: 'Восстановление на работе',
      status: CaseStatusEnum.REVIEW,
      priority: CasePriorityEnum.MEDIUM,
      deadline: '15 ноя 2025',
      progress: 45,
      documents: 5,
      lastUpdate: '1 день назад',
    },
    {
      id: 3,
      title: 'Взыскание задолженности по зарплате',
      status: CaseStatusEnum.COMPLETED,
      priority: CasePriorityEnum.LOW,
      deadline: '5 окт 2025',
      progress: 100,
      documents: 12,
      lastUpdate: '5 дней назад',
    },
  ];

  const timeline = [
    {
      date: '15 окт 2025, 14:30',
      title: 'Встреча в офисе',
      description: 'Обсуждение стратегии по трудовому спору',
      type: ClientTimelineTypeEnum.MEETING,
      icon: Video,
    },
    {
      date: '12 окт 2025, 11:00',
      title: 'Документ отправлен',
      description: 'Исковое заявление отправлено клиенту на согласование',
      type: ClientTimelineTypeEnum.DOCUMENT,
      icon: FileText,
    },
    {
      date: '10 окт 2025, 16:00',
      title: 'Консультация по телефону',
      description: 'Обсуждение деталей увольнения - 45 минут',
      type: ClientTimelineTypeEnum.CALL,
      icon: Phone,
    },
    {
      date: '8 окт 2025, 10:00',
      title: 'Оплата получена',
      description: 'Поступил первый платеж - 75 000 ₽',
      type: ClientTimelineTypeEnum.PAYMENT,
      icon: DollarSign,
    },
    {
      date: '5 окт 2025, 09:00',
      title: 'Новое дело создано',
      description: 'Трудовой спор - незаконное увольнение',
      type: ClientTimelineTypeEnum.SYSTEM,
      icon: Briefcase,
    },
  ];

  const documents = [
    { name: 'Паспорт (копия).pdf', date: '5 окт 2025', size: '1.2 MB', category: 'Личные документы' },
    { name: 'Трудовой договор.pdf', date: '5 окт 2025', size: '856 KB', category: 'Договоры' },
    { name: 'Приказ об увольнении.pdf', date: '8 окт 2025', size: '524 KB', category: 'Судебные документы' },
    { name: 'Исковое заявление.pdf', date: '12 окт 2025', size: '2.4 MB', category: 'Судебные документы' },
  ];

  const financialData = [
    { label: 'Всего к оплате', amount: 250000, color: 'text-gray-900' },
    { label: 'Оплачено', amount: 125000, color: 'text-green-600' },
    { label: 'Остаток', amount: 125000, color: 'text-orange-600' },
  ];

  const notes = [
    {
      date: '15 окт 2025',
      text: 'Клиент очень обеспокоен сроками. Необходимо ускорить процесс подготовки документов.',
      author: 'Вы',
    },
    {
      date: '10 окт 2025',
      text: 'Предоставил все необходимые документы. Можно начинать работу над исковым заявлением.',
      author: 'Вы',
    },
  ];

  return (
    <div>
      <EditClientDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      <AddCaseDialog open={isAddCaseDialogOpen} onOpenChange={setIsAddCaseDialogOpen} />

      {}
      <header className="relative bg-white border-b border-gray-200/50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" className="text-blue-500 hover:bg-blue-50 rounded-xl -ml-2" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2} />
              Все клиенты
            </Button>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                    <Share2 className="w-5 h-5" strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link className="w-4 h-4 mr-2" strokeWidth={2} />
                    Скопировать ссылку
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareEmail}>
                    <MailIcon className="w-4 h-4 mr-2" strokeWidth={2} />
                    Поделиться в почте
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 ring-4 ring-gray-100">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl">
                  ИП
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl tracking-tight">Иванов Петр Алексеевич</h1>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    Активный клиент
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-[15px] text-gray-500 mb-3">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" strokeWidth={2} />
                    Физическое лицо
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    Клиент с января 2024
                  </span>
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={2} />
                    VIP клиент
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-200 hover:bg-gray-50"
                    onClick={() => window.location.href = 'mailto:ivanov@mail.ru'}
                  >
                    <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
                    ivanov@mail.ru
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-200 hover:bg-gray-50"
                    onClick={() => window.location.href = 'tel:+79991234567'}
                  >
                    <Phone className="w-4 h-4 mr-2" strokeWidth={2} />
                    +7 (999) 123-45-67
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                <MessageSquare className="w-4 h-4 mr-2" strokeWidth={2} />
                Написать
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
                onClick={() => setIsAddCaseDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                Новое дело
              </Button>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="px-8 py-6">
        {}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="bg-white border-0 shadow-sm">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-500" strokeWidth={2} />
                </div>
              </div>
              <div className="text-2xl tracking-tight mb-1">3</div>
              <div className="text-sm text-gray-500">Активных дел</div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-500" strokeWidth={2} />
                </div>
              </div>
              <div className="text-2xl tracking-tight mb-1">25</div>
              <div className="text-sm text-gray-500">Документов</div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" strokeWidth={2} />
                </div>
              </div>
              <div className="text-2xl tracking-tight mb-1">250k ₽</div>
              <div className="text-sm text-gray-500">Общий гонорар</div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-500" strokeWidth={2} />
                </div>
              </div>
              <div className="text-2xl tracking-tight mb-1">45</div>
              <div className="text-sm text-gray-500">Часов работы</div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-red-500" strokeWidth={2} />
                </div>
              </div>
              <div className="text-2xl tracking-tight mb-1">12</div>
              <div className="text-sm text-gray-500">Взаимодействий</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {}
          <div className="col-span-2 space-y-6">
            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl tracking-tight">Дела клиента</h3>
                  <Badge className="bg-gray-100 text-gray-700 border-0">
                    {clientCases.length} дел
                  </Badge>
                </div>

                <div className="space-y-3">
                  {clientCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="group p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="tracking-tight">{caseItem.title}</h4>
                            {caseItem.priority === CasePriorityEnum.HIGH && (
                              <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                Срочно
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <FileText className="w-4 h-4" strokeWidth={2} />
                              {caseItem.documents} документов
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" strokeWidth={2} />
                              {caseItem.deadline}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" strokeWidth={2} />
                              {caseItem.lastUpdate}
                            </span>
                          </div>
                        </div>

                        <Badge className={`${
                          caseItem.status === CaseStatusEnum.IN_PROGRESS
                            ? 'bg-blue-100 text-blue-700'
                            : caseItem.status === CaseStatusEnum.REVIEW
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        } border-0`}>
                          {caseItem.status === CaseStatusEnum.IN_PROGRESS
                            ? 'В работе'
                            : caseItem.status === CaseStatusEnum.REVIEW
                            ? 'На проверке'
                            : 'Завершено'}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Прогресс</span>
                          <span className="text-gray-900">{caseItem.progress}%</span>
                        </div>
                        <Progress value={caseItem.progress} className="h-2" />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 text-blue-500 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Открыть дело
                        <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {}
            <Card className="bg-white border-0 shadow-sm">
              <Tabs defaultValue="timeline" className="w-full">
                <div className="border-b border-gray-100 px-6 pt-6">
                  <TabsList className="bg-gray-100 rounded-xl p-1">
                    <TabsTrigger value="timeline" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      История
                    </TabsTrigger>
                    <TabsTrigger value="meetings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Встречи
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Документы
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Заметки
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="timeline" className="p-6">
                  <div className="space-y-6">
                    {timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            index === 0
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                          }`}>
                            <event.icon className={`w-5 h-5 ${
                              index === 0 ? 'text-blue-500' : 'text-gray-400'
                            }`} strokeWidth={2} />
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-px h-full bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="tracking-tight mb-1">{event.title}</h4>
                              <p className="text-sm text-gray-500">{event.description}</p>
                            </div>
                            <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                              {event.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="meetings" className="p-6">
                  <ClientMeetingsCalendar />
                </TabsContent>

                <TabsContent value="documents" className="p-6 space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-500" strokeWidth={2} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="tracking-tight mb-1 truncate">{doc.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.date}</span>
                          <span>•</span>
                          <span>{doc.category}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDownloadDocument(doc.name)}
                      >
                        <Download className="w-4 h-4" strokeWidth={2} />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="notes" className="p-6">
                  <div className="space-y-4">
                    {notes.map((note, index) => (
                      <div key={index} className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm text-amber-900">{note.author}</span>
                          <span className="text-sm text-amber-600">{note.date}</span>
                        </div>
                        <p className="text-sm text-amber-900">{note.text}</p>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-gray-50">
                      <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                      Добавить заметку
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {}
          <div className="space-y-6">
            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg tracking-tight">Контактная информация</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-blue-50"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Edit className="w-4 h-4 text-blue-500" strokeWidth={2} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-500" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-500 mb-1">Email</div>
                      <div className="text-sm text-gray-900 truncate">ivanov@mail.ru</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-500" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">Телефон</div>
                      <div className="text-sm text-gray-900">+7 (999) 123-45-67</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-500" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">Адрес</div>
                      <div className="text-sm text-gray-900">г. Москва, ул. Ленина, д. 10, кв. 25</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-orange-500" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">Дата рождения</div>
                      <div className="text-sm text-gray-900">15 марта 1985 (39 лет)</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <DollarSign className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg tracking-tight">Финансы</h3>
                </div>

                <div className="space-y-4">
                  {financialData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm opacity-90">{item.label}</span>
                        <span className="text-xl tracking-tight">
                          {item.amount.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      {index < financialData.length - 1 && (
                        <Separator className="my-3 bg-white/20" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-sm opacity-90 mb-1">Процент оплаты</div>
                  <div className="flex items-center gap-3">
                    <Progress value={50} className="h-2 flex-1 bg-white/20" />
                    <span className="text-sm">50%</span>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 border-0 rounded-xl backdrop-blur-sm text-white">
                  Выставить счет
                  <Send className="w-4 h-4 ml-2" strokeWidth={2} />
                </Button>
              </div>
            </Card>

            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg tracking-tight mb-4">Быстрые действия</h3>

                <div className="space-y-2">
                  <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-xl shadow-md">
                    <Video className="w-4 h-4 mr-2" strokeWidth={2} />
                    Запланировать встречу
                  </Button>
                  <Button className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl">
                    <FileText className="w-4 h-4 mr-2" strokeWidth={2} />
                    Создать документ
                  </Button>
                  <Button className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl">
                    <Send className="w-4 h-4 mr-2" strokeWidth={2} />
                    Отправить email
                  </Button>
                  <Button className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl">
                    <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                    Экспорт данных
                  </Button>
                </div>
              </div>
            </Card>

            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg tracking-tight mb-4">Дополнительно</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ИНН</span>
                    <span className="text-gray-900">771234567890</span>
                  </div>
                  <Separator className="bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Источник</span>
                    <span className="text-gray-900">Рекомендация</span>
                  </div>
                  <Separator className="bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Категория</span>
                    <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                      VIP
                    </Badge>
                  </div>
                  <Separator className="bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Менеджер</span>
                    <span className="text-gray-900">Александр П.</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
