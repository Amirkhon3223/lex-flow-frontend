import { Filter, Users } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function FilterPanel() {
    return (
        <>
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Все типы
            </Button>
            <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Все клиенты
            </Button>
        </>
    );
}
