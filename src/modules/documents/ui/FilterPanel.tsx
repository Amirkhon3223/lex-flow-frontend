import { Search, Filter, Star } from 'lucide-react';
import type { FilterPanelProps } from '@/app/types/documents/documents.interfaces';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

export function FilterPanel({ searchQuery, onSearchChange, filterType, onFilterChange }: FilterPanelProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск документов..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <Button
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        onClick={() => onFilterChange('all')}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Все типы
                    </Button>
                    <Button
                        variant={filterType === 'favorite' ? 'default' : 'outline'}
                        onClick={() => onFilterChange('favorite')}
                    >
                        <Star className="mr-2 h-4 w-4" />
                        Избранные
                    </Button>
                    <select className="rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option>По дате</option>
                        <option>По названию</option>
                        <option>По размеру</option>
                    </select>
                </div>
            </CardContent>
        </Card>
    );
}
