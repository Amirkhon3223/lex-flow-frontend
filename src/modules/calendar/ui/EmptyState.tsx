import type { EmptyStateProps } from '@/app/types/calendar/calendar.interfaces';

export function EmptyState({ icon, message, size = 'md' }: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      wrapper: 'py-4 sm:py-6',
      iconWrapper: 'w-12 h-12 sm:w-14 sm:h-14',
      icon: 'w-6 h-6 sm:w-7 sm:h-7',
    },
    md: {
      wrapper: 'py-6 sm:py-8',
      iconWrapper: 'w-12 h-12 sm:w-16 sm:h-16',
      icon: 'w-6 h-6 sm:w-8 sm:h-8',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`text-center ${classes.wrapper}`}>
      <div
        className={`${classes.iconWrapper} rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2 sm:mb-3`}
      >
        {icon}
      </div>
      <p className="text-xs sm:text-sm text-gray-500">{message}</p>
    </div>
  );
}
