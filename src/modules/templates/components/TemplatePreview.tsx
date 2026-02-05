/**
 * @file TemplatePreview.tsx
 * @description Dialog component for previewing a rendered template
 */

import { useState, useEffect, useMemo } from 'react';
import { Eye, FileText, Copy, CheckCircle2 } from 'lucide-react';
import type { TemplatePreviewProps } from '@/app/types/templates/templates.types';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Badge } from '@/shared/ui/badge';

// Sample data for preview
const sampleData: Record<string, string> = {
  'client.fullName': 'Ivanov Ivan Ivanovich',
  'client.firstName': 'Ivan',
  'client.lastName': 'Ivanov',
  'client.middleName': 'Ivanovich',
  'client.companyName': 'LLC "Example Company"',
  'client.email': 'client@example.com',
  'client.phone': '+7 (999) 123-45-67',
  'client.address': 'Moscow, Tverskaya st., 1, apt. 1',
  'client.inn': '1234567890',
  'client.kpp': '123456789',
  'client.type': 'Individual',
  'case.title': 'Labor Dispute Case',
  'case.number': 'A-2026-001234',
  'case.category': 'Labor',
  'case.status': 'In Progress',
  'case.description': 'Dispute regarding wrongful termination',
  'case.deadline': '15.03.2026',
  'case.courtDate': '01.04.2026',
  'case.fee': '50 000',
  'user.fullName': 'Petrov Petr Petrovich',
  'user.firstName': 'Petr',
  'user.lastName': 'Petrov',
  'user.email': 'lawyer@lexflow.com',
  'user.phone': '+7 (999) 987-65-43',
  'user.position': 'Senior Lawyer',
  'user.company': 'LexFlow Legal Services',
  'date.today': new Date().toLocaleDateString('ru-RU'),
  'date.formatted': new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
  'document.number': 'DOC-2026-001',
  'custom.text': '[Custom Text]',
};

export function TemplatePreview({
  open,
  onOpenChange,
  template,
  variables = {},
}: TemplatePreviewProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveTab('preview');
      setCopied(false);
    }
  }, [open]);

  // Merge sample data with provided variables
  const mergedVariables = useMemo(() => {
    return { ...sampleData, ...variables };
  }, [variables]);

  // Render template with variables
  const renderedContent = useMemo(() => {
    if (!template?.content) return '';

    let content = template.content;
    const variablePattern = /\{\{([\w.]+)\}\}/g;

    content = content.replace(variablePattern, (match, key) => {
      return mergedVariables[key] || match;
    });

    return content;
  }, [template?.content, mergedVariables]);

  // Extract variables from template
  const extractedVariables = useMemo(() => {
    if (!template?.content) return [];
    const matches = template.content.match(/\{\{[\w.]+\}\}/g) || [];
    return [...new Set(matches)].map((v) => v.replace(/\{\{|\}\}/g, ''));
  }, [template?.content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="truncate">{t('TEMPLATES.PREVIEW_TITLE')}</span>
              <p className="text-sm text-muted-foreground font-normal truncate mt-0.5">
                {template.name}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="h-auto p-1 bg-muted/50">
              <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-background">
                <Eye className="w-4 h-4" />
                {t('TEMPLATES.PREVIEW_TAB')}
              </TabsTrigger>
              <TabsTrigger value="source" className="gap-2 data-[state=active]:bg-background">
                <FileText className="w-4 h-4" />
                {t('TEMPLATES.SOURCE_TAB')}
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="rounded-lg gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {t('COMMON.COPIED')}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {t('COMMON.COPY')}
                </>
              )}
            </Button>
          </div>

          <TabsContent value="preview" className="mt-0">
            <ScrollArea className="h-[400px] rounded-xl border border-border bg-muted/30 p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {renderedContent}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="source" className="mt-0">
            <ScrollArea className="h-[400px] rounded-xl border border-border bg-muted/30 p-6">
              <pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground">
                {template.content}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {extractedVariables.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <h4 className="text-sm font-medium mb-2">
              {t('TEMPLATES.VARIABLES_IN_TEMPLATE')} ({extractedVariables.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {extractedVariables.map((variable) => (
                <Badge
                  key={variable}
                  variant="secondary"
                  className="font-mono text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            {t('COMMON.ACTIONS.CLOSE')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
