import { useEffect, useState } from 'react';
import {
  Calendar,
  Download,
  BarChart3,
  Briefcase,
  DollarSign,
  Users,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAnalyticsStore } from '@/app/store/analytics.store';
import { useAuthStore } from '@/app/store/auth.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  ManagedSelect as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/managed-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { exportAnalyticsToCSV } from '@/shared/utils/export-analytics';
import { CasesChart } from './components/CasesChart';
import { CasesTabContent } from './components/CasesTabContent';
import { CaseTypesChart } from './components/CaseTypesChart';
import { FinanceTabContent } from './components/FinanceTabContent';
import { RevenueChart } from './components/RevenueChart';
import { StatsCards } from './components/StatsCards';
import { TeamStats } from './components/TeamStats';

export default function AnalyticsPage() {
  const { t } = useI18n();
  const [isExporting, setIsExporting] = useState(false);

  const {
    dashboard,
    cases,
    clients,
    documents,
    meetings,
    finance,
    team,
    fetchDashboard,
    fetchCases,
    fetchClients,
    fetchDocuments,
    fetchMeetings,
    fetchFinance,
    fetchTeam,
  } = useAnalyticsStore();

  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboard();
    fetchCases();
    fetchClients();
    fetchDocuments();
    fetchMeetings();
    fetchFinance();
    fetchTeam();
  }, [fetchDashboard, fetchCases, fetchClients, fetchDocuments, fetchMeetings, fetchFinance, fetchTeam]);

  const handleExportReport = () => {
    try {
      setIsExporting(true);

      // Get user currency (default to USD if not set)
      const userCurrency = user?.currency || 'USD';

      // Export all analytics data
      exportAnalyticsToCSV(
        {
          dashboard,
          cases,
          clients,
          documents,
          meetings,
          finance,
          team,
        },
        userCurrency
      );

      // Show success message
      toast.success(t('ANALYTICS.EXPORT_SUCCESS'), {
        description: t('ANALYTICS.EXPORT_SUCCESS_DESCRIPTION'),
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(t('ANALYTICS.EXPORT_ERROR'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight truncate">
                  {t('ANALYTICS.TITLE')}
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                  {t('ANALYTICS.SUBTITLE')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:flex-col md:items-stretch lg:flex-row lg:items-center">
              <Select defaultValue="month">
                <SelectTrigger className="w-32 sm:w-40 md:w-48 h-8 sm:h-10 md:h-12 rounded-lg sm:rounded-xl border-input text-xs sm:text-sm">
                  <Calendar
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2"
                    strokeWidth={2}
                  />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">{t('ANALYTICS.PERIODS.WEEK')}</SelectItem>
                  <SelectItem value="month">{t('ANALYTICS.PERIODS.MONTH')}</SelectItem>
                  <SelectItem value="quarter">{t('ANALYTICS.PERIODS.QUARTER')}</SelectItem>
                  <SelectItem value="year">{t('ANALYTICS.PERIODS.YEAR')}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleExportReport}
                disabled={isExporting}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl shadow-md px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
              >
                <Download
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 sm:mr-2"
                  strokeWidth={2}
                />
                <span className="hidden sm:inline">
                  {isExporting ? t('ANALYTICS.EXPORTING') : t('ANALYTICS.EXPORT_REPORT')}
                </span>
              </Button>
            </div>
          </div>

          <StatsCards />
        </div>
      </header>

      <main>
        <Tabs defaultValue="overview" className="pb-2 pt-4">
          <TabsList>
            <TabsTrigger
              value="overview"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">{t('ANALYTICS.OVERVIEW_TAB')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="cases"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">{t('ANALYTICS.TABS.CASES')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">{t('ANALYTICS.TABS.FINANCE')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">{t('ANALYTICS.TABS.TEAM')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <CasesChart />
              <CaseTypesChart />
            </div>
            <RevenueChart />
          </TabsContent>

          <TabsContent value="cases" className="space-y-4 sm:space-y-6">
            <CasesTabContent />
          </TabsContent>

          <TabsContent value="finance" className="space-y-4 sm:space-y-6">
            <FinanceTabContent />
          </TabsContent>

          <TabsContent value="team" className="space-y-4 sm:space-y-6">
            <TeamStats />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
