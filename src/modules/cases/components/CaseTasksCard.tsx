import { CheckCircle2, Circle } from 'lucide-react';
import { useCasesStore } from '@/app/store/cases.store';
import type { CaseTaskInterface } from '@/app/types/cases/cases.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface CaseTasksCardProps {
  tasks: CaseTaskInterface[];
  loading?: boolean;
  caseId: string;
  onAddTask: () => void;
}

export function CaseTasksCard({ tasks, loading, caseId, onAddTask }: CaseTasksCardProps) {
  const { t } = useI18n();
  const { toggleTask } = useCasesStore();
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleToggleTask = async (taskId: string) => {
    if (!caseId) return;
    await toggleTask(caseId, taskId);
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

        <Button
          onClick={onAddTask}
          className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm sm:text-base"
        >
          {t('CASES.TASKS.ADD')}
        </Button>
      </div>
    </Card>
  );
}
