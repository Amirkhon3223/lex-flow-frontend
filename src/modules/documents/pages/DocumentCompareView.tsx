import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Download,
  FileText,
  Info,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  GitCompare,
  ChevronDown,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDocumentsStore } from '@/app/store/documents.store';
import { BackButton } from '@/shared/components/BackButton';
import { useI18n } from '@/shared/context/I18nContext';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll-area.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/shared/ui/select.tsx';
import { Separator } from '@/shared/ui/separator.tsx';
import { BlockRenderer } from '../components/BlockRenderer';
import { blockMatcher } from '../utils/BlockMatcher';
import { diffCalculator } from '../utils/DiffCalculator';

export function DocumentCompareView() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id: documentId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    selectedDocument,
    versions,
    comparisonData,
    loading,
    error,
    fetchDocumentById,
    fetchVersions,
    compareVersions,
  } = useDocumentsStore();

  const onBack = () => {
    const from = searchParams.get('from');
    const caseId = searchParams.get('caseId');
    const params = from === 'case' && caseId ? `?from=case&caseId=${caseId}` : '?from=documents';
    navigate(`/documents/${documentId}/file-versions${params}`);
  };
  const [zoomLevel, setZoomLevel] = useState(100);
  const [version1, setVersion1] = useState(searchParams.get('v1') || '');
  const [version2, setVersion2] = useState(searchParams.get('v2') || '');
  const [openSelect, setOpenSelect] = useState<'version1' | 'version2' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentId) {
      fetchDocumentById(documentId);
      fetchVersions(documentId);
    }
  }, [documentId, fetchDocumentById, fetchVersions]);

  useEffect(() => {
    if (versions.length >= 2 && !version1 && !version2) {
      const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
      setVersion1(sortedVersions[1].id);
      setVersion2(sortedVersions[0].id);
    }
  }, [versions, version1, version2]);

  useEffect(() => {
    if (documentId && version1 && version2 && version1 !== version2) {
      compareVersions(documentId, version1, version2);
      setSearchParams({ v1: version1, v2: version2 });
    }
  }, [documentId, version1, version2, compareVersions, setSearchParams]);

  const handleVersionChange = (versionId: string, isVersion1: boolean) => {
    if (isVersion1) {
      if (versionId !== version2) setVersion1(versionId);
    } else {
      if (versionId !== version1) setVersion2(versionId);
    }
  };

  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      setZoomLevel(zoomLevel + 10);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) {
      setZoomLevel(zoomLevel - 10);
    }
  };

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const alignedPairs = useMemo(() => {
    if (!comparisonData) return [];
    return blockMatcher.alignBlocks(
      comparisonData.version1.blocks,
      comparisonData.version2.blocks
    );
  }, [comparisonData]);

  const statistics = useMemo(() => {
    if (alignedPairs.length === 0) {
      return { added: 0, removed: 0, unchanged: 0 };
    }

    let totalAdded = 0;
    let totalRemoved = 0;
    let totalUnchanged = 0;

    alignedPairs.forEach((pair) => {
      if (pair.block1?.blockType === 'TEXT' && pair.block2?.blockType === 'TEXT') {
        const stats = diffCalculator.calculateStats(
          pair.block1.content || '',
          pair.block2.content || ''
        );
        totalAdded += stats.added;
        totalRemoved += stats.removed;
        totalUnchanged += stats.unchanged;
      } else if (pair.matchType === 'added' && pair.block2?.blockType === 'TEXT') {
        totalAdded += (pair.block2.content || '').length;
      } else if (pair.matchType === 'removed' && pair.block1?.blockType === 'TEXT') {
        totalRemoved += (pair.block1.content || '').length;
      }
    });

    return { added: totalAdded, removed: totalRemoved, unchanged: totalUnchanged };
  }, [alignedPairs]);

  if (error) {
    return (
      <div className="p-6">
        <BackButton onClick={onBack} label={t('DOCUMENTS.BACK_TO_VERSIONS')} />
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading && !comparisonData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!loading && versions.length < 2) {
    return (
      <div className="p-6">
        <BackButton onClick={onBack} label={t('DOCUMENTS.BACK_TO_VERSIONS')} />
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Not enough versions</AlertTitle>
          <AlertDescription>At least 2 versions are required for comparison.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const v1Data = comparisonData.version1;
  const v2Data = comparisonData.version2;

  const getVersionMeta = (versionId: string) =>
    versions.find((v) => v.id === versionId) || null;

  const v1Meta = getVersionMeta(version1);
  const v2Meta = getVersionMeta(version2);

  return (
    <div ref={containerRef}>
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <BackButton onClick={onBack} label={t('DOCUMENTS.BACK_TO_VERSIONS')} />

            <div className="flex items-center gap-2 flex-wrap">
              {}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 70}
                  className="rounded-xl border-border hover:bg-muted"
                >
                  <ZoomOut className="w-4 h-4" strokeWidth={2} />
                </Button>
                <span className="text-sm text-gray-600 w-16 text-center">{zoomLevel}%</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 150}
                  className="rounded-xl border-border hover:bg-muted"
                >
                  <ZoomIn className="w-4 h-4" strokeWidth={2} />
                </Button>

                <Separator orientation="vertical" className="h-8 mx-2 bg-border" />
              </div>

              <Button
                variant="outline"
                className="rounded-xl border-border hover:bg-muted hidden md:flex"
                onClick={handleToggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 mr-2" strokeWidth={2} />
                ) : (
                  <Maximize2 className="w-4 h-4 mr-2" strokeWidth={2} />
                )}
                {isFullscreen ? t('DOCUMENTS.EXIT_FULLSCREEN') : t('DOCUMENTS.FULLSCREEN')}
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm sm:text-base flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">{t('DOCUMENTS.EXPORT_COMPARISON')}</span>
                <span className="sm:hidden">{t('COMMON.ACTIONS.EXPORT')}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <GitCompare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">
                {t('DOCUMENTS.VERSION_COMPARISON')}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {selectedDocument?.name || 'Document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <Select
                value={version1}
                onValueChange={(v) => handleVersionChange(v, true)}
                open={openSelect === 'version1'}
                onOpenChange={(open) => setOpenSelect(open ? 'version1' : null)}
              >
                <SelectTrigger className="h-10 sm:h-12 rounded-xl border-input bg-background">
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <FileText
                      className="w-4 h-4 text-muted-foreground flex-shrink-0 hidden sm:block"
                      strokeWidth={2}
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate">
                        v{v1Meta?.versionNumber || '?'}
                      </div>
                      {v1Meta && (
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {new Date(v1Meta.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <ChevronDown
                      className="w-4 h-4 text-muted-foreground flex-shrink-0"
                      strokeWidth={2}
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {versions.map((v) => (
                    <SelectItem key={v.id} value={v.id} disabled={v.id === version2}>
                      <div className="py-1">
                        <div>
                          {t('DOCUMENTS.VERSION')} {v.versionNumber}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(v.createdAt).toLocaleString()} • {v.uploadedByName}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <Select
                value={version2}
                onValueChange={(v) => handleVersionChange(v, false)}
                open={openSelect === 'version2'}
                onOpenChange={(open) => setOpenSelect(open ? 'version2' : null)}
              >
                <SelectTrigger className="h-10 sm:h-12 rounded-xl border-input bg-background">
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <FileText
                      className="w-4 h-4 text-muted-foreground flex-shrink-0 hidden sm:block"
                      strokeWidth={2}
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate">
                        v{v2Meta?.versionNumber || '?'}
                      </div>
                      {v2Meta && (
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {new Date(v2Meta.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <ChevronDown
                      className="w-4 h-4 text-muted-foreground flex-shrink-0"
                      strokeWidth={2}
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {versions.map((v) => (
                    <SelectItem key={v.id} value={v.id} disabled={v.id === version1}>
                      <div className="py-1">
                        <div>
                          {t('DOCUMENTS.VERSION')} {v.versionNumber}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(v.createdAt).toLocaleString()} • {v.uploadedByName}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {}
        {(v1Data.extractionStatus === 'failed' || v2Data.extractionStatus === 'failed') && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Extraction Failed</AlertTitle>
            <AlertDescription>
              Document structure could not be extracted for one or both versions. Comparison may be
              unavailable.
            </AlertDescription>
          </Alert>
        )}

        {}
        <div className="lg:hidden space-y-4">
          {}
          <Card>
            <div>
              <h3 className="font-semibold tracking-tight text-sm mb-3">
                {t('DOCUMENTS.CHANGES_DETECTED')}
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-700 dark:text-green-400">
                    +{statistics.added} chars
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-destructive/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  <span className="text-xs text-destructive">-{statistics.removed} chars</span>
                </div>
              </div>
            </div>
          </Card>

          {}
          <Card>
            <div className="p-3 bg-muted/50 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight text-sm mb-0.5">
                    {t('DOCUMENTS.VERSION')} {v1Data.versionNumber}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(v1Data.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                  {t('DOCUMENTS.OLD')}
                </Badge>
              </div>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4" style={{ fontSize: `${zoomLevel}%` }}>
                {alignedPairs.map((pair, idx) => (
                  <BlockRenderer
                    key={pair.block1?.id || pair.block2?.id || `pair-${idx}`}
                    block={pair.block1!}
                    comparisonBlock={pair.block2 || undefined}
                    side="old"
                  />
                ))}
              </div>
            </ScrollArea>
          </Card>

          {}
          <Card>
            <div className="p-3 bg-green-500/10 border-b border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight text-sm mb-0.5">
                    {t('DOCUMENTS.VERSION')} {v2Data.versionNumber}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(v2Data.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge className="bg-green-500 text-white border-0 text-xs">
                  {t('DOCUMENTS.NEW')}
                </Badge>
              </div>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4" style={{ fontSize: `${zoomLevel}%` }}>
                {alignedPairs.map((pair, idx) => (
                  <BlockRenderer
                    key={pair.block1?.id || pair.block2?.id || `pair-${idx}`}
                    block={pair.block2!}
                    comparisonBlock={pair.block1 || undefined}
                    side="new"
                  />
                ))}
              </div>
            </ScrollArea>
          </Card>

          {}
          <Card className="bg-muted/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                <h4 className="text-xs font-semibold tracking-tight">{t('DOCUMENTS.LEGEND')}</h4>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30"></div>
                  <span className="text-muted-foreground">{t('DOCUMENTS.ADDED')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/30"></div>
                  <span className="text-muted-foreground">{t('DOCUMENTS.REMOVED')}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {}
          <div className="space-y-6">
            <Card>
              <div>
                <h3 className="font-semibold tracking-tight mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                  Statistics
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-green-700 dark:text-green-400">
                        {t('DOCUMENTS.ADDED')}
                      </span>
                    </div>
                    <span className="text-sm text-green-700 dark:text-green-400">
                      {statistics.added}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-destructive/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-destructive"></div>
                      <span className="text-sm text-destructive">{t('DOCUMENTS.REMOVED')}</span>
                    </div>
                    <span className="text-sm text-destructive">{statistics.removed}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                      <span className="text-sm text-muted-foreground">Unchanged</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{statistics.unchanged}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-muted/50">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                  <h4 className="text-sm font-semibold tracking-tight">{t('DOCUMENTS.LEGEND')}</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
                    <span className="text-muted-foreground">{t('DOCUMENTS.ADDED_TEXT')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive/30"></div>
                    <span className="text-muted-foreground">{t('DOCUMENTS.REMOVED_TEXT')}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {}
          <div className="col-span-3">
            <Card>
              <div className="grid grid-cols-2 divide-x divide-border">
                {}
                <div>
                  <div className="p-4 bg-muted/50 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold tracking-tight mb-1">
                          {t('DOCUMENTS.VERSION')} {v1Data.versionNumber}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(v1Data.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge className="bg-muted text-muted-foreground border-0">
                        {t('DOCUMENTS.OLD')}
                      </Badge>
                    </div>
                  </div>
                  <ScrollArea className="h-[800px]">
                    <div className="p-6 space-y-4" style={{ fontSize: `${zoomLevel}%` }}>
                      {alignedPairs.map((pair, idx) => (
                        <BlockRenderer
                          key={pair.block1?.id || pair.block2?.id || `pair-${idx}`}
                          block={pair.block1!}
                          comparisonBlock={pair.block2 || undefined}
                          side="old"
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {}
                <div>
                  <div className="p-4 bg-green-500/10 border-b border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold tracking-tight mb-1">
                          {t('DOCUMENTS.VERSION')} {v2Data.versionNumber}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(v2Data.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge className="bg-green-500 text-white border-0">
                        {t('DOCUMENTS.NEW')}
                      </Badge>
                    </div>
                  </div>
                  <ScrollArea className="h-[800px]">
                    <div className="p-6 space-y-4" style={{ fontSize: `${zoomLevel}%` }}>
                      {alignedPairs.map((pair, idx) => (
                        <BlockRenderer
                          key={pair.block1?.id || pair.block2?.id || `pair-${idx}`}
                          block={pair.block2!}
                          comparisonBlock={pair.block1 || undefined}
                          side="new"
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
