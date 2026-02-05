/**
 * @file GenerateDocumentDialog.tsx
 * @description Dialog component for generating a document from a template
 */

import { useState, useEffect, useMemo } from 'react';
import {
  FileOutput,
  AlertCircle,
  User,
  Briefcase,
  Eye,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { casesService } from '@/app/services/cases/cases.service';
import { clientsService } from '@/app/services/clients/clients.service';
import { useTemplatesStore } from '@/app/store/templates.store';
import type { CaseInterface } from '@/app/types/cases/cases.interfaces';
import type { ClientInterface } from '@/app/types/clients/clients.interfaces';
import type { GenerateDocumentDialogProps } from '@/app/types/templates/templates.types';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function GenerateDocumentDialog({
  open,
  onOpenChange,
  template,
  onSuccess,
}: GenerateDocumentDialogProps) {
  const { t } = useI18n();
  const { generateDocument, generating, downloadGeneratedDocument } = useTemplatesStore();

  const [activeTab, setActiveTab] = useState('data');
  const [documentName, setDocumentName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [generatedDoc, setGeneratedDoc] = useState<{ id: string; name: string } | null>(null);

  // Data loading states
  const [clients, setClients] = useState<ClientInterface[]>([]);
  const [cases, setCases] = useState<CaseInterface[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingCases, setLoadingCases] = useState(false);

  // Extract variables from template
  const templateVariables = useMemo(() => {
    if (!template?.content) return [];
    const matches = template.content.match(/\{\{[\w.]+\}\}/g) || [];
    return [...new Set(matches)].map((v) => v.replace(/\{\{|\}\}/g, ''));
  }, [template?.content]);

  // Categorize variables
  const categorizedVariables = useMemo(() => {
    const categories = {
      client: [] as string[],
      case: [] as string[],
      user: [] as string[],
      custom: [] as string[],
    };

    templateVariables.forEach((v) => {
      if (v.startsWith('client.')) categories.client.push(v);
      else if (v.startsWith('case.')) categories.case.push(v);
      else if (v.startsWith('user.')) categories.user.push(v);
      else categories.custom.push(v);
    });

    return categories;
  }, [templateVariables]);

  useEffect(() => {
    if (open) {
      setError(null);
      setGeneratedDoc(null);
      setActiveTab('data');
      setDocumentName(template?.name ? `${template.name} - ${new Date().toLocaleDateString()}` : '');
      setSelectedClientId('');
      setSelectedCaseId('');
      setCustomVariables({});
      fetchClients();
    }
  }, [open, template]);

  useEffect(() => {
    if (selectedClientId) {
      fetchCases(selectedClientId);
    } else {
      setCases([]);
      setSelectedCaseId('');
    }
  }, [selectedClientId]);

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const response = await clientsService.list({ limit: 100 });
      setClients(response.data);
    } catch {
      // Silently handle
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchCases = async (clientId: string) => {
    setLoadingCases(true);
    try {
      const response = await casesService.list({ clientId, limit: 100 });
      setCases(response.cases);
    } catch {
      // Silently handle
    } finally {
      setLoadingCases(false);
    }
  };

  // Build variables object for preview
  const previewVariables = useMemo(() => {
    const vars: Record<string, string> = { ...customVariables };

    // Add client data if selected
    const selectedClient = clients.find((c) => c.id === selectedClientId);
    if (selectedClient) {
      vars['client.fullName'] = [
        selectedClient.lastName,
        selectedClient.firstName,
        selectedClient.middleName,
      ]
        .filter(Boolean)
        .join(' ') || selectedClient.companyName || '';
      vars['client.firstName'] = selectedClient.firstName || '';
      vars['client.lastName'] = selectedClient.lastName || '';
      vars['client.middleName'] = selectedClient.middleName || '';
      vars['client.companyName'] = selectedClient.companyName || '';
      vars['client.email'] = selectedClient.email || '';
      vars['client.phone'] = selectedClient.phone || '';
      vars['client.address'] = selectedClient.address || '';
      vars['client.inn'] = selectedClient.inn || '';
      vars['client.kpp'] = selectedClient.kpp || '';
      vars['client.type'] = selectedClient.type || '';
    }

    // Add case data if selected
    const selectedCase = cases.find((c) => c.id === selectedCaseId);
    if (selectedCase) {
      vars['case.title'] = selectedCase.title || '';
      vars['case.category'] = selectedCase.category || '';
      vars['case.status'] = selectedCase.status || '';
      vars['case.description'] = selectedCase.description || '';
      vars['case.deadline'] = selectedCase.deadline
        ? new Date(selectedCase.deadline).toLocaleDateString()
        : '';
      vars['case.courtDate'] = selectedCase.courtDate
        ? new Date(selectedCase.courtDate).toLocaleDateString()
        : '';
      vars['case.fee'] = selectedCase.fee?.toString() || '';
    }

    // Add date variables
    vars['date.today'] = new Date().toLocaleDateString('ru-RU');
    vars['date.formatted'] = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return vars;
  }, [clients, cases, selectedClientId, selectedCaseId, customVariables]);

  // Render preview
  const renderedPreview = useMemo(() => {
    if (!template?.content) return '';

    let content = template.content;
    const variablePattern = /\{\{([\w.]+)\}\}/g;

    content = content.replace(variablePattern, (_match, key) => {
      return previewVariables[key] || `[${key}]`;
    });

    return content;
  }, [template?.content, previewVariables]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!documentName.trim()) {
      setError(t('TEMPLATES.ERRORS.DOCUMENT_NAME_REQUIRED'));
      return;
    }

    if (!template) return;

    try {
      const doc = await generateDocument({
        templateId: template.id,
        name: documentName,
        variables: previewVariables,
        clientId: selectedClientId || undefined,
        caseId: selectedCaseId || undefined,
      });
      setGeneratedDoc({ id: doc.id, name: doc.name });
      onSuccess?.(doc);
    } catch {
      setError(t('TEMPLATES.ERRORS.GENERATE_FAILED'));
    }
  };

  const handleDownload = async () => {
    if (!generatedDoc) return;
    try {
      await downloadGeneratedDocument(generatedDoc.id, `${generatedDoc.name}.docx`);
    } catch {
      setError(t('TEMPLATES.ERRORS.DOWNLOAD_FAILED'));
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <FileOutput className="w-6 h-6 text-green-600 dark:text-green-400" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="truncate">{t('TEMPLATES.GENERATE_DOCUMENT')}</span>
              <p className="text-sm text-muted-foreground font-normal truncate mt-0.5">
                {template.name}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {generatedDoc ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('TEMPLATES.DOCUMENT_GENERATED')}</h3>
            <p className="text-muted-foreground mb-6">{generatedDoc.name}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                {t('COMMON.ACTIONS.CLOSE')}
              </Button>
              <Button
                onClick={handleDownload}
                className="rounded-xl bg-green-500 hover:bg-green-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('COMMON.ACTIONS.DOWNLOAD')}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full h-auto p-1 bg-muted/50 mb-4">
                <TabsTrigger value="data" className="flex-1 gap-2 data-[state=active]:bg-background">
                  <User className="w-4 h-4" />
                  {t('TEMPLATES.DATA_TAB')}
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1 gap-2 data-[state=active]:bg-background">
                  <Eye className="w-4 h-4" />
                  {t('TEMPLATES.PREVIEW_TAB')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documentName" className="text-sm text-foreground">
                    {t('TEMPLATES.FIELDS.DOCUMENT_NAME')} *
                  </Label>
                  <Input
                    id="documentName"
                    placeholder={t('TEMPLATES.PLACEHOLDERS.DOCUMENT_NAME')}
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="h-12 rounded-xl border-input focus-visible:ring-green-500"
                    required
                    disabled={generating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {categorizedVariables.client.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-foreground flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t('TEMPLATES.SELECT_CLIENT')}
                      </Label>
                      <Select
                        value={selectedClientId}
                        onValueChange={setSelectedClientId}
                        disabled={generating || loadingClients}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-input">
                          <SelectValue
                            placeholder={
                              loadingClients
                                ? t('COMMON.LOADING')
                                : t('TEMPLATES.PLACEHOLDERS.SELECT_CLIENT')
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.lastName && client.firstName
                                ? `${client.lastName} ${client.firstName}`
                                : client.companyName || client.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {categorizedVariables.case.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-foreground flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {t('TEMPLATES.SELECT_CASE')}
                      </Label>
                      <Select
                        value={selectedCaseId}
                        onValueChange={setSelectedCaseId}
                        disabled={generating || loadingCases || !selectedClientId}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-input">
                          <SelectValue
                            placeholder={
                              loadingCases
                                ? t('COMMON.LOADING')
                                : !selectedClientId
                                ? t('TEMPLATES.SELECT_CLIENT_FIRST')
                                : t('TEMPLATES.PLACEHOLDERS.SELECT_CASE')
                            }
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
                  )}
                </div>

                {categorizedVariables.custom.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <Label className="text-sm text-foreground">
                      {t('TEMPLATES.CUSTOM_VARIABLES')}
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {categorizedVariables.custom.map((variable) => (
                        <div key={variable} className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground font-mono">
                            {`{{${variable}}}`}
                          </Label>
                          <Input
                            placeholder={variable}
                            value={customVariables[variable] || ''}
                            onChange={(e) =>
                              setCustomVariables({
                                ...customVariables,
                                [variable]: e.target.value,
                              })
                            }
                            className="h-10 rounded-lg text-sm"
                            disabled={generating}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <ScrollArea className="h-[350px] rounded-xl border border-border bg-muted/30 p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {renderedPreview}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 rounded-xl border-input hover:bg-muted"
                disabled={generating}
              >
                {t('COMMON.ACTIONS.CANCEL')}
              </Button>
              <Button
                type="submit"
                disabled={generating || !documentName.trim()}
                className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('TEMPLATES.GENERATING')}
                  </>
                ) : (
                  <>
                    <FileOutput className="w-4 h-4 mr-2" strokeWidth={2} />
                    {t('TEMPLATES.GENERATE')}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
