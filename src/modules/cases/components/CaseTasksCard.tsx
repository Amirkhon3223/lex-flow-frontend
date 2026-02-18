import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ListChecks, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCasesStore } from '@/app/store/cases.store';
import { taskTemplatesService } from '@/app/services/taskTemplates/taskTemplates.service';
import type { TaskTemplate } from '@/app/types/taskTemplates/taskTemplates.interfaces';
import type { CaseTaskInterface } from '@/app/types/cases/cases.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';

interface CaseTasksCardProps {
  tasks: CaseTaskInterface[];
  loading?: boolean;
  caseId: string;
  category?: string;
  onAddTask: () => void;
  onTasksChanged?: () => void;
}

export function CaseTasksCard({
  tasks,
  loading,
  caseId,
  category,
  onAddTask,
  onTasksChanged,
}: CaseTasksCardProps) {
  const { t } = useI18n();
  const { toggleTask } = useCasesStore();
  const completedCount = tasks.filter((t) => t.completed).length;

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleToggleTask = async (taskId: string) => {
    if (!caseId) return;
    await toggleTask(caseId, taskId);
  };

  useEffect(() => {
    if (!templateDialogOpen) return;

    const fetchTemplates = async () => {
      setTemplatesLoading(true);
      try {
        const response = await taskTemplatesService.getAll({
          page: 1,
          limit: 50,
          category: category || undefined,
        });
        setTemplates(response.templates.filter((tpl) => tpl.isActive));
      } catch {
        setTemplates([]);
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, [templateDialogOpen, category]);

  const handleApplyTemplate = async (templateId: string) => {
    setApplyingId(templateId);
    try {
      await taskTemplatesService.applyToCase(templateId, caseId);
      toast.success(t('TASK_TEMPLATES.APPLY_SUCCESS'));
      setTemplateDialogOpen(false);
      onTasksChanged?.();
    } catch {
      toast.error(t('TASK_TEMPLATES.APPLY_ERROR'));
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <Card>
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold">{t('CASES.TASKS.TITLE')}</h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {`${completedCount}/${tasks.length}`}
          </span>
        </div>

        <div className="space-y-2">
          {loading && tasks.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              {t('COMMON.LOADING')}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              {t('CASES.TASKS.EMPTY')}
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`
                  flex items-center gap-2 sm:gap-3
                  p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer
                  ${task.completed ? 'bg-task-done-bg' : 'bg-task-open-bg'}
                `}
                onClick={() => handleToggleTask(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2
                    className="w-4 h-4 sm:w-5 sm:h-5 text-task-icon-done flex-shrink-0"
                    strokeWidth={2}
                  />
                ) : (
                  <Circle
                    className="w-4 h-4 sm:w-5 sm:h-5 text-task-icon-open flex-shrink-0"
                    strokeWidth={2}
                  />
                )}

                <span
                  className={`
                    text-xs sm:text-sm
                    ${task.completed ? 'text-task-done-fg line-through' : 'text-task-open-fg'}
                  `}
                >
                  {task.title}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            onClick={onAddTask}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm sm:text-base"
          >
            {t('CASES.TASKS.ADD')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setTemplateDialogOpen(true)}
            className="rounded-xl text-sm sm:text-base"
          >
            <ListChecks className="w-4 h-4 mr-1.5" />
            {t('TASK_TEMPLATES.APPLY_TEMPLATE')}
          </Button>
        </div>
      </div>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('TASK_TEMPLATES.APPLY_TEMPLATE')}</DialogTitle>
            <DialogDescription>{t('TASK_TEMPLATES.DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {templatesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t('TASK_TEMPLATES.NO_TEMPLATES')}
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{template.name}</p>
                      {template.isSystem && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shrink-0">
                          {t('TASK_TEMPLATES.SYSTEM')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('TASK_TEMPLATES.TASKS')}: {template.tasks.length}
                      {' · '}
                      {t('TASK_TEMPLATES.USAGE_COUNT')}: {template.usageCount}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleApplyTemplate(template.id)}
                    disabled={applyingId !== null}
                    className="shrink-0"
                  >
                    {applyingId === template.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      t('TASK_TEMPLATES.APPLY')
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
