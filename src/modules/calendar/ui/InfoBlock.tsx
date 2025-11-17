import type { InfoBlockProps } from '@/app/types/calendar/calendar.interfaces';

export function InfoBlock({ icon, iconBgColor, label, value }: InfoBlockProps) {
    return (
        <div className="p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 sm:gap-2 md:gap-3">
                <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl ${iconBgColor} flex items-center justify-center flex-shrink-0`}
                >
                    {icon}
                </div>
                <div>
                    <div className="text-xs text-gray-500">{label}</div>
                    <div className="font-medium text-xs sm:text-sm md:text-base">{value}</div>
                </div>
            </div>
        </div>
    );
}
