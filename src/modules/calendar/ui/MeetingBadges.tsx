import type { ReactNode } from 'react';
import { Check, X, Video, Phone, Users } from 'lucide-react';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import type { MeetingInterface, MeetingBadgesProps } from '@/app/types/calendar/calendar.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
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

const getMeetingTypeLabel = (type: MeetingInterface['type'], t: (key: string) => string): string => {
    switch (type) {
        case MeetingTypeEnum.VIDEO:
            return t('CALENDAR.MEETING_TYPE.VIDEO');
        case MeetingTypeEnum.PHONE:
            return t('CALENDAR.MEETING_TYPE.PHONE');
        default:
            return t('CALENDAR.MEETING_TYPE.IN_PERSON');
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

const getPriorityLabel = (priority?: MeetingInterface['priority'], t?: (key: string) => string): string => {
    if (!t) return '';
    switch (priority) {
        case MeetingPriorityEnum.HIGH:
            return t('CALENDAR.PRIORITY_DETAILS.HIGH');
        case MeetingPriorityEnum.MEDIUM:
            return t('CALENDAR.PRIORITY_DETAILS.MEDIUM');
        default:
            return t('CALENDAR.PRIORITY_DETAILS.LOW');
    }
};

export function MeetingBadges({ type, priority, status }: MeetingBadgesProps) {
    const { t } = useI18n();

    return (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge className={`${getMeetingTypeColor(type)} border-0 text-xs`}>
                {getMeetingTypeIcon(type)}
                <span className="ml-1">{getMeetingTypeLabel(type, t)}</span>
            </Badge>
            {priority && (
                <Badge className={`${getPriorityColor(priority)} border-0 text-xs`}>
                    {getPriorityLabel(priority, t)}
                </Badge>
            )}
            {status === MeetingStatusEnum.COMPLETED && (
                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                    <Check className="w-3 h-3 mr-1" strokeWidth={2} />
                    {t('CALENDAR.STATUS.COMPLETED')}
                </Badge>
            )}
            {status === MeetingStatusEnum.CANCELLED && (
                <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                    <X className="w-3 h-3 mr-1" strokeWidth={2} />
                    {t('CALENDAR.STATUS.CANCELLED')}
                </Badge>
            )}
        </div>
    );
}
