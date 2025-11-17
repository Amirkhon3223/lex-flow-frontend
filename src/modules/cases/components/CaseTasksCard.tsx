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
          <span className="text-xs sm:text-sm text-gray-500">
            {completedCount}/{tasks.length}
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all ${
                task.completed ? 'bg-gray-50' : 'bg-blue-50'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" strokeWidth={2} />
              ) : (
                <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" strokeWidth={2} />
              )}
              <span
                className={`text-xs sm:text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-3 text-blue-500 hover:bg-blue-50 rounded-xl text-sm sm:text-base"
          onClick={onAddTask}
        >
          Добавить задачу
        </Button>
      </div>
    </Card>
  );
}
