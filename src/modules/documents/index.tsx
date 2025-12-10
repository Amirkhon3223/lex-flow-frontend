import { useState } from 'react';
import { ArrowUpDown, Clock, FileText, Filter, Sparkles, Star, Upload } from 'lucide-react';
import { DocumentCategoryEnum, DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import type { DocumentInterface } from '@/app/types/documents/documents.interfaces';
import { DocumentCard } from '@/modules/documents/ui/DocumentCard';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { StatCard } from '@/shared/ui/stat-card';

export function DocumentsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const documents: DocumentInterface[] = [
    {
      id: 1,
      name: 'Исковое заявление.pdf',
      case: 'Трудовой спор - увольнение',
      client: 'Иванов П.А.',
      type: 'Иск',
      size: '2.4 MB',
      date: '15 окт 2025',
      versions: 3,
      status: DocumentStatusEnum.FINAL,
      category: DocumentCategoryEnum.LEGAL,
      lastModified: '2 часа назад',
      starred: true,
    },
    {
      id: 2,
      name: 'Договор аренды помещения.pdf',
      case: 'Договор аренды',
      client: 'ООО "ТехноСтрой"',
      type: 'Договор',
      size: '1.8 MB',
      date: '14 окт 2025',
      versions: 2,
      status: DocumentStatusEnum.REVIEW,
      category: DocumentCategoryEnum.CONTRACT,
      lastModified: '5 часов назад',
      starred: false,
    },
    {
      id: 3,
      name: 'Трудовой договор.pdf',
      case: 'Трудовой спор - увольнение',
      client: 'Иванов П.А.',
      type: 'Договор',
      size: '1.5 MB',
      date: '12 окт 2025',
      versions: 2,
      status: DocumentStatusEnum.FINAL,
      category: DocumentCategoryEnum.CONTRACT,
      lastModified: '1 день назад',
      starred: true,
    },
    {
      id: 4,
      name: 'Приказ об увольнении.pdf',
      case: 'Трудовой спор - увольнение',
      client: 'Иванов П.А.',
      type: 'Приказ',
      size: '856 KB',
      date: '10 окт 2025',
      versions: 1,
      status: DocumentStatusEnum.DRAFT,
      category: DocumentCategoryEnum.ADMINISTRATIVE,
      lastModified: '3 дня назад',
      starred: false,
    },
    {
      id: 5,
      name: 'Возражение на иск.pdf',
      case: 'Наследственное дело',
      client: 'Смирнова А.В.',
      type: 'Возражение',
      size: '3.2 MB',
      date: '8 окт 2025',
      versions: 4,
      status: DocumentStatusEnum.REVIEW,
      category: DocumentCategoryEnum.LEGAL,
      lastModified: '5 дней назад',
      starred: false,
    },
    {
      id: 6,
      name: 'Доверенность.pdf',
      case: 'Договор аренды',
      client: 'ООО "ТехноСтрой"',
      type: 'Доверенность',
      size: '456 KB',
      date: '5 окт 2025',
      versions: 1,
      status: DocumentStatusEnum.FINAL,
      category: DocumentCategoryEnum.ADMINISTRATIVE,
      lastModified: '1 неделю назад',
      starred: true,
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.case.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return parseFloat(a.size) - parseFloat(b.size);
      case 'versions':
        return b.versions - a.versions;
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const stats = [
    {
      label: t('DOCUMENTS.STATS.TOTAL'),
      value: documents.length,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      label: t('DOCUMENTS.STATS.ON_REVIEW'),
      value: documents.filter((d) => d.status === DocumentStatusEnum.REVIEW).length,
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      label: t('DOCUMENTS.STATS.FAVORITES'),
      value: documents.filter((d) => d.starred).length,
      icon: Star,
      color: 'text-yellow-500',
    },
    {
      label: t('DOCUMENTS.STATS.DRAFTS'),
      value: documents.filter((d) => d.status === DocumentStatusEnum.DRAFT).length,
      icon: Filter,
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div>
      <UploadDocumentDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />

      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight">
                  {t('DOCUMENTS.TITLE')}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  {t('DOCUMENTS.SUBTITLE')}
                </p>
              </div>
            </div>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md w-full sm:w-auto"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
              {t('DOCUMENTS.UPLOAD_DOCUMENT')}
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          <FilterBar
            searchConfig={{
              value: searchQuery,
              onChange: setSearchQuery,
              placeholder: t('DOCUMENTS.SEARCH_PLACEHOLDER'),
              className: 'flex-1',
            }}
            filters={[
              {
                value: filterCategory,
                onChange: setFilterCategory,
                placeholder: t('DOCUMENTS.FIELDS.TYPE'),
                width: 'w-[200px]',
                icon: Filter,
                options: [
                  { value: 'all', label: t('DOCUMENTS.FILTERS.ALL_CATEGORIES') },
                  { value: 'legal', label: t('DOCUMENTS.FILTERS.LEGAL') },
                  { value: 'contract', label: t('DOCUMENTS.FILTERS.CONTRACTS') },
                  { value: 'administrative', label: t('DOCUMENTS.FILTERS.ADMINISTRATIVE') },
                ],
              },
              {
                value: sortBy,
                onChange: setSortBy,
                placeholder: t('DOCUMENTS.FILTERS.SORT_BY'),
                width: 'w-[180px]',
                icon: ArrowUpDown,
                options: [
                  { value: 'date', label: t('DOCUMENTS.FILTERS.SORT_BY_DATE') },
                  { value: 'name', label: t('DOCUMENTS.FILTERS.SORT_BY_NAME') },
                  { value: 'size', label: t('DOCUMENTS.FILTERS.SORT_BY_SIZE') },
                  { value: 'versions', label: t('DOCUMENTS.FILTERS.SORT_BY_VERSIONS') },
                ],
              },
            ]}
          />
        </div>
      </header>

      <main className="py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          {sortedDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.name}
              case={doc.case}
              author={doc.client}
              type={doc.type}
              size={doc.size}
              date={doc.date}
              versions={doc.versions}
              status={doc.status}
              statusText=""
              favorite={doc.starred}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
