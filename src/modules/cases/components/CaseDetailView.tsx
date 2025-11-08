import {
  ArrowLeft,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  Clock,
  FileText,
  Download,
  Share2,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Eye,
  ChevronRight,
  TrendingUp,
  DollarSign,
  History,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';


export function CaseDetailView() {
  const onBack = () => window.history.back();

  const documents = [
    {
      id: 1,
      name: 'Исковое заявление.pdf',
      size: '2.4 MB',
      date: '12 окт 2025',
      versions: 3,
      status: 'final',
    },
    {
      id: 2,
      name: 'Трудовой договор.pdf',
      size: '1.8 MB',
      date: '10 окт 2025',
      versions: 2,
      status: 'review',
    },
    {
      id: 3,
      name: 'Приказ об увольнении.pdf',
      size: '856 KB',
      date: '8 окт 2025',
      versions: 1,
      status: 'draft',
    },
  ];

  const timeline = [
    {
      date: '15 окт 2025, 14:30',
      title: 'Документ отправлен клиенту',
      description: 'Исковое заявление.pdf',
      type: 'document',
    },
    {
      date: '14 окт 2025, 11:00',
      title: 'Встреча с клиентом',
      description: 'Обсуждение стратегии защиты',
      type: 'meeting',
    },
    {
      date: '12 окт 2025, 16:45',
      title: 'Создан новый документ',
      description: 'Исковое заявление.pdf (версия 3)',
      type: 'document',
    },
    {
      date: '10 окт 2025, 09:15',
      title: 'Дело создано',
      description: 'Трудовой спор - незаконное увольнение',
      type: 'system',
    },
  ];

  const tasks = [
    { id: 1, title: 'Подготовить возражение на иск', completed: true },
    { id: 2, title: 'Собрать доказательства', completed: true },
    { id: 3, title: 'Встретиться с клиентом', completed: false },
    { id: 4, title: 'Подать документы в суд', completed: false },
  ];

  const aiInsights = [
    {
      type: 'risk',
      title: 'Выявлен риск',
      description: 'Отсутствует уведомление о сокращении за 2 месяца',
      priority: 'high',
    },
    {
      type: 'opportunity',
      title: 'Сильная позиция',
      description: 'Есть свидетели нарушения процедуры увольнения',
      priority: 'medium',
    },
    {
      type: 'deadline',
      title: 'Приближается срок',
      description: 'Подача в суд через 5 дней',
      priority: 'high',
    },
  ];

  return (
    <div>
      {}
      <header className="relative bg-white border-b border-gray-200/50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" className="text-blue-500 hover:bg-blue-50 rounded-xl -ml-2" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2} />
              Все дела
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                <Share2 className="w-5 h-5" strokeWidth={2} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl tracking-tight">Трудовой спор - незаконное увольнение</h1>
                <Badge className="bg-amber-100 text-amber-700 border-0">
                  В работе
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-[15px] text-gray-500">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" strokeWidth={2} />
                  Иванов Петр Алексеевич
                </span>
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" strokeWidth={2} />
                  Трудовое право
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" strokeWidth={2} />
                  Дедлайн: 20 октября 2025
                </span>
              </div>
            </div>

            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md">
              <Paperclip className="w-4 h-4 mr-2" strokeWidth={2} />
              Добавить документ
            </Button>
          </div>
        </div>
      </header>

      {}
      <main className="px-8 py-6">
        <div className="grid grid-cols-3 gap-6">
          {}
          <div className="col-span-2 space-y-6">
            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg tracking-tight">Прогресс дела</h3>
                  <span className="text-2xl tracking-tight">75%</span>
                </div>
                <Progress value={75} className="h-2 mb-4" />
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl tracking-tight mb-1">8</div>
                    <div className="text-sm text-gray-500">Документов</div>
                  </div>
                  <div>
                    <div className="text-2xl tracking-tight mb-1">12</div>
                    <div className="text-sm text-gray-500">Событий</div>
                  </div>
                  <div>
                    <div className="text-2xl tracking-tight mb-1">5</div>
                    <div className="text-sm text-gray-500">Дней до суда</div>
                  </div>
                  <div>
                    <div className="text-2xl tracking-tight mb-1">3</div>
                    <div className="text-sm text-gray-500">Задачи</div>
                  </div>
                </div>
              </div>
            </Card>

            {}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 border-0 shadow-lg shadow-purple-500/20 text-white">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl tracking-tight">AI Анализ дела</h3>
                </div>

                <div className="space-y-3 mb-5">
                  {aiInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          insight.priority === 'high'
                            ? 'bg-white/20'
                            : 'bg-white/10'
                        }`}>
                          {insight.type === 'risk' && <AlertCircle className="w-4 h-4" strokeWidth={2.5} />}
                          {insight.type === 'opportunity' && <TrendingUp className="w-4 h-4" strokeWidth={2.5} />}
                          {insight.type === 'deadline' && <Clock className="w-4 h-4" strokeWidth={2.5} />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm mb-1 opacity-90">{insight.title}</div>
                          <div className="text-sm opacity-75">{insight.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-white/20 hover:bg-white/30 border-0 rounded-xl backdrop-blur-sm text-white">
                  Полный AI отчет
                  <ChevronRight className="w-4 h-4 ml-2" strokeWidth={2} />
                </Button>
              </div>
            </Card>

            {}
            <Card className="bg-white border-0 shadow-sm">
              <Tabs defaultValue="documents" className="w-full">
                <div className="border-b border-gray-100 px-6 pt-6">
                  <TabsList className="bg-gray-100 rounded-xl p-1">
                    <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Документы
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      История
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Заметки
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="documents" className="p-6 space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-500" strokeWidth={2} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="tracking-tight truncate">{doc.name}</h4>
                          <Badge className={`${
                            doc.status === 'final'
                              ? 'bg-green-100 text-green-700'
                              : doc.status === 'review'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-200 text-gray-700'
                          } border-0 text-xs`}>
                            {doc.status === 'final' ? 'Финал' : doc.status === 'review' ? 'Проверка' : 'Черновик'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <History className="w-3.5 h-3.5" strokeWidth={2} />
                            {doc.versions} {doc.versions === 1 ? 'версия' : 'версии'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <Download className="w-4 h-4" strokeWidth={2} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="timeline" className="p-6">
                  <div className="space-y-6">
                    {timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          {index < timeline.length - 1 && (
                            <div className="w-px h-full bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="tracking-tight">{event.title}</h4>
                            <span className="text-sm text-gray-400">{event.date}</span>
                          </div>
                          <p className="text-sm text-gray-500">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="p-6">
                  <Textarea
                    placeholder="Добавьте заметки о деле..."
                    className="min-h-[200px] rounded-xl border-gray-200 focus-visible:ring-blue-500 resize-none"
                  />
                  <Button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                    Сохранить заметку
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {}
          <div className="space-y-6">
            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg tracking-tight mb-4">Клиент</h3>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-14 h-14 ring-2 ring-gray-100">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg">
                      ИП
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="tracking-tight mb-1">Иванов Петр</h4>
                    <p className="text-sm text-gray-500">Клиент с января 2024</p>
                  </div>
                </div>

                <Separator className="my-4 bg-gray-100" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Телефон</span>
                    <span className="text-gray-900">+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-900">ivanov@mail.ru</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Всего дел</span>
                    <span className="text-gray-900">3 активных</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 rounded-xl border-gray-200 hover:bg-gray-50">
                  Профиль клиента
                  <ChevronRight className="w-4 h-4 ml-2" strokeWidth={2} />
                </Button>
              </div>
            </Card>

            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg tracking-tight">Задачи</h3>
                  <span className="text-sm text-gray-500">2/4</span>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        task.completed ? 'bg-gray-50' : 'bg-blue-50'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={2} />
                      ) : (
                        <Circle className="w-5 h-5 text-blue-500 flex-shrink-0" strokeWidth={2} />
                      )}
                      <span className={`text-sm ${
                        task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="w-full mt-3 text-blue-500 hover:bg-blue-50 rounded-xl">
                  Добавить задачу
                </Button>
              </div>
            </Card>

            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg tracking-tight mb-4">Финансы</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Гонорар</span>
                      <span className="text-xl tracking-tight">150 000 ₽</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Оплачено</span>
                      <span className="text-green-600">75 000 ₽</span>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    <span className="text-gray-500">Остаток:</span>
                    <span className="text-gray-900">75 000 ₽</span>
                  </div>
                </div>
              </div>
            </Card>

            {}
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg tracking-tight">Комментарии</h3>
                  <Badge className="bg-blue-100 text-blue-700 border-0">
                    3
                  </Badge>
                </div>

                <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-gray-50">
                  <MessageSquare className="w-4 h-4 mr-2" strokeWidth={2} />
                  Добавить комментарий
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
