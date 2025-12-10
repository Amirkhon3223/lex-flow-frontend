import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  mobileLabel?: string;
  className?: string;
}

/**
 * Universal back button component used across all pages
 * Shows full label on desktop, "Назад" on mobile
 */
export function BackButton({
  onClick,
  label = 'Все дела',
  mobileLabel = 'Назад',
  className = '',
}: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      className={`text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl -ml-2 text-sm sm:text-base ${className}`}
      onClick={onClick}
    >
      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" strokeWidth={2} />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{mobileLabel}</span>
    </Button>
  );
}
