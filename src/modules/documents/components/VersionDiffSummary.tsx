import { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { aiService } from '@/app/services/ai/ai.service';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface VersionDiffSummaryProps {
  documentId: string;
  version1Id: string;
  version2Id: string;
  version1Number: number;
  version2Number: number;
  statistics: {
    added: number;
    removed: number;
    unchanged: number;
  };
}

interface DiffSummary {
  id: string;
  summary: string;
  details?: string;
  tokensUsed: number;
  model: string;
}

export function VersionDiffSummary({
  documentId,
  version1Id,
  version2Id,
  version1Number,
  version2Number,
  statistics,
}: VersionDiffSummaryProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<DiffSummary | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Check if summary already exists
  useEffect(() => {
    const checkExistingSummary = async () => {
      try {
        const response = await aiService.getVersionComparison(documentId, version1Id, version2Id);
        if (response) {
          setSummary({
            id: response.id,
            summary: response.summary,
            details: response.details || undefined,
            tokensUsed: response.tokensUsed,
            model: response.model,
          });
        }
      } catch {
        // No cached summary exists, that's fine
      }
    };

    if (version1Id && version2Id) {
      checkExistingSummary();
    }
  }, [documentId, version1Id, version2Id]);

  const handleGenerateSummary = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await aiService.compareVersions(documentId, {
        version1Id,
        version2Id,
      });

      setSummary({
        id: response.id,
        summary: response.summary,
        details: response.details || undefined,
        tokensUsed: response.tokensUsed,
        model: response.model,
      });

      toast.success(t('DOCUMENTS.AI_DIFF.SUCCESS'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('DOCUMENTS.AI_DIFF.ERROR');
      if (message.includes('Insufficient tokens')) {
        toast.error(t('DOCUMENTS.AI_DIFF.INSUFFICIENT_TOKENS'));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 mb-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-300">
              {t('DOCUMENTS.AI_DIFF.TITLE')}
            </h3>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {t('DOCUMENTS.AI_DIFF.DESCRIPTION')}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-purple-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-purple-600" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Context Info */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-lg bg-white/50 dark:bg-gray-800/50 text-purple-700 dark:text-purple-300">
              v{version1Number} → v{version2Number}
            </span>
            <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-700 dark:text-green-400">
              +{statistics.added} {t('DOCUMENTS.AI_DIFF.CHARS')}
            </span>
            <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-700 dark:text-red-400">
              -{statistics.removed} {t('DOCUMENTS.AI_DIFF.CHARS')}
            </span>
          </div>

          {summary ? (
            <div className="space-y-3">
              {/* Summary */}
              <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {t('DOCUMENTS.AI_DIFF.SUMMARY')}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {summary.tokensUsed} tokens • {summary.model}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateSummary();
                      }}
                      disabled={loading}
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{summary.summary}</p>
              </div>

              {/* Details (expandable) */}
              {summary.details && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs text-purple-600 hover:text-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(!showDetails);
                    }}
                  >
                    <span>{t('DOCUMENTS.AI_DIFF.DETAILED_ANALYSIS')}</span>
                    {showDetails ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Button>

                  {showDetails && (
                    <div className="mt-2 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{summary.details}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={handleGenerateSummary}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('DOCUMENTS.AI_DIFF.GENERATING')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('DOCUMENTS.AI_DIFF.GENERATE')}
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
