import { useState } from 'react';
import {
  Users,
  Briefcase,
  FileText,
  Bell,
  Search,
  Plus,
  Home,
  Settings,
  Calendar,
  BarChart3,
  Sparkles,
  ChevronRight,
  Clock,
  MoreHorizontal,
  Star,
  Tag,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { AddCaseDialog } from '@/modules/cases/ui/AddCaseDialog';
import { AddClientDialog } from '@/shared/components/AddClientDialog';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Progress } from '@/shared/ui/progress';
import { Separator } from '@/shared/ui/separator';

export default function App() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isAddCaseDialogOpen, setIsAddCaseDialogOpen] = useState(false);
  const [isUploadDocumentDialogOpen, setIsUploadDocumentDialogOpen] = useState(false);

  const priorities = [
    {
      title: 'Трудовой спор - увольнение',
      client: 'Иванов П.А.',
      deadline: 'Завтра',
      urgent: true,
      progress: 75,
    },
    {
      title: 'Договор аренды помещения',
      client: 'ООО "ТехноСтрой"',
      deadline: 'Через 5 дней',
      urgent: false,
      progress: 45,
    },
    {
      title: 'Наследственное дело',
      client: 'Смирнова А.В.',
      deadline: 'Через 2 недели',
      urgent: false,
      progress: 30,
    },
  ];

  const upcomingEvents = [
    { time: '10:00', title: 'Консультация с клиентом', type: 'meeting' },
    { time: '14:30', title: 'Заседание в суде', type: 'court' },
    { time: '16:00', title: 'Подготовка документов', type: 'task' },
  ];

  const recentActivity = [
    { action: 'добавил документ', item: '"Исковое заявление"', client: 'Иванов П.А.', time: '2 часа назад' },
    { action: 'обновил статус дела', item: '"Трудовой спор"', client: 'Петрова М.И.', time: '4 часа назад' },
    { action: 'создал новое дело', item: '"Договор подряда"', client: 'ООО "Строй+"', time: 'Вчера' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AddClientDialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen} />
      <AddCaseDialog open={isAddCaseDialogOpen} onOpenChange={setIsAddCaseDialogOpen} />
      <UploadDocumentDialog open={isUploadDocumentDialogOpen} onOpenChange={setIsUploadDocumentDialogOpen} />

      {}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white/80 backdrop-blur-2xl border-r border-gray-200/50 z-10">
        <div className="flex flex-col h-full">
          {}
          <div className="px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl tracking-tight">LexFlow</h1>
                <p className="text-xs text-gray-500">Legal Platform</p>
              </div>
            </div>
          </div>

          {}
          <nav className="flex-1 px-4 space-y-1">
            {[
              { icon: Home, label: 'Обзор', id: 'overview', route: ROUTES.DASHBOARD },
              { icon: Briefcase, label: 'Дела', id: 'cases', count: 47, route: ROUTES.CASES.BASE },
              { icon: Users, label: 'Клиенты', id: 'clients', count: 24, route: ROUTES.CLIENTS.BASE },
              { icon: FileText, label: 'Документы', id: 'documents', route: ROUTES.DOCUMENTS.BASE },
              { icon: Calendar, label: 'Календарь', id: 'calendar', route: ROUTES.CALENDAR },
              { icon: BarChart3, label: 'Аналитика', id: 'analytics', route: ROUTES.ANALYTICS },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  navigate(item.route);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={2} />
                <span className="flex-1 text-left text-[15px]">{item.label}</span>
                {item.count && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeSection === item.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {}
          <div className="p-4 space-y-1">
            <Separator className="mb-3 bg-gray-200" />
            <button
              onClick={() => navigate(ROUTES.AI_ASSISTANT)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5" strokeWidth={2} />
              <span className="text-[15px]">AI Помощник</span>
              <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs border-0">
                Новое
              </Badge>
            </button>
            <button
              onClick={() => navigate(ROUTES.SETTINGS)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <Settings className="w-5 h-5" strokeWidth={2} />
              <span className="text-[15px]">Настройки</span>
            </button>
          </div>
        </div>
      </aside>

      {}
      <div className="ml-72">
        {}
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/50">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
                <Input
                  placeholder="Поиск клиентов, дел, документов..."
                  className="pl-12 h-11 bg-gray-100/80 border-0 rounded-xl text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative w-11 h-11 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <Bell className="w-5 h-5 text-gray-600" strokeWidth={2} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </Button>

              <Avatar className="w-11 h-11 ring-2 ring-gray-200 ring-offset-2 cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                  АП
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {}
        <main className="p-8">
          {}
          <div className="mb-8">
            <h2 className="text-4xl tracking-tight mb-2">Добро пожаловать, Александр</h2>
            <p className="text-gray-500 text-lg">У вас 5 задач на сегодня</p>
          </div>

          {}
          <div className="grid grid-cols-4 gap-5 mb-8">
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-500" strokeWidth={2} />
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-0 text-xs">
                    +8%
                  </Badge>
                </div>
                <div className="text-3xl tracking-tight mb-1">47</div>
                <div className="text-sm text-gray-500">Активные дела</div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-500" strokeWidth={2} />
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-0 text-xs">
                    +12%
                  </Badge>
                </div>
                <div className="text-3xl tracking-tight mb-1">24</div>
                <div className="text-sm text-gray-500">Клиенты</div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-500" strokeWidth={2} />
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-0 text-xs">
                    +23%
                  </Badge>
                </div>
                <div className="text-3xl tracking-tight mb-1">156</div>
                <div className="text-sm text-gray-500">Документы</div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-500" strokeWidth={2} />
                  </div>
                  <Badge className="bg-red-50 text-red-700 border-0 text-xs">
                    Срочно
                  </Badge>
                </div>
                <div className="text-3xl tracking-tight mb-1">5</div>
                <div className="text-sm text-gray-500">Задачи на сегодня</div>
              </div>
            </Card>
          </div>

          {}
          <div className="grid grid-cols-3 gap-6">
            {}
            <div className="col-span-2 space-y-6">
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl tracking-tight">Приоритетные дела</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(ROUTES.CASES.BASE)}
                      className="text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer"
                    >
                      Все дела
                      <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2} />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {priorities.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(ROUTES.CASES.DETAIL('1'))}
                        className="group p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="tracking-tight">{item.title}</h4>
                              {item.urgent && (
                                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                  Срочно
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" strokeWidth={2} />
                                {item.client}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" strokeWidth={2} />
                                {item.deadline}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Прогресс</span>
                            <span className="text-gray-900">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {}
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">Последняя активность</h3>

                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          {index < recentActivity.length - 1 && (
                            <div className="w-px h-full bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-[15px] mb-1">
                            <span className="text-gray-900">Вы</span>{' '}
                            <span className="text-gray-500">{activity.action}</span>{' '}
                            <span className="text-gray-900">{activity.item}</span>
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>{activity.client}</span>
                            <span>•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {}
            <div className="space-y-6">
              {}
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/30 text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl tracking-tight">Сегодня</h3>
                    <Calendar className="w-5 h-5 opacity-80" strokeWidth={2} />
                  </div>

                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="text-sm opacity-80 w-14">{event.time}</div>
                        <div className="flex-1">
                          <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm">
                            <p className="text-sm">{event.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => navigate(ROUTES.CALENDAR)}
                    className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur-sm cursor-pointer"
                  >
                    Открыть календарь
                  </Button>
                </div>
              </Card>

              {}
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg tracking-tight">AI Инсайты</h3>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.5} />
                        </div>
                        <p className="text-sm text-amber-900">
                          Рекомендуется обновить договор для клиента ООО "ТехноСтрой"
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Tag className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
                        </div>
                        <p className="text-sm text-blue-900">
                          Найдено 3 похожих дела в архиве
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate(ROUTES.AI_ASSISTANT)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-2" strokeWidth={2.5} />
                    Спросить AI
                  </Button>
                </div>
              </Card>

              {}
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-lg tracking-tight mb-4">Быстрые действия</h3>

                  <div className="space-y-2">
                    <Button
                      onClick={() => setIsAddClientDialogOpen(true)}
                      className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                      Новый клиент
                    </Button>
                    <Button
                      onClick={() => setIsAddCaseDialogOpen(true)}
                      className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                      Новое дело
                    </Button>
                    <Button
                      onClick={() => setIsUploadDocumentDialogOpen(true)}
                      className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                      Загрузить документ
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
