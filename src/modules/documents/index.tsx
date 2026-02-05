/**
 * @file DocumentsPage.tsx
 * @description Documents list page with filtering, search, and statistics
 *
 * PERFORMANCE TODO:
 * - Consider implementing virtual scrolling for large document lists (100+ items)
 *   using @tanstack/react-virtual or react-window library.
 *   This would significantly improve performance when displaying many documents
 *   by only rendering visible rows in the viewport.
 *   Example: Replace the documents.map() with a virtualized list component.
 */

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpDown, Clock, Download, FileText, Filter, Sparkles, Star, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useDocumentsStore } from '@/app/store/documents.store';
import { documentsService } from '@/app/services/documents/documents.service';
import { DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import { DocumentCard } from '@/modules/documents/ui/DocumentCard';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { DataPagination } from '@/shared/components/DataPagination';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { StatCard } from '@/shared/ui/stat-card';
import { formatFileSize, exportToCsv, formatDateForExport } from '@/shared/utils';

export function DocumentsPage() {
  const { t } = useI18n();
  const {
    documents,
    pagination,
    loading,
    error,
    fetchDocuments,
    deleteDocument,
  } = useDocumentsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

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

  const handleDeleteDocument = useCallback((id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteDocument = useCallback(async () => {
    if (!documentToDelete) return;
    try {
      await deleteDocument(documentToDelete);
      toast.success(t('COMMON.MESSAGES.DELETED'));
    } catch {
      toast.error(t('COMMON.ERRORS.GENERIC'));
    } finally {
      setDocumentToDelete(null);
    }
  }, [deleteDocument, documentToDelete, t]);

  const handleDownloadDocument = useCallback(async (id: string) => {
    try {
      const blob = await documentsService.download(id);
      const doc = documents.find(d => d.id === id);
      const filename = doc?.name || 'document';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      toast.error(t('DOCUMENTS.ERRORS.DOWNLOAD_FAILED'));
    }
  }, [documents, t]);

  const stats = [
    {
      label: t('DOCUMENTS.STATS.TOTAL'),
      value: pagination.totalItems ?? 0,
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

  const handleExport = () => {
    if (!documents.length) return;

    const statusLabels: Record<string, string> = {
      draft: t('DOCUMENTS.STATUS.DRAFT'),
      review: t('DOCUMENTS.STATUS.REVIEW'),
      final: t('DOCUMENTS.STATUS.FINAL'),
    };

    const categoryLabels: Record<string, string> = {
      legal: t('DOCUMENTS.FILTERS.LEGAL'),
      contract: t('DOCUMENTS.FILTERS.CONTRACTS'),
      administrative: t('DOCUMENTS.FILTERS.ADMINISTRATIVE'),
    };

    const columns = [
      { key: 'name', header: t('DOCUMENTS.FIELDS.NAME') },
      { key: 'caseName', header: t('DOCUMENTS.FIELDS.CASE') },
      { key: 'clientName', header: t('DOCUMENTS.FIELDS.CLIENT') },
      { key: 'category', header: t('DOCUMENTS.FIELDS.CATEGORY'), formatter: (v: unknown) => categoryLabels[v as string] || String(v || '') },
      { key: 'status', header: t('DOCUMENTS.FIELDS.STATUS'), formatter: (v: unknown) => statusLabels[v as string] || String(v || '') },
      { key: 'version', header: t('DOCUMENTS.FIELDS.VERSION') },
      { key: 'fileSize', header: t('DOCUMENTS.FIELDS.SIZE'), formatter: (v: unknown) => formatFileSize(v as number) },
      { key: 'mimeType', header: t('DOCUMENTS.FIELDS.TYPE') },
      { key: 'uploadedByName', header: t('DOCUMENTS.FIELDS.UPLOADED_BY') },
      { key: 'createdAt', header: t('COMMON.CREATED_AT'), formatter: (v: unknown) => formatDateForExport(v as string) },
      { key: 'updatedAt', header: t('COMMON.UPDATED_AT'), formatter: (v: unknown) => formatDateForExport(v as string) },
    ];

    const date = new Date().toISOString().split('T')[0];
    exportToCsv(documents as unknown as Record<string, unknown>[], columns, `documents_${date}`);
  };

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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={handleExport}
                disabled={!documents.length}
              >
                <Download className="w-4 h-4 mr-2" />
                {t('COMMON.ACTIONS.EXPORT')}
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md flex-1 sm:flex-none"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                {t('DOCUMENTS.UPLOAD_DOCUMENT')}
              </Button>
            </div>
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
                onDelete={handleDeleteDocument}
                onDownload={handleDownloadDocument}
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('DOCUMENTS.DELETE_CONFIRM_TITLE')}
        description={t('DOCUMENTS.DELETE_CONFIRM_DESC')}
        confirmText={t('COMMON.ACTIONS.DELETE')}
        cancelText={t('COMMON.ACTIONS.CANCEL')}
        onConfirm={confirmDeleteDocument}
        variant="destructive"
      />
    </div>
  );
}
