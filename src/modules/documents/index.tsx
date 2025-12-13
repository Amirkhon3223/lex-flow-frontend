import { useState, useEffect } from 'react';
import { ArrowUpDown, Clock, FileText, Filter, Sparkles, Star, Upload } from 'lucide-react';
import { documentsService } from '@/app/services/documents/documents.service';
import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import type { DocumentInterface } from '@/app/types/documents/documents.interfaces';
import { DocumentCard } from '@/modules/documents/ui/DocumentCard';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { StatCard } from '@/shared/ui/stat-card';
import { formatFileSize } from '@/shared/utils';

export function DocumentsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        search: searchQuery || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
      };
      const response = await documentsService.list(params);
      setDocuments(response.documents);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError(t('DOCUMENTS.ERRORS.LOAD_FAILED'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [searchQuery, filterCategory]);

  const sortedDocuments = [...documents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.fileSize - a.fileSize;
      case 'versions':
        return b.versionsCount - a.versionsCount;
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={fetchDocuments}
      />

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : sortedDocuments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">{t('DOCUMENTS.EMPTY_STATE')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {sortedDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id as any}
                title={doc.name}
                case={doc.caseName || '-'}
                author={doc.clientName || '-'}
                type={doc.type}
                size={formatFileSize(doc.fileSize)}
                date={new Date(doc.createdAt).toLocaleDateString()}
                versions={doc.versionsCount}
                status={doc.status}
                statusText=""
                favorite={doc.starred}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
