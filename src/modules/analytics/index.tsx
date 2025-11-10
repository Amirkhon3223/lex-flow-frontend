import { Calendar, Download, BarChart3, Briefcase, DollarSign, Users } from 'lucide-react';
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
        <div className="px-4 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl tracking-tight mb-2">Аналитика</h1>
              <p className="text-gray-500 text-lg">Обзор эффективности работы и статистика</p>
            </div>

            <div className="flex items-center gap-3">
              <Select defaultValue="month">
                <SelectTrigger className="w-48 h-12 rounded-xl border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" strokeWidth={2}/>
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
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
              >
                <Download className="w-4 h-4 mr-2" strokeWidth={2}/>
                Экспорт отчета
              </Button>
            </div>
          </div>

          <StatsCards/>
        </div>
      </header>

      <main className="p-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100 rounded-xl p-1.5">
            <TabsTrigger
              value="overview"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" strokeWidth={2}/>
              Обзор
            </TabsTrigger>
            <TabsTrigger
              value="cases"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Briefcase className="w-4 h-4 mr-2" strokeWidth={2}/>
              Дела
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <DollarSign className="w-4 h-4 mr-2" strokeWidth={2}/>
              Финансы
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4 mr-2" strokeWidth={2}/>
              Команда
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <CasesChart/>
              <CaseTypesChart/>
            </div>
            <RevenueChart/>
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <CasesTabContent/>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <FinanceTabContent/>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamStats/>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
