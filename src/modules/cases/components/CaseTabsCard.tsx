import { useEffect, useState, useCallback } from "react";
import { Download, Eye, FileText, History, Save, Check, Clock } from 'lucide-react';
import { useCasesStore } from "@/app/store/cases.store.ts";
import { DocumentStatusEnum } from '@/app/types/cases/cases.enums';
import type { CaseDocumentInterface, TimelineEventInterface } from '@/app/types/cases/cases.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';
import { getDocumentStatusColor } from '@/shared/utils/styleHelpers';

interface CaseTabsCardProps {
  caseId: string;
  documents: CaseDocumentInterface[];
  timeline: TimelineEventInterface[];
  onDocumentClick: (docId: string) => void;
  onDownloadDocument: (docName: string) => void;
}

export function CaseTabsCard({ caseId, documents, timeline, onDocumentClick, onDownloadDocument }: CaseTabsCardProps) {
  const { t } = useI18n();
  const { selectedCase, updateCase } = useCasesStore();
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (selectedCase?.notes) {
      setNotes(selectedCase.notes);
    }
  }, [selectedCase]);

  // Auto-save with debounce
  useEffect(() => {
    if (notes === selectedCase?.notes) return; // Don't save if unchanged

    const timer = setTimeout(() => {
      saveNotes();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [notes]);

  const saveNotes = useCallback(async () => {
    if (notes === selectedCase?.notes) return; // Skip if no changes

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      await updateCase(caseId, { notes });

      setLastSaved(new Date());
      setSaveStatus('saved');

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to save notes:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [notes, selectedCase?.notes, caseId, updateCase]);

  const formatLastSaved = () => {
    if (!lastSaved) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}${t('CASES.NOTES.SECONDS_AGO')}`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}${t('CASES.NOTES.MINUTES_AGO')}`;

    return lastSaved.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <Tabs defaultValue="documents" className="w-full">
        <div className="border-b border-border py-4">
          <TabsList className="bg-muted rounded-xl p-1 w-full sm:w-auto">
            <TabsTrigger
              value="documents"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              {t('CASES.TABS.DOCUMENTS')}
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              {t('CASES.TABS.TIMELINE')}
            </TabsTrigger>
            <TabsTrigger
              value="description"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              {t('CASES.TABS.DESCRIPTION')}
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              {t('CASES.TABS.NOTES')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="documents" className="space-y-2 sm:space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onDocumentClick(doc.id)}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <h4 className="tracking-tight truncate text-sm sm:text-base">{doc.name}</h4>
                  <Badge
                    className={`${getDocumentStatusColor(doc.status)} text-xs w-fit`}
                  >
                    {doc.status === DocumentStatusEnum.FINAL
                      ? t('DOCUMENTS.STATUS.FINAL')
                      : doc.status === DocumentStatusEnum.REVIEW
                        ? t('DOCUMENTS.STATUS.REVIEW')
                        : t('DOCUMENTS.STATUS.DRAFT')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <span>{doc.size}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{doc.date}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <History className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                    {doc.versions} {doc.versions === 1 ? t('CASES.DOC_VERSION.SINGULAR') : t('CASES.DOC_VERSION.PLURAL')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => onDocumentClick(doc.id)}
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => onDownloadDocument(doc.name)}
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="timeline" className="p-4 sm:p-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          <div className="space-y-4 sm:space-y-6">
            {timeline.map((event, index) => (
              <div key={index} className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${index === 0 ? 'bg-blue-500' : 'bg-muted-foreground/30'
                      }`}
                  ></div>
                  {index < timeline.length - 1 && <div className="w-px h-full bg-border mt-2"></div>}
                </div>
                <div className="flex-1 pb-4 sm:pb-6 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                    <h4 className="tracking-tight text-sm sm:text-base">{event.title}</h4>
                    <span className="text-xs sm:text-sm text-muted-foreground/70 flex-shrink-0">{event.eventDate}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="description" className="p-4 sm:p-6">
          <div className="prose prose-sm sm:prose max-w-none">
            <p className="whitespace-pre-wrap text-sm sm:text-base text-foreground leading-relaxed">
              {selectedCase?.description || t('CASES.NO_DESCRIPTION')}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="p-4 space-y-4">
          {/* Notes Header with Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('CASES.NOTES.PLACEHOLDER')}
              </h3>

              {/* Save Status Indicator */}
              {saveStatus !== 'idle' && (
                <div className="flex items-center gap-1.5 text-xs">
                  {saveStatus === 'saving' && (
                    <>
                      <Clock className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                      <span className="text-blue-500">{t('CASES.NOTES.SAVING')}</span>
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500">{t('CASES.NOTES.SAVED')}</span>
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <span className="text-red-500">{t('CASES.NOTES.ERROR')}</span>
                  )}
                </div>
              )}
            </div>

            {/* Character Count & Last Saved */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {lastSaved && saveStatus === 'idle' && (
                <span className="hidden sm:inline">
                  {t('CASES.NOTES.LAST_SAVED')} {formatLastSaved()}
                </span>
              )}
              <span>
                {notes.length} {notes.length === 1 ? t('CASES.NOTES.CHARACTER') : t('CASES.NOTES.CHARACTERS')}
              </span>
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="relative">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[300px] rounded-xl resize-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder={t('CASES.NOTES.DETAILED_PLACEHOLDER')}
            />
          </div>

          {/* Manual Save Button */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              💡 {t('CASES.NOTES.AUTO_SAVE_INFO')}
            </p>

            <Button
              onClick={saveNotes}
              disabled={isSaving || notes === selectedCase?.notes}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? t('CASES.NOTES.SAVING') : t('CASES.NOTES.SAVE_NOW')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
