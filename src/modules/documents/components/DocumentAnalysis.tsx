import { useState } from 'react';
import {
  Sparkles,
  FileSearch,
  AlertTriangle,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAIStore } from '@/app/store/ai.store';
import type { DocumentAnalysisResponse } from '@/app/types/ai/ai.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface DocumentAnalysisProps {
  documentId: string;
  documentName: string;
}

type AnalysisType = 'overview' | 'risks' | 'summary' | 'full';

const analysisOptions: { type: AnalysisType; icon: typeof FileSearch; labelKey: string; descKey: string }[] = [
  { type: 'overview', icon: FileSearch, labelKey: 'DOCUMENTS.AI_ANALYSIS.OVERVIEW', descKey: 'DOCUMENTS.AI_ANALYSIS.OVERVIEW_DESC' },
  { type: 'risks', icon: AlertTriangle, labelKey: 'DOCUMENTS.AI_ANALYSIS.RISKS', descKey: 'DOCUMENTS.AI_ANALYSIS.RISKS_DESC' },
  { type: 'summary', icon: FileText, labelKey: 'DOCUMENTS.AI_ANALYSIS.SUMMARY', descKey: 'DOCUMENTS.AI_ANALYSIS.SUMMARY_DESC' },
  { type: 'full', icon: Sparkles, labelKey: 'DOCUMENTS.AI_ANALYSIS.FULL', descKey: 'DOCUMENTS.AI_ANALYSIS.FULL_DESC' },
];

export function DocumentAnalysis({ documentId, documentName: _documentName }: DocumentAnalysisProps) {
  const { t } = useI18n();
  const { analyzeDocument, tokenBalance, fetchTokenBalance, loading } = useAIStore();
  const [selectedType, setSelectedType] = useState<AnalysisType>('overview');
  const [analysis, setAnalysis] = useState<DocumentAnalysisResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (analyzing) return;

    setAnalyzing(true);
    try {
      const result = await analyzeDocument(documentId, selectedType);
      setAnalysis(result);
      // Refresh token balance after analysis
      fetchTokenBalance().catch(() => {});
      toast.success(t('DOCUMENTS.AI_ANALYSIS.SUCCESS'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('DOCUMENTS.AI_ANALYSIS.ERROR');
      if (message.includes('Insufficient tokens')) {
        toast.error(t('DOCUMENTS.AI_ANALYSIS.INSUFFICIENT_TOKENS'));
      } else {
        toast.error(message);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 mb-4 sm:mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base tracking-tight text-purple-700 dark:text-purple-300">
              {t('DOCUMENTS.AI_ANALYSIS.TITLE')}
            </h3>
            <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">
              {t('DOCUMENTS.AI_ANALYSIS.DESCRIPTION')}
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
          {/* Token Balance Indicator */}
          {tokenBalance && (
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
              <Zap className="w-3 h-3" />
              <span>
                {t('AI_ASSISTANT.HEADER.TOKENS_LEFT')}: {tokenBalance.totalAvailable.toLocaleString()}
              </span>
            </div>
          )}

          {/* Analysis Type Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {analysisOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedType === option.type;

              return (
                <button
                  key={option.type}
                  onClick={() => setSelectedType(option.type)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-purple-500'}`} />
                  <div className="text-xs font-medium">{t(option.labelKey)}</div>
                </button>
              );
            })}
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-md"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('DOCUMENTS.AI_ANALYSIS.ANALYZING')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('DOCUMENTS.AI_ANALYSIS.ANALYZE_BUTTON')}
              </>
            )}
          </Button>

          {/* Analysis Result */}
          {analysis && (
            <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {t('DOCUMENTS.AI_ANALYSIS.RESULT')}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {analysis.tokensUsed.toLocaleString()} tokens • {analysis.model}
                </span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {analysis.content}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
