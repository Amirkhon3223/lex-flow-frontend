import {
  ArrowLeft,
  Download,
  Eye,
  Clock,
  User,
  GitCompare,
  FileText,
  CheckCircle2,
  MoreHorizontal,
  Upload,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Separator } from '@/shared/ui/separator';


export function DocumentVersionsView() {
  const navigate = useNavigate();
  const onBack = () => window.history.back();
  const onCompare = () => navigate('/documents/1/compare');

  const documentInfo = {
    name: 'Исковое заявление.pdf',
    case: 'Трудовой спор - незаконное увольнение',
    client: 'Иванов П.А.',
    currentVersion: 3,
    totalVersions: 3,
  };

  const versions = [
    {
      version: 3,
      date: '15 окт 2025, 14:30',
      author: 'Александр Иванов',
      size: '2.4 MB',
      changes: 'Добавлены ссылки на судебную практику',
      status: 'current',
      isCurrent: true,
      approved: true,
    },
    {
      version: 2,
      date: '12 окт 2025, 16:45',
      author: 'Александр Иванов',
      size: '2.3 MB',
      changes: 'Исправлены фактические обстоятельства дела',
      status: 'previous',
      isCurrent: false,
      approved: false,
    },
    {
      version: 1,
      date: '10 окт 2025, 10:15',
      author: 'Александр Иванов',
      size: '2.1 MB',
      changes: 'Первоначальная версия документа',
      status: 'previous',
      isCurrent: false,
      approved: false,
    },
  ];

  return (
    <div>
      {}
      <header className="relative bg-white border-b border-gray-200/50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              className="text-blue-500 hover:bg-blue-50 rounded-xl -ml-2"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2} />
              Назад к документам
            </Button>

            <div className="flex items-center gap-2">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                Загрузить новую версию
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-600" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-3xl tracking-tight mb-1">{documentInfo.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{documentInfo.case}</span>
                    <span>•</span>
                    <span>{documentInfo.client}</span>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white px-6 py-4">
              <div className="text-center">
                <div className="text-3xl tracking-tight mb-1">v{documentInfo.currentVersion}</div>
                <div className="text-sm opacity-90">Текущая версия</div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      {}
      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          {}
          <Card className="bg-blue-50 border-blue-100 mb-6">
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="tracking-tight text-blue-900 mb-1">История версий документа</h3>
                  <p className="text-sm text-blue-700">
                    Всего создано {documentInfo.totalVersions} {documentInfo.totalVersions === 1 ? 'версия' : documentInfo.totalVersions < 5 ? 'версии' : 'версий'}.
                    Вы можете просмотреть, скачать или сравнить любые версии.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {}
          <div className="space-y-4">
            {versions.map((version, index) => (
              <Card
                key={version.version}
                className={`bg-white border-0 shadow-sm hover:shadow-md transition-all ${
                  version.isCurrent ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                        version.isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        v{version.version}
                      </div>
                      {index < versions.length - 1 && (
                        <div className="w-px h-16 bg-gray-200 mt-4"></div>
                      )}
                    </div>

                    {}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg tracking-tight">Версия {version.version}</h3>
                            {version.isCurrent && (
                              <Badge className="bg-blue-100 text-blue-700 border-0">
                                Текущая
                              </Badge>
                            )}
                            {version.approved && (
                              <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                                Утверждена
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                              {version.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" strokeWidth={2} />
                              {version.author}
                            </span>
                            <span>•</span>
                            <span>{version.size}</span>
                          </div>

                          <p className="text-gray-700">{version.changes}</p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-xl hover:bg-gray-100"
                            >
                              <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => navigate('/documents/1/compare')}>
                              <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                              Просмотреть
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                              Скачать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/documents/1/compare')}>
                              <GitCompare className="w-4 h-4 mr-2" strokeWidth={2} />
                              Сравнить с текущей
                            </DropdownMenuItem>
                            {!version.isCurrent && (
                              <>
                                <DropdownMenuItem>
                                  <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                  Восстановить эту версию
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                  Удалить версию
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Separator className="mb-4 bg-gray-100" />

                      {}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                          onClick={() => navigate('/documents/1/compare')}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                          Просмотр
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                          Скачать
                        </Button>
                        {!version.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600"
                            onClick={onCompare}
                          >
                            <GitCompare className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                            Сравнить
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
