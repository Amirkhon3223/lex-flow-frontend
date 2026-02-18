/**
 * @file TemplatesPage.tsx
 * @description Document Templates list page with filtering, search, and CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  Grid3X3,
  List,
  Filter,
  ArrowUpDown,
  Download,
  Sparkles,
} from 'lucide-react';
import { useTemplatesStore } from '@/app/store/templates.store';
import {
  TemplateCategoryEnum,
  type DocumentTemplate,
} from '@/app/types/templates/templates.types';
import { DataPagination } from '@/shared/components/DataPagination';
import { FilterBar } from '@/shared/components/filters/FilterBar';
import { useI18n } from '@/shared/context/I18nContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { StatCard } from '@/shared/ui/stat-card';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group';
import { TemplateCard } from './components/TemplateCard';
import { TemplateEditor } from './components/TemplateEditor';
import { TemplatePreview } from './components/TemplatePreview';
import { GenerateDocumentDialog } from './components/GenerateDocumentDialog';

export function TemplatesPage() {
  const { t } = useI18n();
  const {
    templates,
    pagination,
    loading,
    error,
    fetchTemplates,
    deleteTemplate,
  } = useTemplatesStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  useEffect(() => {
    fetchTemplates({
      page: 1,
      category: filterCategory !== 'all' ? filterCategory : undefined,
      search: searchQuery || undefined,
    });
  }, [searchQuery, filterCategory, sortBy, fetchTemplates]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchTemplates({
        page,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        search: searchQuery || undefined,
      });
    },
    [fetchTemplates, filterCategory, searchQuery]
  );

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEditTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };

  const handlePreviewTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleGenerateDocument = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsGenerateOpen(true);
  };

  const handleDeleteClick = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate) return;
    try {
      await deleteTemplate(selectedTemplate.id);
      setIsDeleteDialogOpen(false);
      setSelectedTemplate(null);
    } catch {
    }
  };

  const handleEditorSuccess = () => {
    fetchTemplates({
      page: pagination.page,
      category: filterCategory !== 'all' ? filterCategory : undefined,
      search: searchQuery || undefined,
    });
  };

  const stats = [
    {
      label: t('TEMPLATES.STATS.TOTAL'),
      value: pagination.total,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      label: t('TEMPLATES.STATS.LAWSUITS'),
      value: templates.filter((t) => t.category === TemplateCategoryEnum.LAWSUIT).length,
      icon: FileText,
      color: 'text-red-500',
    },
    {
      label: t('TEMPLATES.STATS.CONTRACTS'),
      value: templates.filter((t) => t.category === TemplateCategoryEnum.CONTRACT).length,
      icon: FileText,
      color: 'text-green-500',
    },
    {
      label: t('TEMPLATES.STATS.OTHER'),
      value: templates.filter(
        (t) =>
          t.category !== TemplateCategoryEnum.LAWSUIT &&
          t.category !== TemplateCategoryEnum.CONTRACT
      ).length,
      icon: FileText,
      color: 'text-purple-500',
    },
  ];

  return (
    <div>
      <TemplateEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        template={selectedTemplate}
        onSuccess={handleEditorSuccess}
      />

      <TemplatePreview
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        template={selectedTemplate}
      />

      <GenerateDocumentDialog
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
        template={selectedTemplate}
        onSuccess={() => {
        }}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('TEMPLATES.DELETE_CONFIRM_TITLE')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('TEMPLATES.DELETE_CONFIRM_MESSAGE', { name: selectedTemplate?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('COMMON.ACTIONS.CANCEL')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('COMMON.ACTIONS.DELETE')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight">
                  {t('TEMPLATES.TITLE')}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  {t('TEMPLATES.SUBTITLE')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={!templates.length}
              >
                <Download className="w-4 h-4 mr-2" />
                {t('COMMON.ACTIONS.EXPORT')}
              </Button>
              <Button
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-md flex-1 sm:flex-none"
                onClick={handleCreateTemplate}
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                {t('TEMPLATES.CREATE_TEMPLATE')}
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <FilterBar
              searchConfig={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: t('TEMPLATES.SEARCH_PLACEHOLDER'),
                className: 'flex-1',
              }}
              filters={[
                {
                  value: filterCategory,
                  onChange: setFilterCategory,
                  placeholder: t('TEMPLATES.FIELDS.CATEGORY'),
                  width: 'w-[200px]',
                  icon: Filter,
                  options: [
                    { value: 'all', label: t('TEMPLATES.FILTERS.ALL_CATEGORIES') },
                    { value: TemplateCategoryEnum.LAWSUIT, label: t('TEMPLATES.CATEGORIES.LAWSUIT') },
                    { value: TemplateCategoryEnum.CONTRACT, label: t('TEMPLATES.CATEGORIES.CONTRACT') },
                    { value: TemplateCategoryEnum.STATEMENT, label: t('TEMPLATES.CATEGORIES.STATEMENT') },
                    { value: TemplateCategoryEnum.LETTER, label: t('TEMPLATES.CATEGORIES.LETTER') },
                    {
                      value: TemplateCategoryEnum.POWER_OF_ATTORNEY,
                      label: t('TEMPLATES.CATEGORIES.POWER_OF_ATTORNEY'),
                    },
                  ],
                },
                {
                  value: sortBy,
                  onChange: setSortBy,
                  placeholder: t('TEMPLATES.FILTERS.SORT_BY'),
                  width: 'w-[180px]',
                  icon: ArrowUpDown,
                  options: [
                    { value: 'date', label: t('TEMPLATES.FILTERS.SORT_BY_DATE') },
                    { value: 'name', label: t('TEMPLATES.FILTERS.SORT_BY_NAME') },
                    { value: 'usage', label: t('TEMPLATES.FILTERS.SORT_BY_USAGE') },
                  ],
                },
              ]}
            />

            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
              className="hidden sm:flex"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view" className="rounded-l-lg">
                <Grid3X3 className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" className="rounded-r-lg">
                <List className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </header>

      <main className="py-4 sm:py-6 lg:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : pagination.total === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('TEMPLATES.EMPTY_STATE_TITLE')}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {t('TEMPLATES.EMPTY_STATE_MESSAGE')}
            </p>
            <Button
              onClick={handleCreateTemplate}
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('TEMPLATES.CREATE_FIRST_TEMPLATE')}
            </Button>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                  : 'flex flex-col gap-3'
              }
            >
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteClick}
                  onGenerate={handleGenerateDocument}
                  onPreview={handlePreviewTemplate}
                />
              ))}
            </div>

            <DataPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          </>
        )}
      </main>
    </div>
  );
}

export default TemplatesPage;
