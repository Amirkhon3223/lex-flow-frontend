/**
 * @file GlobalSearchDialog.tsx
 * @description Global search across all entities with document content search
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Users, Briefcase, Calendar, MessageSquare, X, Loader2, FileSearch } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {
  searchService,
  type GlobalSearchResponse,
  type SearchResultItem,
  type DocumentContentSearchResponse,
  type DocumentContentSearchResult,
} from '@/app/services/search/search.service';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'content'>('quick');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [contentResults, setContentResults] = useState<DocumentContentSearchResponse | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const performSearch = useCallback(async (query: string, tab: 'quick' | 'content') => {
    if (query.length < 2) {
      setResults(null);
      setContentResults(null);
      return;
    }

    setLoading(true);
    try {
      if (tab === 'quick') {
        const data = await searchService.globalSearch(query);
        setResults(data);
      } else {
        const data = await searchService.searchDocumentContent(query);
        setContentResults(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults(null);
      setContentResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery, activeTab);
  }, [debouncedQuery, activeTab, performSearch]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setResults(null);
      setContentResults(null);
      setActiveTab('quick');
    }
  }, [open]);

  const handleResultClick = (item: SearchResultItem) => {
    onOpenChange(false);

    switch (item.type) {
      case 'client':
        navigate(`/clients/${item.id}?highlight=${item.id}`);
        break;
      case 'case':
        navigate(`/cases/${item.id}?highlight=${item.id}`);
        break;
      case 'document':
        navigate(`/documents/${item.id}/file-versions?highlight=${item.id}`);
        break;
      case 'meeting':
        navigate(`/calendar/meetings/${item.id}?highlight=${item.id}`);
        break;
      case 'chat':
        navigate(`/ai-assistant?chat=${item.id}&highlight=${item.id}`);
        break;
    }
  };

  const handleContentResultClick = (item: DocumentContentSearchResult) => {
    onOpenChange(false);
    navigate(`/documents/${item.documentId}/file-versions?highlight=${item.blockId}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in_progress':
        return 'bg-green-50 text-green-700';
      case 'pending':
      case 'new':
        return 'bg-blue-50 text-blue-700';
      case 'closed':
      case 'inactive':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    items: SearchResultItem[],
    iconColor: string
  ) => {
    if (items.length === 0) return null;

    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className={iconColor}>{icon}</span>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <Badge className="bg-muted text-muted-foreground border-0 text-xs">
            {items.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={`${item.type}-${item.id}`}
              className="w-full p-4 rounded-xl hover:bg-muted transition-colors text-left group"
              onClick={() => handleResultClick(item)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  )}
                </div>
                {item.status && (
                  <Badge className={`${getStatusColor(item.status)} border-0 text-xs`}>
                    {item.status}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderContentResults = () => {
    if (!contentResults || contentResults.results.length === 0) return null;

    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-orange-500">
            <FileSearch className="w-5 h-5" strokeWidth={2} />
          </span>
          <h3 className="text-sm font-medium text-foreground">
            {t('SEARCH.DOCUMENT_CONTENT')}
          </h3>
          <Badge className="bg-muted text-muted-foreground border-0 text-xs">
            {contentResults.total}
          </Badge>
        </div>
        <div className="space-y-3">
          {contentResults.results.map((item) => (
            <button
              key={item.blockId}
              className="w-full p-4 rounded-xl hover:bg-muted transition-colors text-left group border border-border/50"
              onClick={() => handleContentResultClick(item)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <h4 className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                    {item.documentName}
                  </h4>
                </div>
                {item.caseName && (
                  <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">
                    {item.caseName}
                  </Badge>
                )}
              </div>
              <div
                className="text-xs text-muted-foreground line-clamp-3 [&_mark]:bg-yellow-200 [&_mark]:text-yellow-900 [&_mark]:px-0.5 [&_mark]:rounded"
                dangerouslySetInnerHTML={{ __html: item.highlight || item.content }}
              />
            </button>
          ))}
        </div>
        {contentResults.hasMore && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm" onClick={() => {/* TODO: Load more */}}>
              {t('COMMON.ACTIONS.LOAD_MORE')}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const hasResults = results && results.counts.total > 0;
  const hasContentResults = contentResults && contentResults.results.length > 0;
  const showEmptyState =
    debouncedQuery.length >= 2 &&
    !loading &&
    ((activeTab === 'quick' && !hasResults) || (activeTab === 'content' && !hasContentResults));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogTitle className="sr-only">{t('SEARCH.GLOBAL')}</DialogTitle>
        <DialogDescription className="sr-only">{t('SEARCH.DESCRIPTION')}</DialogDescription>

        <div className="p-6 pb-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              strokeWidth={2}
            />
            <Input
              placeholder={t('SEARCH.PLACEHOLDER')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 bg-muted/50 border-0 rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'quick' | 'content')} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                {t('SEARCH.QUICK_SEARCH')}
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileSearch className="w-4 h-4" />
                {t('SEARCH.CONTENT_SEARCH')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Separator className="bg-border" />

        <ScrollArea className="max-h-[500px]">
          <div className="p-6 space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {showEmptyState && (
              <div className="text-center py-12 text-muted-foreground">
                {t('SEARCH.NO_RESULTS')}
              </div>
            )}

            {!loading && activeTab === 'quick' && hasResults && (
              <>
                {renderSection(
                  t('COMMON.NAVIGATION.CASES'),
                  <Briefcase className="w-5 h-5" strokeWidth={2} />,
                  results.cases,
                  'text-blue-500'
                )}

                {results.cases.length > 0 && results.clients.length > 0 && (
                  <Separator className="bg-border" />
                )}

                {renderSection(
                  t('COMMON.NAVIGATION.CLIENTS'),
                  <Users className="w-5 h-5" strokeWidth={2} />,
                  results.clients,
                  'text-purple-500'
                )}

                {(results.cases.length > 0 || results.clients.length > 0) &&
                  results.documents.length > 0 && <Separator className="bg-border" />}

                {renderSection(
                  t('COMMON.NAVIGATION.DOCUMENTS'),
                  <FileText className="w-5 h-5" strokeWidth={2} />,
                  results.documents,
                  'text-orange-500'
                )}

                {(results.cases.length > 0 ||
                  results.clients.length > 0 ||
                  results.documents.length > 0) &&
                  results.meetings.length > 0 && <Separator className="bg-border" />}

                {renderSection(
                  t('COMMON.NAVIGATION.CALENDAR'),
                  <Calendar className="w-5 h-5" strokeWidth={2} />,
                  results.meetings,
                  'text-green-500'
                )}

                {(results.cases.length > 0 ||
                  results.clients.length > 0 ||
                  results.documents.length > 0 ||
                  results.meetings.length > 0) &&
                  results.chats.length > 0 && <Separator className="bg-border" />}

                {renderSection(
                  t('COMMON.NAVIGATION.AI_ASSISTANT'),
                  <MessageSquare className="w-5 h-5" strokeWidth={2} />,
                  results.chats,
                  'text-pink-500'
                )}
              </>
            )}

            {!loading && activeTab === 'content' && hasContentResults && renderContentResults()}

            {!loading && debouncedQuery.length < 2 && debouncedQuery.length > 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {t('SEARCH.MIN_CHARS')}
              </div>
            )}

            {!loading && debouncedQuery.length === 0 && activeTab === 'content' && (
              <div className="text-center py-12 text-muted-foreground">
                <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('SEARCH.CONTENT_SEARCH_HINT')}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
