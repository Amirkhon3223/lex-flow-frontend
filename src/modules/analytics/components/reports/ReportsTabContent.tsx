import { useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Clock,
  CalendarCheck,
  Users,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { useReportsStore } from '@/app/store/reports.store';
import type { ReportType, ExportFormat } from '@/app/types/reports/reports.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { DateRangePicker } from './DateRangePicker';
import { ReportExportDropdown } from './ReportExportDropdown';
import { ProfitabilityReport } from './ProfitabilityReport';
import { TimeBillingReport } from './TimeBillingReport';
import { DeadlineComplianceReport } from './DeadlineComplianceReport';
import { ClientRevenueReport } from './ClientRevenueReport';
import { WorkloadReport } from './WorkloadReport';

const REPORT_TYPES: { key: ReportType; icon: typeof TrendingUp; labelKey: string }[] = [
  { key: 'profitability', icon: TrendingUp, labelKey: 'REPORTS.TYPES.PROFITABILITY' },
  { key: 'time_billing', icon: Clock, labelKey: 'REPORTS.TYPES.TIME_BILLING' },
  { key: 'deadline_compliance', icon: CalendarCheck, labelKey: 'REPORTS.TYPES.DEADLINE_COMPLIANCE' },
  { key: 'client_revenue', icon: DollarSign, labelKey: 'REPORTS.TYPES.CLIENT_REVENUE' },
  { key: 'workload', icon: Users, labelKey: 'REPORTS.TYPES.WORKLOAD' },
];

export function ReportsTabContent() {
  const { t } = useI18n();

  const {
    activeReport,
    startDate,
    endDate,
    setDateRange,
    setActiveReport,
    fetchProfitability,
    fetchTimeBilling,
    fetchDeadlineCompliance,
    fetchClientRevenue,
    fetchWorkload,
    exportReport,
  } = useReportsStore();

  const fetchActiveReport = useCallback(() => {
    switch (activeReport) {
      case 'profitability':
        fetchProfitability();
        break;
      case 'time_billing':
        fetchTimeBilling();
        break;
      case 'deadline_compliance':
        fetchDeadlineCompliance();
        break;
      case 'client_revenue':
        fetchClientRevenue();
        break;
      case 'workload':
        fetchWorkload();
        break;
    }
  }, [activeReport, fetchProfitability, fetchTimeBilling, fetchDeadlineCompliance, fetchClientRevenue, fetchWorkload]);

  useEffect(() => {
    if (activeReport) {
      fetchActiveReport();
    }
  }, [activeReport, startDate, endDate, fetchActiveReport]);

  const handleExport = async (format: ExportFormat) => {
    await exportReport(format);
    toast.success(t('REPORTS.EXPORT_SUCCESS'));
  };

  const handleDateChange = (start: string, end: string) => {
    setDateRange(start, end);
  };

  const renderReport = () => {
    switch (activeReport) {
      case 'profitability':
        return <ProfitabilityReport />;
      case 'time_billing':
        return <TimeBillingReport />;
      case 'deadline_compliance':
        return <DeadlineComplianceReport />;
      case 'client_revenue':
        return <ClientRevenueReport />;
      case 'workload':
        return <WorkloadReport />;
      default:
        return (
          <div className="text-center py-16 text-muted-foreground">
            {t('REPORTS.SELECT_REPORT')}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {REPORT_TYPES.map((report) => {
            const Icon = report.icon;
            const isActive = activeReport === report.key;
            return (
              <Button
                key={report.key}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => setActiveReport(report.key)}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" strokeWidth={2} />
                <span className="hidden md:inline">{t(report.labelKey)}</span>
              </Button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />
          <ReportExportDropdown
            onExport={handleExport}
            disabled={!activeReport}
          />
        </div>
      </div>

      {renderReport()}
    </div>
  );
}
