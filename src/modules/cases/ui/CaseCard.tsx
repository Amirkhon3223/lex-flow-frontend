import { FileText, Calendar, Clock } from 'lucide-react';
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

  // Вычисляем количество дней до дедлайна
  const calculateDaysLeft = (deadline: string): number => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(caseItem.deadline);
  const formattedDeadline = formatDate(caseItem.deadline);

  // Получаем инициалы клиента
  const getClientInitials = (clientName: string): string => {
    const words = clientName.split(' ').filter(w => w.length > 0);
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  const clientInitials = getClientInitials(caseItem.clientName);

  // Получаем текст статуса
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'new': t('COMMON.STATUS.NEW'),
      'in_progress': t('COMMON.STATUS.IN_PROGRESS'),
      'waiting': t('COMMON.STATUS.WAITING'),
      'closed': t('COMMON.STATUS.CLOSED'),
      'won': t('COMMON.STATUS.WON'),
      'lost': t('COMMON.STATUS.LOST'),
      'settled': t('COMMON.STATUS.SETTLED'),
    };
    return statusMap[status] || status;
  };
  return (
    <Link
      to={`/cases/${caseItem.id}`}
      className="block rounded-xl border p-3 sm:p-4 transition-colors hover:bg-muted/50"
    >
      {/* Mobile layout (< 768px) */}
      <div className="md:hidden">
        <div className="flex items-start gap-3 mb-2">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {clientInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm mb-1">{caseItem.title}</h3>
            <Badge className={`${getStatusColor(caseItem.status)} text-xs`}>
              {getStatusText(caseItem.status)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{caseItem.category}</span>
          <span className="font-medium">{formattedDeadline}</span>
        </div>

        <div className="mb-2">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('CASES.FIELDS.PROGRESS')}</span>
            <span className="font-medium">{caseItem.progress}%</span>
          </div>
          <Progress value={caseItem.progress} className="h-1.5" />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {caseItem.documents} {t('CASES.DOCUMENTS_COUNT')}.
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {caseItem.commentsCount} {t('CASES.COMMENTS_COUNT')}.
          </div>
          <div className={`ml-auto text-xs ${daysLeft < 0 ? 'text-destructive' : daysLeft < 7 ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}>
            {daysLeft < 0 ? t('CASES.OVERDUE') : `${daysLeft} ${t('CASES.DAYS_SHORT')}`}
          </div>
        </div>
      </div>

      {/* Desktop/Tablet layout (>= 768px) */}
      <div className="hidden md:flex items-start gap-4">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">
            {clientInitials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{caseItem.title}</h3>
                <Badge className={getStatusColor(caseItem.status)}>
                  {getStatusText(caseItem.status)}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span>👤 {caseItem.clientName}</span>
                <span>•</span>
                <span>{caseItem.category}</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-sm text-muted-foreground">{t('CASES.FIELDS.DEADLINE')}</div>
              <div className="font-medium text-foreground">{formattedDeadline}</div>
              <div className={`text-xs ${daysLeft < 0 ? 'text-destructive' : daysLeft < 7 ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}>
                {daysLeft < 0 ? `${t('CASES.OVERDUE')} ${Math.abs(daysLeft)} ${t('CASES.DAYS_SHORT')}` : `${t('CASES.REMAINING')} ${daysLeft} ${t('CASES.DAYS_SHORT')}`}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">{t('CASES.FIELDS.PROGRESS')}:</span>
              <span className="font-medium">{caseItem.progress}%</span>
            </div>
            <Progress value={caseItem.progress} />
          </div>

          <div className="flex items-center gap-5 text-sm text-muted-foreground">
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
