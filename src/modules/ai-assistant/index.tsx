import { useState } from 'react';
import { FileText, Upload, BookOpen, Scale, Search, Lightbulb, MessageSquare } from 'lucide-react';
import {
  MessageTypeEnum,
  AnalysisStatusEnum,
  InsightTypeEnum,
} from '@/app/types/ai-assistant/ai-assistant.enums';
import type {
  ChatMessageInterface,
  RecentAnalysisInterface,
} from '@/app/types/ai-assistant/ai-assistant.interfaces';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ChatArea } from './ui/ChatArea';
import { FeatureCard } from './ui/FeatureCard';
import { Header } from './ui/Header';
import { QuickCommands } from './ui/QuickCommands';
import { RecentAnalyses } from './ui/RecentAnalyses';

export function AIAssistantView() {
  const [_message, setMessage] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleDocumentUpload = () => {
    // TODO: Добавить логику обновления данных после загрузки документа
  };


  const chatHistory: ChatMessageInterface[] = [
    {
      type: MessageTypeEnum.USER,
      message: 'Проанализируй трудовой договор на предмет соответствия ТК РФ',
      time: '10:30',
    },
    {
      type: MessageTypeEnum.AI,
      message:
        'Я проанализировал документ. Обнаружены следующие моменты:\n\n1. ✅ Договор содержит все обязательные условия согласно ст. 57 ТК РФ\n2. ⚠️ Отсутствует условие об испытательном сроке (рекомендуется добавить)\n3. ❌ Условие о материальной ответственности не соответствует ст. 243 ТК РФ\n\nРекомендую внести корректировки в п. 4.2 договора.',
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
      message:
        'Найдено 15 релевантных судебных дел:\n\n📋 Дело № А40-12345/2024\n• Суд: Арбитражный суд Московской области\n• Решение в пользу истца\n• Взысканы: заработная плата за вынужденный прогул, моральный вред\n\n📋 Дело № 2-567/2024  \n• Суд: Басманный районный суд г. Москвы\n• Решение в пользу истца\n• Восстановление на работе + компенсация\n\nХотите подробный анализ?',
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

  const { t } = useI18n();

  const features = [
    {
      icon: FileText,
      title: t('AI_ASSISTANT.FEATURES.ANALYZE_DOCUMENT'),
      description: t('AI_ASSISTANT.FEATURES.ANALYZE_DESCRIPTION'),
      gradient: 'from-blue-500 to-blue-600',
      count: '156',
    },
    {
      icon: Scale,
      title: t('AI_ASSISTANT.FEATURES.PRACTICE'),
      description: t('AI_ASSISTANT.FEATURES.PRACTICE_DESCRIPTION'),
      gradient: 'from-purple-500 to-purple-600',
      count: '2.5k',
    },
    {
      icon: BookOpen,
      title: t('AI_ASSISTANT.FEATURES.LEGAL_BASE'),
      description: t('AI_ASSISTANT.FEATURES.LEGAL_BASE_DESCRIPTION'),
      gradient: 'from-green-500 to-green-600',
      count: '10k+',
    },
    {
      icon: Lightbulb,
      title: t('AI_ASSISTANT.FEATURES.RECOMMENDATIONS'),
      description: t('AI_ASSISTANT.FEATURES.RECOMMENDATIONS_DESCRIPTION'),
      gradient: 'from-amber-500 to-amber-600',
      count: 'AI',
    },
  ];

  return (
    <div>
      <Header />

      <main className="">
        <Tabs defaultValue="chat" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <TabsList className="rounded-lg sm:rounded-xl p-0.5 sm:p-1 w-full sm:w-auto">
            <TabsTrigger
              value="chat"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">{t('AI_ASSISTANT.TABS.CHAT')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="analyze"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">{t('AI_ASSISTANT.TABS.ANALYZE')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">{t('AI_ASSISTANT.TABS.RESEARCH')}</span>
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <TabsContent value="chat" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <ChatArea chatHistory={chatHistory} />

              <div className="space-y-4 sm:space-y-6">
                <QuickCommands commands={quickActions} onCommandClick={setMessage} />
                <RecentAnalyses analyses={recentAnalyses} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-4 sm:space-y-6">
            <Card>
              <div className="text-center w-full">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <Upload
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl tracking-tight mb-1.5 sm:mb-2">
                  {t('AI_ASSISTANT.ANALYZE.UPLOAD_TITLE')}
                </h3>
                <p className="text-muted-foreground mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base">
                  {t('AI_ASSISTANT.ANALYZE.DESCRIPTION')}
                </p>
                <Button
                  onClick={() => setUploadDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/30 text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4"
                >
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
                  {t('COMMON.ACTIONS.UPLOAD')}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="research" className="space-y-4 sm:space-y-6">
            <Card>
              <div className="max-w-2xl mx-auto w-full">
                <h3 className="text-lg sm:text-xl md:text-2xl tracking-tight mb-4 sm:mb-5 md:mb-6 text-center">
                  {t('AI_ASSISTANT.RESEARCH.TITLE')}
                </h3>
                <div className="relative mb-4 sm:mb-6 md:mb-8">
                  <Search
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    placeholder={t('AI_ASSISTANT.RESEARCH.SEARCH_PLACEHOLDER')}
                    className="h-10 sm:h-12 md:h-14 pl-9 sm:pl-11 md:pl-12 pr-3 sm:pr-4 rounded-xl sm:rounded-2xl border-input focus-visible:ring-purple-500 text-sm sm:text-base md:text-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <Button
                    variant="outline"
                    className="h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl border-input hover:bg-purple-500/10 hover:border-purple-500/20 justify-start text-xs sm:text-sm"
                  >
                    <Scale
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-500"
                      strokeWidth={2}
                    />
                    <span>{t('AI_ASSISTANT.RESEARCH.BUTTONS.PRACTICE')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl border-input hover:bg-blue-500/10 hover:border-blue-500/20 justify-start text-xs sm:text-sm"
                  >
                    <BookOpen
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-500"
                      strokeWidth={2}
                    />
                    <span>{t('AI_ASSISTANT.RESEARCH.BUTTONS.LEGISLATION')}</span>
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={handleDocumentUpload}
      />
    </div>
  );
}
