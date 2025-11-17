import type { ParticipantItemProps } from '@/app/types/calendar/calendar.interfaces';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';

export function ParticipantItem({ name, role = 'Участник' }: ParticipantItemProps) {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('');

    return (
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs sm:text-sm">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div>
                <div className="font-medium text-xs sm:text-sm">{name}</div>
                <div className="text-xs text-gray-500">{role}</div>
            </div>
        </div>
    );
}
