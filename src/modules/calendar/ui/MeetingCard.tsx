import { Clock, Video, Phone, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { MeetingTypeEnum, MeetingStatusEnum, MeetingPriorityEnum } from '@/app/types/calendar/calendar.enums';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';

interface MeetingCardProps {
    title: string;
    client: string;
    clientInitials: string;
    duration: string;
    location: string;
    case?: string;
    type: MeetingTypeEnum;
    status: MeetingStatusEnum;
    priority?: MeetingPriorityEnum;
    statusText: string;
    planned?: boolean;
}

export function MeetingCard({
    title,
    client,
    clientInitials,
    duration,
    location,
    case: caseName,
    type,
    status,
    priority,
    statusText,
    planned,
}: MeetingCardProps) {
    const getPriorityColor = (priority?: MeetingPriorityEnum) => {
        if (!priority) return 'bg-gray-100 text-gray-700 border-gray-200';
        switch (priority) {
            case MeetingPriorityEnum.HIGH:
                return 'bg-red-100 text-red-700 border-red-200';
            case MeetingPriorityEnum.MEDIUM:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case MeetingPriorityEnum.LOW:
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: MeetingStatusEnum) => {
        switch (status) {
            case MeetingStatusEnum.COMPLETED:
                return 'bg-green-100 text-green-700 border-green-200';
            case MeetingStatusEnum.SCHEDULED:
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case MeetingStatusEnum.CANCELLED:
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeIcon = (type: MeetingTypeEnum) => {
        switch (type) {
            case MeetingTypeEnum.VIDEO:
                return <Video className="h-4 w-4" />;
            case MeetingTypeEnum.PHONE:
                return <Phone className="h-4 w-4" />;
            case MeetingTypeEnum.IN_PERSON:
                return <MapPin className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    return (
        <div className="flex-1 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {clientInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                        <div className="mt-1 text-sm text-gray-600">{client}</div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {duration}
                            </div>
                            <div className="flex items-center gap-1">
                                {getTypeIcon(type)}
                                {location}
                            </div>
                            {caseName && (
                                <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    {caseName}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {status === MeetingStatusEnum.COMPLETED ? (
                        <Badge className={getStatusColor(status)}>
                            {statusText}
                        </Badge>
                    ) : (
                        <Badge className={getPriorityColor(priority)}>
                            {statusText}
                        </Badge>
                    )}
                    {planned && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            Запланировано
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}
