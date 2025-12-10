import { FileText, Calendar, Clock, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CaseInterface } from '@/app/types/cases/cases.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { formatDate } from '@/shared/utils';
import { getStatusColor } from '@/shared/utils/styleHelpers';

interface CaseCardProps {
  caseItem: CaseInterface;
}

export function CaseCard({ caseItem }: CaseCardProps) {
  const { t } = useI18n();

  const calculateDaysLeft = (date: string): number => {
    const target = new Date(date);
    const today = new Date();
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(caseItem.deadline);
  const formattedDeadline = formatDate(caseItem.deadline);

  const formattedCourtDate = caseItem.courtDate ? formatDate(caseItem.courtDate) : null;
  const courtDaysLeft = caseItem.courtDate ? calculateDaysLeft(caseItem.courtDate) : 0;

  const getClientInitials = (name: string): string =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  const clientInitials = getClientInitials(caseItem.clientName);

  const statusText = (() => {
    const map: Record<string, string> = {
      new: t('COMMON.STATUS.NEW'),
      in_progress: t('COMMON.STATUS.IN_PROGRESS'),
      waiting: t('COMMON.STATUS.WAITING'),
      closed: t('COMMON.STATUS.CLOSED'),
      won: t('COMMON.STATUS.WON'),
      lost: t('COMMON.STATUS.LOST'),
      settled: t('COMMON.STATUS.SETTLED'),
    };
    return map[caseItem.status] ?? caseItem.status;
  })();

  return (
    <Link
      to={`/cases/${caseItem.id}`}
      className="block rounded-xl border p-3 sm:p-4 transition-colors hover:bg-muted/50"
    >
      {/* =================================================================================== */}
      {/* MOBILE + TABLET VERSION  (до 1024px) */}
      {/* =================================================================================== */}
      <div className="lg:hidden flex flex-col gap-4">
        {/* Верхняя часть */}
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {clientInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base leading-tight">
              {caseItem.title}
            </h3>

            <Badge className={`${getStatusColor(caseItem.status)} text-xs mt-1`}>
              {statusText}
            </Badge>

            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{caseItem.clientName}</span>
              <span>•</span>
              <span>{caseItem.category}</span>
            </div>
          </div>
        </div>

        {/* Deadline + Court date в один ряд */}
        <div className="flex items-start justify-between gap-6 px-1">
          {/* DEADLINE — слева */}
          <div className="flex flex-col text-left flex-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {t('CASES.FIELDS.DEADLINE')}
            </div>

            <div className="font-medium text-foreground text-sm">{formattedDeadline}</div>

            <div
              className={`text-xs mt-1 ${
                daysLeft < 0
                  ? 'text-red-600'
                  : daysLeft < 7
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-muted-foreground'
              }`}
            >
              {daysLeft < 0
                ? `${t('CASES.OVERDUE')} ${Math.abs(daysLeft)} ${t('CASES.DAYS_SHORT')}`
                : `${t('CASES.REMAINING')} ${daysLeft} ${t('CASES.DAYS_SHORT')}`}
            </div>
          </div>

          {/* COURT DATE — справа */}
          {formattedCourtDate && (
            <div className="flex flex-col text-right flex-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <Scale className="h-3 w-3" />
                {t('CASES.FIELDS.COURT_DATE')}
              </div>

              <div className="font-medium text-foreground text-sm">{formattedCourtDate}</div>

              <div
                className={`text-xs mt-1 ${
                  courtDaysLeft < 0
                    ? 'text-muted-foreground'
                    : courtDaysLeft < 7
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-muted-foreground'
                }`}
              >
                {courtDaysLeft < 0
                  ? t('CASES.COURT_PASSED')
                  : `${t('CASES.REMAINING')} ${courtDaysLeft} ${t('CASES.DAYS_SHORT')}`}
              </div>
            </div>
          )}
        </div>

        {/* Прогресс */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t('CASES.FIELDS.PROGRESS')}</span>
            <span className="font-medium">{caseItem.progress}%</span>
          </div>
          <Progress value={caseItem.progress} className="h-1.5" />
        </div>

        {/* Нижний ряд — БЕЗ "Просрочено" */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {caseItem.documents} {t('CASES.DOCUMENTS_COUNT')}
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {caseItem.commentsCount} {t('CASES.COMMENTS_COUNT')}
          </div>

          {/* НИЧЕГО НЕ ВЫВОДИМ ПРО ПРОСРОЧЕНО */}
        </div>
      </div>

      {/* =================================================================================== */}
      {/* DESKTOP VERSION  (>=1024px) — НЕ ТРОГАЕМ! */}
      {/* =================================================================================== */}
      <div className="hidden lg:flex items-start gap-4">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">{clientInitials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{caseItem.title}</h3>
                <Badge className={getStatusColor(caseItem.status)}>{statusText}</Badge>
              </div>

              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span>{caseItem.clientName}</span>
                <span>•</span>
                <span>{caseItem.category}</span>
              </div>
            </div>

            {/* Правый блок — DEADLINE и COURT DATE как было */}
            <div className="flex items-start gap-6 text-right flex-shrink-0">
              {/* Deadline */}
              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                  <Calendar className="h-3.5 w-3.5" />
                  {t('CASES.FIELDS.DEADLINE')}
                </div>

                <div className="font-medium text-foreground">{formattedDeadline}</div>

                <div
                  className={`text-xs mt-1 ${
                    daysLeft < 0
                      ? 'text-red-600'
                      : daysLeft < 7
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-muted-foreground'
                  }`}
                >
                  {daysLeft < 0
                    ? `${t('CASES.OVERDUE')} ${Math.abs(daysLeft)} ${t('CASES.DAYS_SHORT')}`
                    : `${t('CASES.REMAINING')} ${daysLeft} ${t('CASES.DAYS_SHORT')}`}
                </div>
              </div>

              {/* Court date */}
              {formattedCourtDate && (
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                    <Scale className="h-3.5 w-3.5" />
                    {t('CASES.FIELDS.COURT_DATE')}
                  </div>

                  <div className="font-medium text-foreground">{formattedCourtDate}</div>

                  <div
                    className={`text-xs mt-1 ${
                      courtDaysLeft < 0
                        ? 'text-muted-foreground'
                        : courtDaysLeft < 7
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {courtDaysLeft < 0
                      ? t('CASES.COURT_PASSED')
                      : `${t('CASES.REMAINING')} ${courtDaysLeft} ${t('CASES.DAYS_SHORT')}`}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">{t('CASES.FIELDS.PROGRESS')}:</span>
              <span className="font-medium">{caseItem.progress}%</span>
            </div>
            <Progress value={caseItem.progress} />
          </div>

          <div className="flex items-center gap-5 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {caseItem.documents} {t('CASES.DOCUMENTS_COUNT')}
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {caseItem.commentsCount} {t('CASES.COMMENTS_COUNT')}
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {daysLeft < 0 ? t('CASES.OVERDUE') : `${daysLeft} ${t('CASES.DAYS_UNTIL_TRIAL')}`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
