import { CheckCircle2, Circle } from 'lucide-react';
import type { CaseTaskInterface } from '@/app/types/cases/cases.interfaces';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface CaseTasksCardProps {
  tasks: CaseTaskInterface[];
  onAddTask: () => void;
}

export function CaseTasksCard({ tasks, onAddTask }: CaseTasksCardProps) {
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Card>
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg tracking-tight">Задачи</h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {completedCount}/{tasks.length}
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`
                flex items-center gap-2 sm:gap-3
                p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer
                ${task.completed ? 'bg-task-done-bg' : 'bg-task-open-bg'}
              `}
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
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-3 text-task-icon-open hover:bg-task-button-hover rounded-xl text-sm sm:text-base"
          onClick={onAddTask}
        >
          Добавить задачу
        </Button>
      </div>
    </Card>
  );
}
