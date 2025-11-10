import type { SessionItemProps } from '@/app/types/settings/settings.interfaces';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function SessionItem({ session, onTerminate }: SessionItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="tracking-tight">{session.device}</h4>
          {session.current && (
            <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
              Текущее
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{session.location} • {session.time}</p>
      </div>
      {!session.current && (
        <Button
          variant="outline"
          size="sm"
          onClick={onTerminate}
          className="rounded-lg border-gray-200 hover:bg-red-50 hover:text-red-600"
        >
          Завершить
        </Button>
      )}
    </div>
  );
}
