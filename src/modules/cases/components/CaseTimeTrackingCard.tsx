import { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { useCasesStore } from '@/app/store/cases.store';
import { useAuthStore } from '@/app/store/auth.store';
import type { TimeEntryInterface, CreateTimeEntryInterface } from '@/app/types/cases/cases.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { formatCurrency } from '@/shared/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';

interface CaseTimeTrackingCardProps {
  caseId: string;
  timeEntries: TimeEntryInterface[];
  totalDuration: number;
  totalBillable: number;
  loading?: boolean;
  defaultHourlyRate?: number;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function CaseTimeTrackingCard({
  caseId,
  timeEntries,
  totalDuration,
  totalBillable,
  loading,
  defaultHourlyRate = 0,
}: CaseTimeTrackingCardProps) {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const userCurrency = user?.currency || 'USD';
  const { createTimeEntry, deleteTimeEntry } = useCasesStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [hourlyRate, setHourlyRate] = useState(defaultHourlyRate.toString());
  const [isBillable, setIsBillable] = useState(true);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setDescription('');
    setHours('');
    setMinutes('');
    setHourlyRate(defaultHourlyRate.toString());
    setIsBillable(true);
    setEntryDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async () => {
    const totalMinutes = (parseInt(hours || '0') * 60) + parseInt(minutes || '0');
    if (totalMinutes <= 0) return;

    setSubmitting(true);
    try {
      const data: CreateTimeEntryInterface = {
        description,
        duration: totalMinutes,
        hourlyRate: parseFloat(hourlyRate) || undefined,
        isBillable,
        entryDate,
      };
      await createTimeEntry(caseId, data);
      resetForm();
      setIsDialogOpen(false);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      await deleteTimeEntry(caseId, entryId);
    } catch {
    }
  };

  const totalHours = totalDuration / 60;

  return (
    <>
      <Card>
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
              {t('TIME_TRACKING.TITLE')}
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              {t('TIME_TRACKING.LOG_TIME')}
            </Button>
          </div>

          <div className="space-y-2">
            {loading && timeEntries.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {t('COMMON.LOADING')}
              </div>
            ) : timeEntries.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {t('TIME_TRACKING.EMPTY')}
              </div>
            ) : (
              timeEntries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-muted/50 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm truncate">
                      {entry.description || t('TIME_TRACKING.DESCRIPTION')}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                      {new Date(entry.entryDate).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'short',
                      })}
                      {entry.isBillable && entry.billableAmount > 0 && (
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          {formatCurrency(entry.billableAmount, userCurrency)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      {formatDuration(entry.duration)}
                    </span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {timeEntries.length > 0 && (
            <>
              <Separator className="my-3 bg-border" />
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">{t('TIME_TRACKING.TOTAL_HOURS')}</span>
                <span className="font-medium">{totalHours.toFixed(1)}h</span>
              </div>
              {totalBillable > 0 && (
                <div className="flex items-center justify-between text-xs sm:text-sm mt-1">
                  <span className="text-muted-foreground">{t('TIME_TRACKING.TOTAL_BILLABLE')}</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(totalBillable, userCurrency)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('TIME_TRACKING.LOG_TIME')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>{t('TIME_TRACKING.DESCRIPTION')}</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t('TIME_TRACKING.HOURS')}</Label>
                <Input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{t('TIME_TRACKING.MINUTES')}</Label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>{t('TIME_TRACKING.HOURLY_RATE')}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('TIME_TRACKING.ENTRY_DATE')}</Label>
              <Input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('TIME_TRACKING.BILLABLE')}</Label>
              <Switch checked={isBillable} onCheckedChange={setIsBillable} />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={submitting || ((parseInt(hours || '0') * 60) + parseInt(minutes || '0') <= 0)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {t('TIME_TRACKING.SAVE')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
