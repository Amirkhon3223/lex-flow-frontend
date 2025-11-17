import { ArrowLeft, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { MeetingBadges } from '@/modules/calendar/ui/MeetingBadges';
import { Button } from '@/shared/ui/button';

interface MeetingHeaderProps {
  meeting: MeetingInterface;
  onEdit: () => void;
  onDelete: () => void;
}

export function MeetingHeader({ meeting, onEdit, onDelete }: MeetingHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200/50 rounded-xl mb-4 sm:mb-6">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Button
            variant="ghost"
            className="text-blue-500 hover:bg-blue-50 rounded-xl -ml-2 text-sm sm:text-base"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" strokeWidth={2} />
            <span className="hidden sm:inline">Все встречи</span>
            <span className="sm:hidden">Назад</span>
          </Button>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={onEdit}
              className="rounded-lg sm:rounded-xl border-gray-200 text-xs h-7 sm:h-8 md:h-9 px-2 sm:px-3"
            >
              <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2} />
              <span className="hidden md:inline">Редактировать</span>
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="rounded-lg sm:rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-xs h-7 sm:h-8 md:h-9 px-2 sm:px-3"
            >
              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 md:mr-2" strokeWidth={2} />
              <span className="hidden md:inline">Удалить</span>
            </Button>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight mb-0.5 sm:mb-1">
            {meeting.title}
          </h1>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-xs sm:text-xs md:text-sm text-gray-500">
            <span className="flex items-center gap-1 sm:gap-1 md:gap-1.5">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" strokeWidth={2} />
              {meeting.date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1 sm:gap-1 md:gap-1.5">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" strokeWidth={2} />
              {meeting.time}
            </span>
          </div>
        </div>

        <MeetingBadges type={meeting.type} priority={meeting.priority} status={meeting.status} />
      </div>
    </header>
  );
}
