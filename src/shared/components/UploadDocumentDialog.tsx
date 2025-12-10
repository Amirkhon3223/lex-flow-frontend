/**
 * @file UploadDocumentDialog.tsx
 * @description Диалог для загрузки документов с drag-and-drop
 */

import { useState } from 'react';
import { Upload, FileText, Briefcase, Tag, X, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (documentData: any) => void;
}

export function UploadDocumentDialog({ open, onOpenChange, onSubmit }: UploadDocumentDialogProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    case: '',
    type: '',
    status: 'draft',
    notes: '',
  });

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
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit?.({ ...formData, file: selectedFile });
      onOpenChange(false);
      setSelectedFile(null);
      setFormData({
        name: '',
        case: '',
        type: '',
        status: 'draft',
        notes: '',
      });
    }
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
            {t('UPLOAD.TITLE')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : selectedFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-border/50 bg-muted/50 hover:bg-muted'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
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

          {selectedFile && (
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case" className="text-sm text-foreground">
                    {t('CASES.FIELDS.CASE')} *
                  </Label>
                  <Select
                    value={formData.case}
                    onValueChange={(value) => setFormData({ ...formData, case: value })}
                    required
                  >
                    <SelectTrigger className="h-12 rounded-xl border-input">
                      <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                      <SelectValue placeholder={t('UPLOAD.SELECT_CASE')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="case1">Трудовой спор - увольнение</SelectItem>
                      <SelectItem value="case2">Договор аренды помещения</SelectItem>
                      <SelectItem value="case3">Наследственное дело</SelectItem>
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
                <Label htmlFor="status" className="text-sm text-foreground">
                  {t('DOCUMENTS.FIELDS.STATUS')}
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t('DOCUMENTS.STATUS.DRAFT')}</SelectItem>
                    <SelectItem value="review">{t('DOCUMENTS.STATUS.REVIEW')}</SelectItem>
                    <SelectItem value="final">{t('DOCUMENTS.STATUS.FINAL')}</SelectItem>
                  </SelectContent>
                </Select>
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
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile}
              className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
              {t('COMMON.ACTIONS.UPLOAD')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
