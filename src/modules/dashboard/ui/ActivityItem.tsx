import type { ActivityItemProps } from '@/app/types/dashboard/dashboard.interfaces';

export function ActivityItem({ action, item, client, time, isLast = false }: ActivityItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        {!isLast && (
          <div className="w-px h-full bg-gray-200 mt-2"></div>
        )}
      </div>
      <div className="flex-1 pb-4">
        <p className="text-[15px] mb-1">
          <span className="text-gray-900">Вы</span>{' '}
          <span className="text-gray-500">{action}</span>{' '}
          <span className="text-gray-900">{item}</span>
        </p>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>{client}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
