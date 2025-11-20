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
import { Badge } from '@/shared/ui/badge.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { Card } from '@/shared/ui/card.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx';
import { Separator } from '@/shared/ui/separator.tsx';


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
      { }
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Mobile header row */}
          <div className="md:hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <Button
                variant="ghost"
                className="text-blue-500 hover:bg-blue-50 rounded-xl -ml-2"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" strokeWidth={2} />
                <span className="text-sm">Назад</span>
              </Button>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white px-3 py-1.5">
                <div className="text-center">
                  <div className="text-base font-medium">v{documentInfo.currentVersion}</div>
                  <div className="text-xs opacity-90">Текущая</div>
                </div>
              </Card>
            </div>

            <div className="mb-3">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl w-full text-sm">
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                Загрузить новую версию
              </Button>
            </div>
          </div>

          {/* Desktop header row */}
          <div className="hidden md:flex items-center justify-between gap-3 mb-4">
            <Button
              variant="ghost"
              className="text-blue-500 hover:bg-blue-50 rounded-xl -ml-2"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2} />
              <span className="text-base">Назад к документам</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-base">
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                Загрузить новую версию
              </Button>
            </div>
          </div>

          {/* Mobile document info */}
          <div className="md:hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base tracking-tight mb-1">{documentInfo.name}</h1>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div className="truncate">{documentInfo.case}</div>
                  <div>{documentInfo.client}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-600" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl tracking-tight mb-1">{documentInfo.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

      { }
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          { }
          <Card className="bg-blue-500/10 border-blue-500/20 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base tracking-tight text-blue-700 dark:text-blue-400 mb-1">История версий документа</h3>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">
                  Всего создано {documentInfo.totalVersions} {documentInfo.totalVersions === 1 ? 'версия' : documentInfo.totalVersions < 5 ? 'версии' : 'версий'}.
                  <span className="hidden sm:inline"> Вы можете просмотреть, скачать или сравнить любые версии.</span>
                </p>
              </div>
            </div>
          </Card>

          { }
          <div className="space-y-3 sm:space-y-4">
            {versions.map((version, index) => (
              <Card
                key={version.version}
                className={`hover:shadow-md transition-all ${version.isCurrent ? 'ring-2 ring-blue-500' : ''
                  }`}
              >
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium ${version.isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted text-muted-foreground'
                        }`}>
                        v{version.version}
                      </div>
                      {index < versions.length - 1 && (
                        <div className="w-px h-12 bg-border mt-3"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base tracking-tight mb-1">Версия {version.version}</h3>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {version.isCurrent && (
                              <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0 text-xs">
                                Текущая
                              </Badge>
                            )}
                            {version.approved && (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-0 flex items-center gap-1 text-xs">
                                <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2} />
                                Утверждена
                              </Badge>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-xl hover:bg-muted h-8 w-8"
                            >
                              <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
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

                      <div className="space-y-1 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" strokeWidth={2} />
                          {version.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3" strokeWidth={2} />
                          {version.author}
                        </div>
                        <div>{version.size}</div>
                      </div>

                      <p className="text-xs text-foreground mb-3">{version.changes}</p>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-border hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-600 text-xs h-7"
                          onClick={() => navigate('/documents/1/compare')}
                        >
                          <Eye className="w-3 h-3 mr-1" strokeWidth={2} />
                          Просмотр
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-border hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-600 text-xs h-7"
                        >
                          <Download className="w-3 h-3 mr-1" strokeWidth={2} />
                          Скачать
                        </Button>
                        {!version.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-border hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-600 text-xs h-7"
                            onClick={onCompare}
                          >
                            <GitCompare className="w-3 h-3 mr-1" strokeWidth={2} />
                            Сравнить
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:flex items-start gap-6">
                  { }
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${version.isCurrent
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-muted-foreground'
                      }`}>
                      v{version.version}
                    </div>
                    {index < versions.length - 1 && (
                      <div className="w-px h-16 bg-border mt-4"></div>
                    )}
                  </div>

                  { }
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg tracking-tight">Версия {version.version}</h3>
                          {version.isCurrent && (
                            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0">
                              Текущая
                            </Badge>
                          )}
                          {version.approved && (
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-0 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                              Утверждена
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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

                        <p className="text-foreground">{version.changes}</p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl hover:bg-muted"
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

                    <Separator className="mb-4 bg-border" />

                    { }
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-border hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-600"
                        onClick={() => navigate('/documents/1/compare')}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                        Просмотр
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-border hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-600"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                        Скачать
                      </Button>
                      {!version.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-border hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-600"
                          onClick={onCompare}
                        >
                          <GitCompare className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                          Сравнить
                        </Button>
                      )}
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
