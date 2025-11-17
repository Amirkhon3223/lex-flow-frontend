import type { SessionItemProps } from '@/app/types/settings/settings.interfaces';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function SessionItem({ session, onTerminate }: SessionItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gray-50">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
          <h4 className="tracking-tight text-xs sm:text-sm md:text-base truncate">{session.device}</h4>
          {session.current && (
            <Badge className="bg-blue-100 text-blue-700 border-0 text-xs flex-shrink-0">Текущее</Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-500">
          {session.location} • {session.time}
        </p>
      </div>
      {!session.current && (
        <Button
          variant="outline"
          size="sm"
          onClick={onTerminate}
          className="rounded-md sm:rounded-lg border-gray-200 hover:bg-red-50 hover:text-red-600 text-xs h-7 sm:h-8 px-2 sm:px-3 flex-shrink-0"
        >
          Завершить
        </Button>
      )}
    </div>
  );
}
