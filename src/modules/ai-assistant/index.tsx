import { useState } from 'react';
import {
  FileText,
  Upload,
  BookOpen,
  Scale,
  Search,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';
import { MessageTypeEnum, AnalysisStatusEnum, InsightTypeEnum } from '@/app/types/ai-assistant/ai-assistant.enums';
import type { ChatMessageInterface, RecentAnalysisInterface } from '@/app/types/ai-assistant/ai-assistant.interfaces';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { ChatArea } from './ui/ChatArea';
import { FeatureCard } from './ui/FeatureCard';
import { Header } from './ui/Header';
import { QuickCommands } from './ui/QuickCommands';
import { RecentAnalyses } from './ui/RecentAnalyses';

export function AIAssistantView() {
  const [message, setMessage] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleDocumentUpload = (documentData: any) => {
    console.log('Документ загружен:', documentData);
    // TODO: Добавить логику обработки загруженного документа
  };

  const features = [
    {
      icon: FileText,
      title: 'Анализ документов',
      description: 'Проверка юридической корректности, выявление рисков',
      gradient: 'from-blue-500 to-blue-600',
      count: '156',
    },
    {
      icon: Scale,
      title: 'Судебная практика',
      description: 'Поиск релевантных прецедентов и решений',
      gradient: 'from-purple-500 to-purple-600',
      count: '2.5k',
    },
    {
      icon: BookOpen,
      title: 'Правовая база',
      description: 'Ссылки на нормативные акты и законодательство',
      gradient: 'from-green-500 to-green-600',
      count: '10k+',
    },
    {
      icon: Lightbulb,
      title: 'Рекомендации',
      description: 'Советы по стратегии ведения дела',
      gradient: 'from-amber-500 to-amber-600',
      count: 'AI',
    },
  ];

  const chatHistory: ChatMessageInterface[] = [
    {
      type: MessageTypeEnum.USER,
      message: 'Проанализируй трудовой договор на предмет соответствия ТК РФ',
      time: '10:30',
    },
    {
      type: MessageTypeEnum.AI,
      message: 'Я проанализировал документ. Обнаружены следующие моменты:\n\n1. ✅ Договор содержит все обязательные условия согласно ст. 57 ТК РФ\n2. ⚠️ Отсутствует условие об испытательном сроке (рекомендуется добавить)\n3. ❌ Условие о материальной ответственности не соответствует ст. 243 ТК РФ\n\nРекомендую внести корректировки в п. 4.2 договора.',
      time: '10:31',
      insights: [
        { type: InsightTypeEnum.SUCCESS, text: 'Соответствует требованиям ТК РФ' },
        { type: InsightTypeEnum.WARNING, text: 'Рекомендуются дополнения' },
        { type: InsightTypeEnum.ERROR, text: 'Обнаружены несоответствия' },
      ],
    },
    {
      type: MessageTypeEnum.USER,
      message: 'Найди похожие судебные дела по незаконному увольнению',
      time: '10:35',
    },
    {
      type: MessageTypeEnum.AI,
      message: 'Найдено 15 релевантных судебных дел:\n\n📋 Дело № А40-12345/2024\n• Суд: Арбитражный суд Московской области\n• Решение в пользу истца\n• Взысканы: заработная плата за вынужденный прогул, моральный вред\n\n📋 Дело № 2-567/2024  \n• Суд: Басманный районный суд г. Москвы\n• Решение в пользу истца\n• Восстановление на работе + компенсация\n\nХотите подробный анализ?',
      time: '10:36',
    },
  ];

  const quickActions = [
    'Проверить договор на юридическую корректность',
    'Найти судебную практику по данному вопросу',
    'Составить исковое заявление',
    'Оценить перспективы дела',
    'Найти релевантные законодательные акты',
  ];

  const recentAnalyses: RecentAnalysisInterface[] = [
    {
      document: 'Исковое заявление.pdf',
      case: 'Трудовой спор',
      result: 'Обнаружено 2 риска',
      status: AnalysisStatusEnum.WARNING,
      date: '2 часа назад',
    },
    {
      document: 'Трудовой договор.pdf',
      case: 'Трудовой спор',
      result: 'Все в порядке',
      status: AnalysisStatusEnum.SUCCESS,
      date: '5 часов назад',
    },
    {
      document: 'Договор аренды.pdf',
      case: 'Аренда помещения',
      result: 'Требуются правки',
      status: AnalysisStatusEnum.ERROR,
      date: 'Вчера',
    },
  ];

  return (
    <div>
      <Header />

      <main className="">
        <Tabs defaultValue="chat" className="space-y-4 mt-4">
          <TabsList className="bg-gray-100 rounded-xl">
            <TabsTrigger value="chat" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <MessageSquare className="w-4 h-4 mr-2" strokeWidth={2} />
              Чат с AI
            </TabsTrigger>
            <TabsTrigger value="analyze" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4 mr-2" strokeWidth={2} />
              Анализ документов
            </TabsTrigger>
            <TabsTrigger value="research" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Search className="w-4 h-4 mr-2" strokeWidth={2} />
              Исследование
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <ChatArea chatHistory={chatHistory} />

              <div className="space-y-6">
                <QuickCommands commands={quickActions} onCommandClick={setMessage} />
                <RecentAnalyses analyses={recentAnalyses} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-6">
            <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl tracking-tight mb-2">Загрузите документ для анализа</h3>
                <p className="text-gray-500 mb-6">
                  AI проверит юридическую корректность, выявит риски и даст рекомендации
                </p>
                <Button
                  onClick={() => setUploadDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-purple-500/30"
                >
                  <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                  Выбрать документ
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
              <div className="p-8">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl tracking-tight mb-6 text-center">Поиск в правовой базе и судебной практике</h3>
                  <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
                    <Input
                      placeholder="Введите запрос для поиска..."
                      className="h-14 pl-12 pr-4 rounded-2xl border-gray-200 focus-visible:ring-purple-500 text-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-14 rounded-xl border-gray-200 hover:bg-purple-50 hover:border-purple-200 justify-start"
                    >
                      <Scale className="w-5 h-5 mr-3 text-purple-500" strokeWidth={2} />
                      <span>Судебная практика</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 rounded-xl border-gray-200 hover:bg-blue-50 hover:border-blue-200 justify-start"
                    >
                      <BookOpen className="w-5 h-5 mr-3 text-blue-500" strokeWidth={2} />
                      <span>Законодательство</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSubmit={handleDocumentUpload}
      />
    </div>
  );
}
