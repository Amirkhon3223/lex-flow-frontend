import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  GitCompare,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  History,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Info,
  ChevronDown,
} from 'lucide-react';
import { DocumentChangeTypeEnum } from '@/app/types/documents/documents.enums.ts';
import type { DocumentChangeInterface, DocumentVersionInterface } from '@/app/types/documents/documents.interfaces.ts';
import { Badge } from '@/shared/ui/badge.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { Card } from '@/shared/ui/card.tsx';
import { ScrollArea } from '@/shared/ui/scroll-area.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/shared/ui/select.tsx';
import { Separator } from '@/shared/ui/separator.tsx';


export function DocumentCompareView() {
  const onBack = () => window.history.back();
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [version1, setVersion1] = useState('2');
  const [version2, setVersion2] = useState('3');
  const [openSelect, setOpenSelect] = useState<'version1' | 'version2' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);


  const documentVersions: DocumentVersionInterface[] = [
    { version: 3, date: '15 окт 2025, 14:30', author: 'Александр Иванов' },
    { version: 2, date: '12 окт 2025, 16:45', author: 'Александр Иванов' },
    { version: 1, date: '10 окт 2025, 10:15', author: 'Александр Иванов' },
  ];


  const changes: DocumentChangeInterface[] = [
    { id: 1, type: DocumentChangeTypeEnum.MODIFIED, lineNumber: 12, oldText: 'Истец просит взыскать с ответчика', newText: 'Истец просит взыскать с ответчика в пользу истца' },
    { id: 2, type: DocumentChangeTypeEnum.ADDED, lineNumber: 18, newText: 'Согласно решению Верховного Суда РФ от 15.03.2024 № А40-12345/24' },
    { id: 3, type: DocumentChangeTypeEnum.REMOVED, lineNumber: 24, oldText: 'Данное требование является необоснованным' },
    { id: 4, type: DocumentChangeTypeEnum.MODIFIED, lineNumber: 35, oldText: 'сумму 50 000 рублей', newText: 'сумму 150 000 рублей' },
    { id: 5, type: DocumentChangeTypeEnum.ADDED, lineNumber: 42, newText: 'На основании статьи 394 Трудового кодекса Российской Федерации' },
  ];


  const oldContent = `ИСКОВОЕ ЗАЯВЛЕНИЕ
о восстановлении на работе, взыскании среднего заработка за время
вынужденного прогула и компенсации морального вреда

В Басманный районный суд города Москвы
Истец: Иванов Петр Алексеевич
Адрес: г. Москва, ул. Ленина, д. 10, кв. 5
Ответчик: ООО "ТехноСтрой"
Адрес: г. Москва, ул. Пушкина, д. 20

Истец работал в ООО "ТехноСтрой" в должности инженера с 15.01.2020.
Приказом от 01.09.2025 № 45 истец был уволен по п. 2 ч. 1 ст. 81 ТК РФ
в связи с сокращением численности работников организации.

<span class="removed">Истец просит взыскать с ответчика</span> компенсацию морального вреда
в размере 100 000 рублей.

Истец считает увольнение незаконным по следующим основаниям:

1. Работодатель не уведомил истца о предстоящем увольнении за 2 месяца,
как того требует часть 2 статьи 180 ТК РФ.

2. Работодатель не предложил истцу другую имеющуюся работу (вакантную
должность), соответствующую квалификации истца.

<span class="removed">Данное требование является необоснованным</span>

3. На момент увольнения в организации имелись вакантные должности,
которые не были предложены истцу.

На основании изложенного и руководствуясь статьями 131-132 ГПК РФ,

ПРОШУ:

1. Восстановить Иванова Петра Алексеевича на работе в ООО "ТехноСтрой"
в должности инженера.

2. Взыскать с ответчика в пользу истца средний заработок за время
вынужденного прогула в <span class="removed">сумму 50 000 рублей</span>.

3. Взыскать с ответчика в пользу истца компенсацию морального вреда
в размере 100 000 рублей.

Приложения:
1. Копия трудового договора
2. Копия приказа об увольнении
3. Справка о заработной плате`;

  const newContent = `ИСКОВОЕ ЗАЯВЛЕНИЕ
о восстановлении на работе, взыскании среднего заработка за время
вынужденного прогула и компенсации морального вреда

В Басманный районный суд города Москвы
Истец: Иванов Петр Алексеевич
Адрес: г. Москва, ул. Ленина, д. 10, кв. 5
Ответчик: ООО "ТехноСтрой"
Адрес: г. Москва, ул. Пушкина, д. 20

Истец работал в ООО "ТехноСтрой" в должности инженера с 15.01.2020.
Приказом от 01.09.2025 № 45 истец был уволен по п. 2 ч. 1 ст. 81 ТК РФ
в связи с сокращением численности работников организации.

<span class="modified">Истец просит взыскать с ответчика в пользу истца</span> компенсацию морального вреда
в размере 100 000 рублей.

Истец считает увольнение незаконным по следующим основаниям:

1. Работодатель не уведомил истца о предстоящем увольнении за 2 месяца,
как того требует часть 2 статьи 180 ТК РФ.

<span class="added">Согласно решению Верховного Суда РФ от 15.03.2024 № А40-12345/24</span>

2. Работодатель не предложил истцу другую имеющуюся работу (вакантную
должность), соответствующую квалификации истца.

3. На момент увольнения в организации имелись вакантные должности,
которые не были предложены истцу.

На основании изложенного и руководствуясь статьями 131-132 ГПК РФ,

ПРОШУ:

1. Восстановить Иванова Петра Алексеевича на работе в ООО "ТехноСтрой"
в должности инженера.

2. Взыскать с ответчика в пользу истца средний заработок за время
вынужденного прогула в <span class="modified">сумму 150 000 рублей</span>.

3. Взыскать с ответчика в пользу истца компенсацию морального вреда
в размере 100 000 рублей.

<span class="added">На основании статьи 394 Трудового кодекса Российской Федерации</span>

Приложения:
1. Копия трудового договора
2. Копия приказа об увольнении
3. Справка о заработной плате`;

  const changesSummary = {
    total: changes.length,
    added: changes.filter(c => c.type === DocumentChangeTypeEnum.ADDED).length,
    removed: changes.filter(c => c.type === DocumentChangeTypeEnum.REMOVED).length,
    modified: changes.filter(c => c.type === DocumentChangeTypeEnum.MODIFIED).length,
  };

  const handleNextChange = () => {
    if (currentChangeIndex < changes.length - 1) {
      setCurrentChangeIndex(currentChangeIndex + 1);
    }
  };

  const handlePrevChange = () => {
    if (currentChangeIndex > 0) {
      setCurrentChangeIndex(currentChangeIndex - 1);
    }
  };

  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      setZoomLevel(zoomLevel + 10);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) {
      setZoomLevel(zoomLevel - 10);
    }
  };

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <Button
              variant="ghost"
              className="text-blue-500 hover:bg-blue-50 rounded-xl -ml-2 w-fit"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" strokeWidth={2} />
              <span className="text-sm sm:text-base">Назад к версиям</span>
            </Button>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Zoom controls - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 70}
                  className="rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  <ZoomOut className="w-4 h-4" strokeWidth={2} />
                </Button>
                <span className="text-sm text-gray-600 w-16 text-center">{zoomLevel}%</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 150}
                  className="rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  <ZoomIn className="w-4 h-4" strokeWidth={2} />
                </Button>

                <Separator orientation="vertical" className="h-8 mx-2 bg-gray-200" />
              </div>

              <Button
                variant="outline"
                className="rounded-xl border-gray-200 hover:bg-gray-50 hidden md:flex"
                onClick={handleToggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 mr-2" strokeWidth={2} />
                ) : (
                  <Maximize2 className="w-4 h-4 mr-2" strokeWidth={2} />
                )}
                {isFullscreen ? 'Выйти из полного экрана' : 'Полный экран'}
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm sm:text-base flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">Экспорт сравнения</span>
                <span className="sm:hidden">Экспорт</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <GitCompare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">Сравнение версий</h1>
              <p className="text-xs sm:text-sm text-gray-500">Исковое заявление.pdf</p>
            </div>
          </div>

          {}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <Select
                value={version1}
                onValueChange={setVersion1}
                open={openSelect === 'version1'}
                onOpenChange={(open) => setOpenSelect(open ? 'version1' : null)}
              >
                <SelectTrigger className="h-10 sm:h-12 rounded-xl border-gray-200 bg-white">
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:block" strokeWidth={2} />
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate">v{version1}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        {documentVersions.find(v => v.version === parseInt(version1))?.date}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {documentVersions.map((v) => (
                    <SelectItem key={v.version} value={v.version.toString()} disabled={v.version.toString() === version2}>
                      <div className="py-1">
                        <div>Версия {v.version}</div>
                        <div className="text-xs text-gray-500">{v.date} • {v.author}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <Select
                value={version2}
                onValueChange={setVersion2}
                open={openSelect === 'version2'}
                onOpenChange={(open) => setOpenSelect(open ? 'version2' : null)}
              >
                <SelectTrigger className="h-10 sm:h-12 rounded-xl border-gray-200 bg-white">
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:block" strokeWidth={2} />
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate">v{version2}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        {documentVersions.find(v => v.version === parseInt(version2))?.date}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {documentVersions.map((v) => (
                    <SelectItem key={v.version} value={v.version.toString()} disabled={v.version.toString() === version1}>
                      <div className="py-1">
                        <div>Версия {v.version}</div>
                        <div className="text-xs text-gray-500">{v.date} • {v.author}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Mobile layout - stacked */}
        <div className="lg:hidden space-y-4">
          {/* Changes summary for mobile */}
          <Card>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold tracking-tight text-sm flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-500" strokeWidth={2} />
                  Изменений: {changesSummary.total}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevChange}
                    disabled={currentChangeIndex === 0}
                    className="rounded-lg border-gray-200 h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                  </Button>
                  <span className="text-xs text-gray-600">
                    {currentChangeIndex + 1}/{changes.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextChange}
                    disabled={currentChangeIndex === changes.length - 1}
                    className="rounded-lg border-gray-200 h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-900">+{changesSummary.added}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  <span className="text-xs text-red-900">-{changesSummary.removed}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-blue-900">~{changesSummary.modified}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Old version */}
          <Card >
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight text-sm mb-0.5">Версия {version1}</h3>
                  <p className="text-xs text-gray-500">
                    {documentVersions.find(v => v.version === parseInt(version1))?.date}
                  </p>
                </div>
                <Badge className="bg-gray-200 text-gray-700 border-0 text-xs">Старая</Badge>
              </div>
            </div>
            <ScrollArea className="h-[300px] sm:h-[400px]">
              <div
                className="p-4 font-mono text-xs leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: oldContent
                    .replace(/<span class="removed">(.*?)<\/span>/g, '<span class="bg-red-100 text-red-900 px-1 rounded line-through">$1</span>')
                    .replace(/\n/g, '<br />'),
                }}
              />
            </ScrollArea>
          </Card>

          {/* New version */}
          <Card >
            <div className="p-3 bg-green-50 border-b border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight text-sm mb-0.5">Версия {version2}</h3>
                  <p className="text-xs text-gray-500">
                    {documentVersions.find(v => v.version === parseInt(version2))?.date}
                  </p>
                </div>
                <Badge className="bg-green-500 text-white border-0 text-xs">Новая</Badge>
              </div>
            </div>
            <ScrollArea className="h-[300px] sm:h-[400px]">
              <div
                className="p-4 font-mono text-xs leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: newContent
                    .replace(/<span class="added">(.*?)<\/span>/g, '<span class="bg-green-100 text-green-900 px-1 rounded">$1</span>')
                    .replace(/<span class="modified">(.*?)<\/span>/g, '<span class="bg-blue-100 text-blue-900 px-1 rounded">$1</span>')
                    .replace(/\n/g, '<br />'),
                }}
              />
            </ScrollArea>
          </Card>

          {/* Legend for mobile */}
          <Card className="bg-gray-50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
                <h4 className="text-xs font-semibold tracking-tight">Легенда</h4>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
                  <span className="text-gray-600">Добавлено</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
                  <span className="text-gray-600">Удалено</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
                  <span className="text-gray-600">Изменено</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Desktop layout - side by side */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {}
          <div className="space-y-6">
            {}
            <Card>
              <div>
                <h3 className="font-semibold tracking-tight mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-500" strokeWidth={2} />
                  Обнаружено изменений
                </h3>

                <div className="text-4xl font-bold tracking-tight mb-6 text-center">
                  {changesSummary.total}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-green-900">Добавлено</span>
                    </div>
                    <span className="text-sm text-green-700">{changesSummary.added}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm text-red-900">Удалено</span>
                    </div>
                    <span className="text-sm text-red-700">{changesSummary.removed}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-blue-900">Изменено</span>
                    </div>
                    <span className="text-sm text-blue-700">{changesSummary.modified}</span>
                  </div>
                </div>
              </div>
            </Card>

            {}
            <Card>
              <div>
                <h3 className="font-semibold tracking-tight mb-4">Навигация</h3>

                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevChange}
                    disabled={currentChangeIndex === 0}
                    className="rounded-xl border-gray-200"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                  </Button>

                  <div className="flex-1 text-center text-sm text-gray-600">
                    {currentChangeIndex + 1} из {changes.length}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextChange}
                    disabled={currentChangeIndex === changes.length - 1}
                    className="rounded-xl border-gray-200"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-4">
                    {changes.map((change, index) => (
                      <button
                        key={change.id}
                        onClick={() => setCurrentChangeIndex(index)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          currentChangeIndex === index
                            ? 'bg-blue-50 border-2 border-blue-200'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs border-0 ${
                            change.type === DocumentChangeTypeEnum.ADDED ? 'bg-green-100 text-green-700' :
                            change.type === DocumentChangeTypeEnum.REMOVED ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {change.type === DocumentChangeTypeEnum.ADDED ? 'Добавлено' :
                             change.type === DocumentChangeTypeEnum.REMOVED ? 'Удалено' :
                             'Изменено'}
                          </Badge>
                          <span className="text-xs text-gray-500">Строка {change.lineNumber}</span>
                        </div>
                        {change.oldText && (
                          <div className="text-xs text-gray-600 mb-1 line-through">
                            {change.oldText.substring(0, 50)}...
                          </div>
                        )}
                        {change.newText && (
                          <div className="text-xs text-gray-900">
                            {change.newText.substring(0, 50)}...
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </Card>

            {}
            <Card className="bg-gray-50">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-gray-500" strokeWidth={2} />
                  <h4 className="text-sm font-semibold tracking-tight">Легенда</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
                    <span className="text-gray-600">Добавленный текст</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
                    <span className="text-gray-600">Удаленный текст</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div>
                    <span className="text-gray-600">Измененный текст</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {}
          <div className="col-span-3">
            <Card >
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                {}
                <div>
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold tracking-tight mb-1">Версия {version1}</h3>
                        <p className="text-xs text-gray-500">
                          {documentVersions.find(v => v.version === parseInt(version1))?.date}
                        </p>
                      </div>
                      <Badge className="bg-gray-200 text-gray-700 border-0">Старая</Badge>
                    </div>
                  </div>
                  <ScrollArea className="h-[800px]">
                    <div
                      className="p-6 font-mono text-sm leading-relaxed"
                      style={{ fontSize: `${zoomLevel}%` }}
                      dangerouslySetInnerHTML={{
                        __html: oldContent
                          .replace(/<span class="removed">(.*?)<\/span>/g, '<span class="bg-red-100 text-red-900 px-1 rounded line-through">$1</span>')
                          .replace(/\n/g, '<br />'),
                      }}
                    />
                  </ScrollArea>
                </div>

                {}
                <div>
                  <div className="p-4 bg-green-50 border-b border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold tracking-tight mb-1">Версия {version2}</h3>
                        <p className="text-xs text-gray-500">
                          {documentVersions.find(v => v.version === parseInt(version2))?.date}
                        </p>
                      </div>
                      <Badge className="bg-green-500 text-white border-0">Новая</Badge>
                    </div>
                  </div>
                  <ScrollArea className="h-[800px]">
                    <div
                      className="p-6 font-mono text-sm leading-relaxed"
                      style={{ fontSize: `${zoomLevel}%` }}
                      dangerouslySetInnerHTML={{
                        __html: newContent
                          .replace(/<span class="added">(.*?)<\/span>/g, '<span class="bg-green-100 text-green-900 px-1 rounded">$1</span>')
                          .replace(/<span class="modified">(.*?)<\/span>/g, '<span class="bg-blue-100 text-blue-900 px-1 rounded">$1</span>')
                          .replace(/\n/g, '<br />'),
                      }}
                    />
                  </ScrollArea>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
