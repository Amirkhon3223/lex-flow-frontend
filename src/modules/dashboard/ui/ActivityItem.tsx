import type { ActivityItemProps } from '@/app/types/dashboard/dashboard.interfaces';

export function ActivityItem({ action, item, client, time, isLast = false }: ActivityItemProps) {
  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
        {!isLast && <div className="w-px h-full bg-border mt-2"></div>}
      </div>
      <div className="flex-1 pb-4 min-w-0">
        <p className="text-sm sm:text-[15px] mb-1">
          <span className="text-foreground">Вы</span>{' '}
          <span className="text-muted-foreground">{action}</span>{' '}
          <span className="text-foreground break-words">{item}</span>
        </p>
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap">
          <span className="truncate max-w-[150px] sm:max-w-none">{client}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
