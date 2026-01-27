import { useState, useEffect } from 'react';
import { Upload, FileText, Briefcase, Tag, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { casesService } from '@/app/services/cases/cases.service';
import { documentsService } from '@/app/services/documents/documents.service';
import { useDocumentsStore } from '@/app/store/documents.store';
import type { CaseInterface } from '@/app/types/cases/cases.interfaces';
import { DocumentCategoryEnum, DocumentStatusEnum } from '@/app/types/documents/documents.enums';
import type { DocumentInterface } from '@/app/types/documents/documents.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { isFileFormatSupported, SUPPORTED_FILE_EXTENSIONS } from '@/shared/utils/fileValidation';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  document?: DocumentInterface | null;
  mode?: 'upload' | 'edit';
  defaultCaseId?: string;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onSuccess,
  document,
  mode = 'upload',
  defaultCaseId,
}: UploadDocumentDialogProps) {
  const { t } = useI18n();
  const { createDocument, updateDocument, createVersion } = useDocumentsStore();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cases, setCases] = useState<CaseInterface[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    caseId: '',
    type: '',
    category: DocumentCategoryEnum.LEGAL,
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchCases();
      setError(null);
      if (document) {
        setFormData({
          name: document.name,
          caseId: document.caseId || '',
          type: document.type,
          category: document.category as DocumentCategoryEnum,
          notes: document.notes || '',
        });
      } else if (defaultCaseId) {
        setFormData((prev) => ({
          ...prev,
          caseId: defaultCaseId,
        }));
      }
    } else {
      resetForm();
    }
  }, [open, document, defaultCaseId]);

  const fetchCases = async () => {
    setLoadingCases(true);
    try {
      const response = await casesService.list({ limit: 100 });
      setCases(response.cases);
    } catch {
      // Silently handle - cases list will be empty
    } finally {
      setLoadingCases(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
    e.target.value = '';
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (!isFileFormatSupported(file)) {
      setError(t('DOCUMENTS.ERRORS.UNSUPPORTED_FILE_FORMAT'));
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    if (!document && !formData.name) {
      setFormData({ ...formData, name: file.name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'upload' && !selectedFile) return;
    if (!document && (!formData.caseId || !formData.type) && mode !== 'edit') return;

    setError(null);
    setUploading(true);

    try {
      if (mode === 'edit' && document) {
        await updateDocument(document.id, {
          name: formData.name,
          notes: formData.notes,
        });
      } else if (mode === 'upload' && selectedFile) {
        const uploadResponse = await documentsService.upload(selectedFile);
        if (document) {
          await createVersion(document.id, {
            originalFileName: uploadResponse.originalFileName,
            fileUrl: uploadResponse.fileUrl,
            fileSize: uploadResponse.fileSize,
            mimeType: uploadResponse.mimeType,
            notes: formData.notes || undefined,
          });
          if (formData.name !== document.name || formData.notes !== (document.notes || '')) {
            await updateDocument(document.id, {
              name: formData.name,
              notes: formData.notes,
            });
          }
        } else {
          const selectedCase = cases.find((c) => c.id === formData.caseId);
          if (!selectedCase) {
            setError(t('DOCUMENTS.ERRORS.UPLOAD_FAILED'));
            setUploading(false);
            return;
          }
          await createDocument({
            name: formData.name,
            originalFileName: uploadResponse.originalFileName,
            caseId: formData.caseId,
            clientId: selectedCase.clientId,
            type: formData.type,
            category: formData.category,
            status: DocumentStatusEnum.DRAFT,
            fileUrl: uploadResponse.fileUrl,
            fileSize: uploadResponse.fileSize,
            mimeType: uploadResponse.mimeType,
            notes: formData.notes || undefined,
          });
        }
      }

      onSuccess?.();
      onOpenChange(false);
    } catch {
      setError(t('DOCUMENTS.ERRORS.UPLOAD_FAILED'));
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    if (mode === 'edit' && document) {
      setFormData({
        name: document.name,
        caseId: document.caseId || '',
        type: document.type,
        category: document.category as DocumentCategoryEnum,
        notes: document.notes || '',
      });
    } else {
      setFormData({
        name: '',
        caseId: '',
        type: '',
        category: DocumentCategoryEnum.LEGAL,
        notes: '',
      });
    }
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-orange-600 dark:text-orange-400" strokeWidth={2} />
            </div>
            {mode === 'edit' ? t('UPLOAD.EDIT_TITLE') : t('UPLOAD.TITLE')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {mode === 'upload' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : selectedFile
                  ? 'border-green-300 bg-card'
                  : 'border-border/50 bg-muted/50 hover:bg-muted'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                accept={SUPPORTED_FILE_EXTENSIONS.join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />

              {!selectedFile ? (
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-500" strokeWidth={2} />
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-foreground mb-1">
                        {t('UPLOAD.DRAG_DROP')}{' '}
                        <span className="text-blue-500 hover:text-blue-600">
                          {t('UPLOAD.SELECT_FILE')}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">{t('UPLOAD.SUPPORTED_FORMATS')}</p>
                    </div>
                  </div>
                </label>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-green-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                      <h4 className="tracking-tight truncate">{selectedFile.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    className="rounded-xl hover:bg-red-50 flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-red-500" strokeWidth={2} />
                  </Button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {(selectedFile || mode === 'edit') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-foreground">
                  {t('UPLOAD.DOCUMENT_NAME')} *
                </Label>
                <Input
                  id="name"
                  placeholder={t('UPLOAD.DOCUMENT_NAME_PLACEHOLDER')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 rounded-xl border-input focus-visible:ring-orange-500"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case" className="text-sm text-foreground">
                    {t('CASES.FIELDS.CASE')} *
                  </Label>
                  <Select
                    value={formData.caseId}
                    onValueChange={(value) => setFormData({ ...formData, caseId: value })}
                    required
                    disabled={uploading || loadingCases || (!!document && mode === 'upload') || mode === 'edit'}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-input">
                      <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                      <SelectValue
                        placeholder={loadingCases ? t('COMMON.LOADING') : t('UPLOAD.SELECT_CASE')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map((caseItem) => (
                        <SelectItem key={caseItem.id} value={caseItem.id}>
                          {caseItem.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm text-foreground">
                    {t('UPLOAD.DOCUMENT_TYPE')} *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                    disabled={uploading || (!!document && mode === 'upload') || mode === 'edit'}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-input">
                      <Tag className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                      <SelectValue placeholder={t('DOCUMENTS.FIELDS.TYPE')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lawsuit">{t('UPLOAD.DOCUMENT_TYPES.LAWSUIT')}</SelectItem>
                      <SelectItem value="contract">
                        {t('UPLOAD.DOCUMENT_TYPES.CONTRACT')}
                      </SelectItem>
                      <SelectItem value="order">{t('UPLOAD.DOCUMENT_TYPES.ORDER')}</SelectItem>
                      <SelectItem value="power">{t('UPLOAD.DOCUMENT_TYPES.POWER')}</SelectItem>
                      <SelectItem value="response">
                        {t('UPLOAD.DOCUMENT_TYPES.RESPONSE')}
                      </SelectItem>
                      <SelectItem value="other">{t('UPLOAD.DOCUMENT_TYPES.OTHER')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm text-foreground">
                  {t('UPLOAD.NOTES')}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={t('UPLOAD.NOTES_PLACEHOLDER')}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[100px] rounded-xl border-input focus-visible:ring-orange-500 resize-none"
                  disabled={uploading}
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-input hover:bg-muted"
              disabled={uploading}
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button
              type="submit"
              disabled={
                uploading ||
                (mode === 'upload' && !selectedFile) ||
                (mode === 'upload' && !document && (!formData.caseId || !formData.type)) ||
                !formData.name
              }
              className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'edit'
                    ? t('COMMON.SAVING')
                    : t('COMMON.UPLOADING')}
                </>
              ) : (
                <>
                  {mode === 'edit' ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                  )}
                  {mode === 'edit'
                    ? t('COMMON.ACTIONS.SAVE')
                    : t('COMMON.ACTIONS.UPLOAD')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}