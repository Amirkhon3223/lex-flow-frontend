import { useState } from 'react';
import { Upload, FileText, Clock, Star, History } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { DocumentCard } from './ui/DocumentCard';
import { FilterPanel } from './ui/FilterPanel';

const documents = [
    {
        id: 1,
        title: 'Исковое заявление.pdf',
        case: 'Трудовой спор - увольнение',
        author: 'Иванов П.А.',
        type: 'Иск',
        size: '2.4 MB',
        date: '15 окт 2025',
        versions: 3,
        status: 'final',
        statusText: 'Финал',
        favorite: true,
    },
    {
        id: 2,
        title: 'Договор аренды помещения.pdf',
        case: 'Договор аренды',
        author: 'ООО "ТехноСтрой"',
        type: 'Договор',
        size: '1.8 MB',
        date: '14 окт 2025',
        versions: 2,
        status: 'review',
        statusText: 'Проверка',
        favorite: false,
    },
    {
        id: 3,
        title: 'Трудовой договор.pdf',
        case: 'Трудовой спор - увольнение',
        author: 'Иванов П.А.',
        type: 'Договор',
        size: '1.5 MB',
        date: '12 окт 2025',
        versions: 2,
        status: 'final',
        statusText: 'Финал',
        favorite: true,
    },
    {
        id: 4,
        title: 'Приказ об увольнении.pdf',
        case: 'Трудовой спор - увольнение',
        author: 'Иванов П.А.',
        type: 'Приказ',
        size: '856 KB',
        date: '10 окт 2025',
        versions: 1,
        status: 'draft',
        statusText: 'Черновик',
        favorite: false,
    },
    {
        id: 5,
        title: 'Возражение на иск.pdf',
        case: 'Наследственное дело',
        author: 'Смирнова А.В.',
        type: 'Возражение',
        size: '3.2 MB',
        date: '8 окт 2025',
        versions: 4,
        status: 'review',
        statusText: 'Проверка',
        favorite: false,
    },
    {
        id: 6,
        title: 'Доверенность.pdf',
        case: 'Договор аренды',
        author: 'ООО "ТехноСтрой"',
        type: 'Доверенность',
        size: '456 KB',
        date: '5 окт 2025',
        versions: 1,
        status: 'final',
        statusText: 'Финал',
        favorite: true,
    },
];

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'favorite'>('all');

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.case.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || (filterType === 'favorite' && doc.favorite);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Документы</h1>
                    <p className="text-sm text-gray-600">Управление всеми документами и версиями</p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Загрузить документ
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Всего</p>
                                <p className="mt-2 text-3xl font-bold">156</p>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600">На проверке</p>
                                <p className="mt-2 text-3xl font-bold">12</p>
                            </div>
                            <div className="rounded-lg bg-yellow-50 p-3">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Избранные</p>
                                <p className="mt-2 text-3xl font-bold">8</p>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3">
                                <Star className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Версий</p>
                                <p className="mt-2 text-3xl font-bold">34</p>
                            </div>
                            <div className="rounded-lg bg-green-50 p-3">
                                <History className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <FilterPanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterType={filterType}
                onFilterChange={setFilterType}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Документы ({filteredDocuments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredDocuments.map((doc) => (
                            <DocumentCard key={doc.id} {...doc} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
