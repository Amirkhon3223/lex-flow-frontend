import type { ReactNode } from 'react';
import { Check, X, Video, Phone, Users } from 'lucide-react';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface, MeetingBadgesProps } from '@/app/types/calendar/calendar.interfaces';
import { Badge } from '@/shared/ui/badge';

const getMeetingTypeIcon = (type: MeetingInterface['type']): ReactNode => {
    switch (type) {
        case MeetingTypeEnum.VIDEO:
            return <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />;
        case MeetingTypeEnum.PHONE:
            return <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />;
        default:
            return <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />;
    }
};

const getMeetingTypeColor = (type: MeetingInterface['type']): string => {
    switch (type) {
        case MeetingTypeEnum.VIDEO:
            return 'bg-purple-100 text-purple-700';
        case MeetingTypeEnum.PHONE:
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-blue-100 text-blue-700';
    }
};

const getMeetingTypeLabel = (type: MeetingInterface['type']): string => {
    switch (type) {
        case MeetingTypeEnum.VIDEO:
            return 'Видеовстреча';
        case MeetingTypeEnum.PHONE:
            return 'Телефонный звонок';
        default:
            return 'Личная встреча';
    }
};

const getPriorityColor = (priority?: MeetingInterface['priority']): string => {
    switch (priority) {
        case MeetingPriorityEnum.HIGH:
            return 'bg-red-100 text-red-700';
        case MeetingPriorityEnum.MEDIUM:
            return 'bg-amber-100 text-amber-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getPriorityLabel = (priority?: MeetingInterface['priority']): string => {
    switch (priority) {
        case MeetingPriorityEnum.HIGH:
            return 'Высокий приоритет';
        case MeetingPriorityEnum.MEDIUM:
            return 'Средний приоритет';
        default:
            return 'Низкий приоритет';
    }
};

export function MeetingBadges({ type, priority, status }: MeetingBadgesProps) {
    return (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge className={`${getMeetingTypeColor(type)} border-0 text-xs`}>
                {getMeetingTypeIcon(type)}
                <span className="ml-1">{getMeetingTypeLabel(type)}</span>
            </Badge>
            {priority && (
                <Badge className={`${getPriorityColor(priority)} border-0 text-xs`}>
                    {getPriorityLabel(priority)}
                </Badge>
            )}
            {status === MeetingStatusEnum.COMPLETED && (
                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                    <Check className="w-3 h-3 mr-1" strokeWidth={2} />
                    Завершено
                </Badge>
            )}
            {status === MeetingStatusEnum.CANCELLED && (
                <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                    <X className="w-3 h-3 mr-1" strokeWidth={2} />
                    Отменено
                </Badge>
            )}
        </div>
    );
}
