import React, { useState, useEffect } from 'react';
import {
  Clock,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Upload,
  CheckCircle2,
  GitCompare,
  Trash2,
  User,
  ClipboardList,
  Edit,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocumentsStore } from '@/app/store/documents.store';
import { BackButton } from '@/shared/components/BackButton';
import { DataPagination } from '@/shared/components/DataPagination';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx';
import { Separator } from '@/shared/ui/separator.tsx';
import { formatFileSize } from '@/shared/utils';

export function DocumentVersionsView() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    selectedDocument: document,
    versions,
    loading,
    error,
    fetchDocumentById,
    fetchVersions,
  } = useDocumentsStore();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'upload' | 'edit'>('upload');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (id) {
      fetchDocumentById(id);
      fetchVersions(id);
    }
  }, [id, fetchDocumentById, fetchVersions]);

  const handleSuccess = () => {
    if (id) {
      fetchDocumentById(id);
      fetchVersions(id);
    }
  };

  const onBack = () => navigate(-1);
  const onCompare = () => navigate(`/documents/${id}/compare`);

  const handleUploadClick = () => {
    setDialogMode('upload');
    setIsUploadDialogOpen(true);
  };

  const handleEditClick = () => {
    setDialogMode('edit');
    setIsUploadDialogOpen(true);
  };

  // Add optional chaining to prevent crash if versions is undefined
  const currentVersion = versions?.find((v) => v.isCurrent);

  // Local pagination logic
  const limit = 10;
  const totalPages = versions ? Math.ceil(versions.length / limit) : 0;
  const paginatedVersions = versions
    ? versions.slice((currentPage - 1) * limit, currentPage * limit)
    : [];

  if (loading && !document) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-500">{error || t('DOCUMENTS.ERRORS.LOAD_FAILED')}</p>
      </div>
    );
  }

  return (
    <div>
      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        document={document}
        onSuccess={handleSuccess}
        mode={dialogMode}
      />
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Mobile header row */}
          <div className="md:hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <BackButton onClick={onBack} label={t('DOCUMENTS.BACK_TO_DOCUMENTS')} />

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white px-3 py-1.5">
                <div className="text-center">
                  <div className="text-base font-medium">
                    v{currentVersion?.versionNumber || document.versionsCount}
                  </div>
                  <div className="text-xs opacity-90">{t('DOCUMENTS.CURRENT')}</div>
                </div>
              </Card>
            </div>

            <div className="mb-3 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-sm rounded-xl"
                onClick={handleEditClick}
              >
                <Edit className="w-4 h-4 mr-2" strokeWidth={2} />
                {t('COMMON.ACTIONS.EDIT')}
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex-1 text-sm"
                onClick={handleUploadClick}
              >
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                {t('DOCUMENTS.UPLOAD_NEW_VERSION')}
              </Button>
            </div>
          </div>

          {/* Desktop header row */}
          <div className="hidden md:flex items-center justify-between gap-3 mb-4">
            <BackButton onClick={onBack} label={t('DOCUMENTS.BACK_TO_DOCUMENTS')} />

            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl text-base" onClick={handleEditClick}>
                <Edit className="w-4 h-4 mr-2" strokeWidth={2} />
                {t('COMMON.ACTIONS.EDIT')}
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-base"
                onClick={handleUploadClick}
              >
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                {t('DOCUMENTS.UPLOAD_NEW_VERSION')}
              </Button>
            </div>
          </div>

          {/* Mobile document info */}
          <div className="md:hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base tracking-tight mb-1">{document.name}</h1>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div className="truncate">{document.caseName || '-'}</div>
                  <div>{document.clientName || '-'}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3" strokeWidth={2} />
                  {document.uploadedByName}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-600" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl tracking-tight mb-1">{document.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{document.caseName || '-'}</span>
                    <span>•</span>
                    <span>{document.clientName || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3" strokeWidth={2} />
                    {document.uploadedByName}
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 text-white px-6 py-4">
              <div className="text-center">
                <div className="text-3xl tracking-tight mb-1">
                  v{currentVersion?.versionNumber || document.versionsCount}
                </div>
                <div className="text-sm opacity-90">{t('DOCUMENTS.CURRENT_VERSION')}</div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {document.notes && (
            <Card className="bg-yellow-500/10 border-yellow-500/20 mb-4 sm:mb-6 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <ClipboardList
                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700 dark:text-yellow-400"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base tracking-tight text-yellow-800 dark:text-yellow-300 mb-2">
                    {t('UPLOAD.NOTES')}
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 whitespace-pre-wrap">
                    {document.notes}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="bg-blue-500/10 border-blue-500/20 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base tracking-tight text-blue-700 dark:text-blue-400 mb-1">
                  {t('DOCUMENTS.VERSION_HISTORY')}
                </h3>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">
                  {t('DOCUMENTS.VERSIONS_CREATED')} {versions.length}{' '}
                  {versions.length === 1
                    ? t('CASES.DOC_VERSION.SINGULAR')
                    : versions.length < 5
                      ? t('CASES.DOC_VERSION.PLURAL')
                      : t('CASES.DOC_VERSION.PLURAL')}
                  .<span className="hidden sm:inline"> {t('DOCUMENTS.VIEW_DETAILS')}</span>
                </p>
              </div>
            </div>
          </Card>
          <div className="space-y-3 sm:space-y-4">
            {paginatedVersions.map((version, index) => (
              <Card
                key={version.id}
                className={`hover:shadow-md transition-all ${
                  version.isCurrent ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="md:hidden">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium ${
                          version.isCurrent
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        v{version.versionNumber}
                      </div>
                      {index < paginatedVersions.length - 1 && (
                        <div className="w-px h-12 bg-border mt-3"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base tracking-tight mb-1">
                            {t('DOCUMENTS.VERSION')} {version.versionNumber}
                          </h3>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {version.isCurrent && (
                              <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0 text-xs">
                                {t('DOCUMENTS.CURRENT')}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-xl hover:bg-muted h-8 w-8"
                            >
                              <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => navigate('/documents/1/compare')}>
                              <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                              {t('DOCUMENTS.ACTIONS.VIEW_DETAILS')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                              {t('DOCUMENTS.ACTIONS.DOWNLOAD')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/documents/1/compare')}>
                              <GitCompare className="w-4 h-4 mr-2" strokeWidth={2} />
                              {t('DOCUMENTS.COMPARE_WITH_CURRENT')}
                            </DropdownMenuItem>
                            {!version.isCurrent && (
                              <>
                                <DropdownMenuItem>
                                  <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                  {t('DOCUMENTS.RESTORE_VERSION')}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                  {t('DOCUMENTS.DELETE_VERSION')}
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" strokeWidth={2} />
                          {new Date(version.createdAt).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3" strokeWidth={2} />
                          {version.originalFileName}
                        </div>
                        <div>{formatFileSize(version.fileSize)}</div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-border hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-600 text-xs h-7"
                          onClick={() => navigate('/documents/1/compare')}
                        >
                          <Eye className="w-3 h-3 mr-1" strokeWidth={2} />
                          {t('DOCUMENTS.ACTIONS.VIEW')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-border hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-600 text-xs h-7"
                        >
                          <Download className="w-3 h-3 mr-1" strokeWidth={2} />
                          {t('DOCUMENTS.ACTIONS.DOWNLOAD')}
                        </Button>
                        {!version.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-border hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-600 text-xs h-7"
                            onClick={onCompare}
                          >
                            <GitCompare className="w-3 h-3 mr-1" strokeWidth={2} />
                            {t('DOCUMENTS.ACTIONS.COMPARE')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                        version.isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      v{version.versionNumber}
                    </div>
                    {index < paginatedVersions.length - 1 && (
                      <div className="w-px h-16 bg-border mt-4"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg tracking-tight">
                            {t('DOCUMENTS.VERSION')} {version.versionNumber}
                          </h3>
                          {version.isCurrent && (
                            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0">
                              {t('DOCUMENTS.CURRENT')}
                            </Badge>
                          )}

                          <small>
                            <i>{version.originalFileName}</i>
                          </small>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                            {new Date(version.createdAt).toLocaleString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" strokeWidth={2} />
                            {version.authorName}
                          </span>
                          <span>•</span>
                          <span>{formatFileSize(version.fileSize)}</span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                            <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => navigate('/documents/1/compare')}>
                            <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                            {t('DOCUMENTS.ACTIONS.VIEW_DETAILS')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                            {t('DOCUMENTS.ACTIONS.DOWNLOAD')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/documents/1/compare')}>
                            <GitCompare className="w-4 h-4 mr-2" strokeWidth={2} />
                            {t('DOCUMENTS.COMPARE_WITH_CURRENT')}
                          </DropdownMenuItem>
                          {!version.isCurrent && (
                            <>
                              <DropdownMenuItem>
                                <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                {t('DOCUMENTS.RESTORE_VERSION')}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                {t('DOCUMENTS.DELETE_VERSION')}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Separator className="mb-4 bg-border" />

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-border hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-600"
                        onClick={() => navigate('/documents/1/compare')}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                        {t('DOCUMENTS.ACTIONS.VIEW')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-border hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-600"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                        {t('DOCUMENTS.ACTIONS.DOWNLOAD')}
                      </Button>
                      {!version.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-border hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-600"
                          onClick={onCompare}
                        >
                          <GitCompare className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                          {t('DOCUMENTS.ACTIONS.COMPARE')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        </div>
      </main>
    </div>
  );
}
