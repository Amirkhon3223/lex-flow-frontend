import { Calendar as CalendarIcon, List } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ViewToggleProps {
    viewMode: 'calendar' | 'list';
    onViewChange: (mode: 'calendar' | 'list') => void;
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex gap-2">
            <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onViewChange('calendar')}
            >
                <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onViewChange('list')}
            >
                <List className="h-4 w-4" />
            </Button>
        </div>
    );
}
