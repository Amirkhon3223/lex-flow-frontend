import { Filter, Star } from 'lucide-react';
import type { FilterPanelProps } from '@/app/types/documents/documents.interfaces';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { SearchBar } from '@/shared/ui/search-bar';

export function FilterPanel({ searchQuery, onSearchChange, filterType, onFilterChange }: FilterPanelProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder="Поиск документов..."
                        className="flex-1"
                    />
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
