import { useState, useEffect } from 'react';
import { ArrowUpDown, Clock, FileText, Filter, Sparkles, Star, Upload } from 'lucide-react';
import { useDocumentsStore } from '@/app/store/documents.store';
import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import { DocumentCard } from '@/modules/documents/ui/DocumentCard';
import { DataPagination } from '@/shared/components/DataPagination';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { StatCard } from '@/shared/ui/stat-card';
import { formatFileSize } from '@/shared/utils';

export function DocumentsPage() {
  const { t } = useI18n();
  const {
    documents,
    pagination,
    loading,
    error,
    fetchDocuments,
  } = useDocumentsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    fetchDocuments({
      page: 1,
      sortBy,
      search: searchQuery || undefined,

      category: filterCategory !== 'all' ? filterCategory : undefined,
    });
  }, [searchQuery, filterCategory, sortBy, fetchDocuments]);

  const handlePageChange = (page: number) => {
    fetchDocuments({
      page,
      sortBy,
      search: searchQuery || undefined,
      category: filterCategory !== 'all' ? filterCategory : undefined,
    });
  };

  const handleSuccess = () => {
    fetchDocuments({ page: pagination.page, sortBy });
  };

  const stats = [
    {
      label: t('DOCUMENTS.STATS.TOTAL'),
      value: pagination.totalItems,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      label: t('DOCUMENTS.STATS.ON_REVIEW'),
      value: documents.filter((d) => d.status === DocumentStatusEnum.REVIEW).length, // This will be inaccurate with pagination
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      label: t('DOCUMENTS.STATS.FAVORITES'),
      value: documents.filter((d) => d.starred).length, // This will be inaccurate with pagination
      icon: Star,
      color: 'text-yellow-500',
    },
    {
      label: t('DOCUMENTS.STATS.DRAFTS'),
      value: documents.filter((d) => d.status === DocumentStatusEnum.DRAFT).length, // This will be inaccurate with pagination
      icon: Filter,
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div>
      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={handleSuccess}
      />

      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex itms-center gap-3">
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
        ) : pagination.totalItems === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">{t('DOCUMENTS.EMPTY_STATE')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
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
        <DataPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      </main>
    </div>
  );
}
