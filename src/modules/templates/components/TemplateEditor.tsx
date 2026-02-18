/**
 * @file TemplateEditor.tsx
 * @description Dialog component for creating and editing document templates
 */

import { useState, useEffect, useRef } from 'react';
import { FileText, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { useTemplatesStore } from '@/app/store/templates.store';
import {
  TemplateCategoryEnum,
  type TemplateEditorProps,
} from '@/app/types/templates/templates.types';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { VariableSelector } from './VariableSelector';

export function TemplateEditor({
  open,
  onOpenChange,
  template,
  onSuccess,
}: TemplateEditorProps) {
  const { t } = useI18n();
  const { createTemplate, updateTemplate, loading } = useTemplatesStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: TemplateCategoryEnum.CONTRACT,
    content: '',
  });
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!template;

  useEffect(() => {
    if (open) {
      setError(null);
      if (template) {
        setFormData({
          name: template.name,
          description: template.description || '',
          category: template.category,
          content: template.content,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          category: TemplateCategoryEnum.CONTRACT,
          content: '',
        });
      }
    }
  }, [open, template]);

  const handleInsertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      formData.content.substring(0, start) + variable + formData.content.substring(end);

    setFormData({ ...formData, content: newContent });

    setTimeout(() => {
      textarea.focus();
      const newPos = start + variable.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError(t('TEMPLATES.ERRORS.NAME_REQUIRED'));
      return;
    }

    if (!formData.content.trim()) {
      setError(t('TEMPLATES.ERRORS.CONTENT_REQUIRED'));
      return;
    }

    try {
      if (isEditMode && template) {
        await updateTemplate(template.id, {
          name: formData.name,
          description: formData.description || undefined,
          category: formData.category,
          content: formData.content,
        });
      } else {
        await createTemplate({
          name: formData.name,
          description: formData.description || undefined,
          category: formData.category,
          content: formData.content,
        });
      }
      onSuccess?.();
      onOpenChange(false);
    } catch {
      setError(t('TEMPLATES.ERRORS.SAVE_FAILED'));
    }
  };

  const getCategoryLabel = (category: TemplateCategoryEnum) => {
    const labels: Record<TemplateCategoryEnum, string> = {
      [TemplateCategoryEnum.LAWSUIT]: t('TEMPLATES.CATEGORIES.LAWSUIT'),
      [TemplateCategoryEnum.CONTRACT]: t('TEMPLATES.CATEGORIES.CONTRACT'),
      [TemplateCategoryEnum.STATEMENT]: t('TEMPLATES.CATEGORIES.STATEMENT'),
      [TemplateCategoryEnum.LETTER]: t('TEMPLATES.CATEGORIES.LETTER'),
      [TemplateCategoryEnum.POWER_OF_ATTORNEY]: t('TEMPLATES.CATEGORIES.POWER_OF_ATTORNEY'),
    };
    return labels[category] || category;
  };

  const extractedVariables = formData.content.match(/\{\{[\w.]+\}\}/g) || [];
  const uniqueVariables = [...new Set(extractedVariables)];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            </div>
            {isEditMode ? t('TEMPLATES.EDIT_TEMPLATE') : t('TEMPLATES.CREATE_TEMPLATE')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-foreground">
                {t('TEMPLATES.FIELDS.NAME')} *
              </Label>
              <Input
                id="name"
                placeholder={t('TEMPLATES.PLACEHOLDERS.NAME')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-xl border-input focus-visible:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-foreground">
                {t('TEMPLATES.FIELDS.CATEGORY')} *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as TemplateCategoryEnum })
                }
                disabled={loading}
              >
                <SelectTrigger className="h-12 rounded-xl border-input">
                  <SelectValue placeholder={t('TEMPLATES.PLACEHOLDERS.CATEGORY')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TemplateCategoryEnum).map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryLabel(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-foreground">
              {t('TEMPLATES.FIELDS.DESCRIPTION')}
            </Label>
            <Input
              id="description"
              placeholder={t('TEMPLATES.PLACEHOLDERS.DESCRIPTION')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-12 rounded-xl border-input focus-visible:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-sm text-foreground">
                {t('TEMPLATES.FIELDS.CONTENT')} *
              </Label>
              <VariableSelector onSelect={handleInsertVariable} />
            </div>
            <Textarea
              ref={textareaRef}
              id="content"
              placeholder={t('TEMPLATES.PLACEHOLDERS.CONTENT')}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[300px] rounded-xl border-input focus-visible:ring-blue-500 resize-none font-mono text-sm"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {t('TEMPLATES.CONTENT_HINT')}
            </p>
          </div>

          {uniqueVariables.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-foreground">
                {t('TEMPLATES.DETECTED_VARIABLES')} ({uniqueVariables.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {uniqueVariables.map((variable) => (
                  <code
                    key={variable}
                    className="text-xs bg-muted px-2 py-1 rounded-lg font-mono text-blue-600 dark:text-blue-400"
                  >
                    {variable}
                  </code>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-input hover:bg-muted"
              disabled={loading}
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.content.trim()}
              className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('COMMON.LOADING')}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                  ) : (
                    <Save className="w-4 h-4 mr-2" strokeWidth={2} />
                  )}
                  {isEditMode ? t('COMMON.ACTIONS.SAVE') : t('COMMON.ACTIONS.CREATE')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
