import { Search } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  className = '',
}: SearchBarProps) {
  const { t } = useI18n();
  const ph = placeholder ?? t('COMMON.ACTIONS.SEARCH');

  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" strokeWidth={2} />
      <input
        type="text"
        placeholder={ph}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
