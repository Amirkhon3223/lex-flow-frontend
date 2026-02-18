import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Plus,
  Calculator,
  CheckCircle,
  Trash2,
  AlertTriangle,
  CalendarDays,
} from 'lucide-react';
import { useDeadlineStore } from '@/app/store/deadline.store';
import type {
  CaseDeadline,
  DeadlineType,
  CreateDeadlineRequest,
  CalculateProceduralRequest,
} from '@/app/types/deadline/deadline.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

interface CaseDeadlinesCardProps {
  caseId: string;
  jurisdiction?: string;
  category?: string;
}

function getUrgencyClasses(deadline: CaseDeadline): string {
  if (deadline.status === 'completed') {
    return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
  }
  if (deadline.daysRemaining <= 0) {
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }
  if (deadline.daysRemaining <= 7) {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  }
  if (deadline.daysRemaining <= 30) {
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
}

function groupByType(deadlines: CaseDeadline[]): Record<DeadlineType, CaseDeadline[]> {
  const grouped: Record<DeadlineType, CaseDeadline[]> = {
    procedural: [],
    statute_of_limitations: [],
    manual: [],
  };
  for (const d of deadlines) {
    if (grouped[d.deadlineType]) {
      grouped[d.deadlineType].push(d);
    }
  }
  return grouped;
}

function getTypeI18nKey(type: DeadlineType): string {
  switch (type) {
    case 'procedural':
      return 'DEADLINES.PROCEDURAL';
    case 'statute_of_limitations':
      return 'DEADLINES.STATUTE';
    case 'manual':
      return 'DEADLINES.MANUAL';
  }
}

export default function CaseDeadlinesCard({ caseId, jurisdiction, category }: CaseDeadlinesCardProps) {
  const { t } = useI18n();
  const {
    deadlines,
    rules,
    loading,
    fetchDeadlines,
    createDeadline,
    calculateProcedural,
    completeDeadline,
    deleteDeadline,
    fetchRules,
  } = useDeadlineStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const [addName, setAddName] = useState('');
  const [addDueDate, setAddDueDate] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addNotes, setAddNotes] = useState('');
  const [addSubmitting, setAddSubmitting] = useState(false);

  const [calcJurisdiction, setCalcJurisdiction] = useState(jurisdiction ?? '');
  const [calcEventType, setCalcEventType] = useState('');
  const [calcEventDate, setCalcEventDate] = useState('');
  const [calcSubmitting, setCalcSubmitting] = useState(false);

  useEffect(() => {
    fetchDeadlines(caseId);
  }, [caseId, fetchDeadlines]);

  useEffect(() => {
    if (isCalcOpen) {
      fetchRules(calcJurisdiction || undefined);
    }
  }, [isCalcOpen, calcJurisdiction, fetchRules]);

  const grouped = useMemo(() => groupByType(deadlines), [deadlines]);

  const resetAddForm = () => {
    setAddName('');
    setAddDueDate('');
    setAddDescription('');
    setAddNotes('');
  };

  const resetCalcForm = () => {
    setCalcJurisdiction(jurisdiction ?? '');
    setCalcEventType('');
    setCalcEventDate('');
  };

  const handleAddSubmit = async () => {
    if (!addName.trim() || !addDueDate) return;
    setAddSubmitting(true);
    try {
      const data: CreateDeadlineRequest = {
        name: addName.trim(),
        deadlineType: 'manual',
        dueDate: addDueDate,
        ...(addDescription.trim() && { description: addDescription.trim() }),
        ...(addNotes.trim() && { notes: addNotes.trim() }),
      };
      await createDeadline(caseId, data);
      resetAddForm();
      setIsAddOpen(false);
    } catch {
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleCalcSubmit = async () => {
    if (!calcJurisdiction || !calcEventType || !calcEventDate) return;
    setCalcSubmitting(true);
    try {
      const data: CalculateProceduralRequest = {
        jurisdiction: calcJurisdiction,
        eventType: calcEventType,
        eventDate: calcEventDate,
      };
      await calculateProcedural(caseId, data);
      resetCalcForm();
      setIsCalcOpen(false);
    } catch {
    } finally {
      setCalcSubmitting(false);
    }
  };

  const handleComplete = async (deadlineId: string) => {
    try {
      await completeDeadline(caseId, deadlineId);
    } catch {
    }
  };

  const handleDelete = async (deadlineId: string) => {
    try {
      await deleteDeadline(caseId, deadlineId);
    } catch {
    }
  };

  const renderDeadlineItem = (deadline: CaseDeadline) => (
    <div
      key={deadline.id}
      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-muted/50 group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium truncate">{deadline.name}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getUrgencyClasses(deadline)}`}>
            {deadline.status === 'completed'
              ? t('DEADLINES.COMPLETED')
              : deadline.daysRemaining <= 0
                ? t('DEADLINES.OVERDUE')
                : `${deadline.daysRemaining} ${t('DEADLINES.DAYS_REMAINING')}`}
          </Badge>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <CalendarDays className="w-3 h-3" />
          {new Date(deadline.dueDate).toLocaleDateString()}
          {deadline.description && (
            <>
              <span className="mx-1">&middot;</span>
              <span className="truncate">{deadline.description}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {deadline.status !== 'completed' && (
          <button
            onClick={() => handleComplete(deadline.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-green-500/10"
            title={t('DEADLINES.COMPLETE')}
          >
            <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          </button>
        )}
        <button
          onClick={() => handleDelete(deadline.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
          title={t('DEADLINES.DELETE')}
        >
          <Trash2 className="w-3 h-3 text-destructive" />
        </button>
      </div>
    </div>
  );

  const typeOrder: DeadlineType[] = ['procedural', 'statute_of_limitations', 'manual'];

  return (
    <>
      <Card>
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
              {t('DEADLINES.TITLE')}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => setIsCalcOpen(true)}
              >
                <Calculator className="w-3 h-3 mr-1" />
                {t('DEADLINES.AUTO_CALCULATE')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => setIsAddOpen(true)}
              >
                <Plus className="w-3 h-3 mr-1" />
                {t('DEADLINES.ADD_MANUAL')}
              </Button>
            </div>
          </div>

          {loading && deadlines.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              {t('COMMON.LOADING')}
            </div>
          ) : deadlines.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              {t('DEADLINES.NO_DEADLINES')}
            </div>
          ) : (
            <div className="space-y-4">
              {typeOrder.map((type) => {
                const items = grouped[type];
                if (items.length === 0) return null;
                return (
                  <div key={type}>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      {t(getTypeI18nKey(type))}
                    </h4>
                    <div className="space-y-2">{items.map(renderDeadlineItem)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('DEADLINES.ADD_MANUAL')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>{t('DEADLINES.FIELDS.NAME')}</Label>
              <Input
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('DEADLINES.FIELDS.DUE_DATE')}</Label>
              <Input
                type="date"
                value={addDueDate}
                onChange={(e) => setAddDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('DEADLINES.FIELDS.DESCRIPTION')}</Label>
              <Input
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('DEADLINES.FIELDS.NOTES')}</Label>
              <Input
                value={addNotes}
                onChange={(e) => setAddNotes(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleAddSubmit}
              disabled={addSubmitting || !addName.trim() || !addDueDate}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {t('DEADLINES.ADD_MANUAL')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCalcOpen} onOpenChange={setIsCalcOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('DEADLINES.AUTO_CALCULATE')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>{t('DEADLINES.FIELDS.JURISDICTION')}</Label>
              <Select value={calcJurisdiction} onValueChange={setCalcJurisdiction}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="russia">Russia</SelectItem>
                  <SelectItem value="tajikistan">Tajikistan</SelectItem>
                  <SelectItem value="us">US</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('DEADLINES.FIELDS.EVENT_TYPE')}</Label>
              <Select value={calcEventType} onValueChange={setCalcEventType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rules.map((rule) => (
                    <SelectItem key={rule.key} value={rule.key}>
                      {rule.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('DEADLINES.FIELDS.EVENT_DATE')}</Label>
              <Input
                type="date"
                value={calcEventDate}
                onChange={(e) => setCalcEventDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleCalcSubmit}
              disabled={calcSubmitting || !calcJurisdiction || !calcEventType || !calcEventDate}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {t('DEADLINES.AUTO_CALCULATE')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
