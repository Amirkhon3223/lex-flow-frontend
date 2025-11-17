import { Calendar, Download, BarChart3, Briefcase, DollarSign, Users, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ManagedSelect as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/managed-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { CasesChart } from './components/CasesChart';
import { CasesTabContent } from './components/CasesTabContent';
import { CaseTypesChart } from './components/CaseTypesChart';
import { FinanceTabContent } from './components/FinanceTabContent';
import { RevenueChart } from './components/RevenueChart';
import { StatsCards } from './components/StatsCards';
import { TeamStats } from './components/TeamStats';

export default function AnalyticsPage() {
  const handleExportReport = () => {
    console.log('Экспорт отчета');
  };

  return (
    <div>
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5}/>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight truncate">Аналитика</h1>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg">Обзор эффективности работы и статистики</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Select defaultValue="month">
                <SelectTrigger className="w-32 sm:w-40 md:w-48 h-8 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2" strokeWidth={2}/>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Эта неделя</SelectItem>
                  <SelectItem value="month">Этот месяц</SelectItem>
                  <SelectItem value="quarter">Квартал</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleExportReport}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl shadow-md h-8 sm:h-10 md:h-12 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 sm:mr-2" strokeWidth={2}/>
                <span className="hidden sm:inline">Экспорт отчета</span>
              </Button>
            </div>
          </div>

          <StatsCards/>
        </div>
      </header>

      <main>
        <Tabs defaultValue="overview" className="">
          <TabsList className="bg-gray-100 rounded-lg sm:rounded-xl mt-2 w-full flex overflow-x-auto">
            <TabsTrigger
              value="overview"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2}/>
              <span className="hidden sm:inline">Обзор</span>
            </TabsTrigger>
            <TabsTrigger
              value="cases"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2}/>
              <span className="hidden sm:inline">Дела</span>
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2}/>
              <span className="hidden sm:inline">Финансы</span>
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2}/>
              <span className="hidden sm:inline">Команда</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <CasesChart/>
              <CaseTypesChart/>
            </div>
            <RevenueChart/>
          </TabsContent>

          <TabsContent value="cases" className="space-y-4 sm:space-y-6">
            <CasesTabContent/>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4 sm:space-y-6">
            <FinanceTabContent/>
          </TabsContent>

          <TabsContent value="team" className="space-y-4 sm:space-y-6">
            <TeamStats/>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
