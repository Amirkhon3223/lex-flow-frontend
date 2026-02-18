import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { casesService } from '@/app/services/cases/cases.service';
import { ROUTES } from '@/app/config/routes.config';
import type { ConflictCheckResultInterface } from '@/app/types/cases/cases.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Input } from '@/shared/ui/input';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

const LEVEL_STYLES: Record<string, { border: string; badge: string; label: string }> = {
  high: {
    border: 'border-red-300 dark:border-red-700',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    label: 'CONFLICT_CHECK.LEVEL_HIGH',
  },
  medium: {
    border: 'border-yellow-300 dark:border-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    label: 'CONFLICT_CHECK.LEVEL_MEDIUM',
  },
  low: {
    border: 'border-gray-300 dark:border-gray-600',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    label: 'CONFLICT_CHECK.LEVEL_LOW',
  },
};

const FIELD_LABELS: Record<string, string> = {
  name: 'CONFLICT_CHECK.MATCH_NAME',
  company: 'CONFLICT_CHECK.MATCH_COMPANY',
  email: 'CONFLICT_CHECK.MATCH_EMAIL',
  phone: 'CONFLICT_CHECK.MATCH_PHONE',
};

export function ConflictCheckView() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ConflictCheckResultInterface[] | null>(null);
  const [searched, setSearched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults(null);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await casesService.checkConflicts(searchQuery);
      setResults(response.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        performSearch(value.trim());
      }, 500);
    },
    [performSearch]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const getLevelStyle = (level: string) => LEVEL_STYLES[level] || LEVEL_STYLES.low;

  const getFieldLabel = (field: string) => {
    const key = FIELD_LABELS[field];
    return key ? t(key) : field;
  };

  return (
    <div>
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">
                {t('CONFLICT_CHECK.TITLE')}
              </h1>
            </div>
          </div>

          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              strokeWidth={2}
            />
            <Input
              placeholder={t('CONFLICT_CHECK.SEARCH_PLACEHOLDER')}
              value={query}
              onChange={handleInputChange}
              className="pl-12 h-12 bg-muted/50 border-0 rounded-2xl text-base focus-visible:ring-2 focus-visible:ring-blue-500"
              autoFocus
            />
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">{t('CONFLICT_CHECK.SEARCHING')}</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Shield className="w-16 h-16 mb-4 opacity-40" strokeWidth={1.5} />
            <p className="text-sm">{t('CONFLICT_CHECK.SEARCH_PLACEHOLDER')}</p>
          </div>
        )}

        {!loading && searched && results && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ShieldCheck className="w-16 h-16 mb-4 text-green-500 opacity-70" strokeWidth={1.5} />
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              {t('CONFLICT_CHECK.NO_CONFLICTS_FOUND')}
            </p>
          </div>
        )}

        {!loading && results && results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => {
              const style = getLevelStyle(result.conflictLevel);

              return (
                <Card
                  key={`${result.matchType}-${result.clientId || result.partyId}-${index}`}
                  className={`border-2 ${style.border} transition-colors`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold tracking-tight truncate">
                          {result.matchedName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge className={`${style.badge} border-0 text-xs`}>
                            {t(style.label)}
                          </Badge>
                          <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                            {result.matchType === 'client'
                              ? t('CONFLICT_CHECK.RESULT_CLIENT')
                              : t('CONFLICT_CHECK.RESULT_PARTY')}
                          </Badge>
                          {result.matchType === 'case_party' && result.partyRole && (
                            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0 text-xs">
                              {t(`PARTIES.ROLE_${result.partyRole.toUpperCase()}`)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex-shrink-0">
                        {getFieldLabel(result.matchedField)}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-sm">
                      {result.caseId && result.caseTitle && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{t('CASES.FIELDS.CASE')}:</span>
                          <Link
                            to={ROUTES.CASES.DETAIL(result.caseId)}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium truncate"
                          >
                            {result.caseTitle}
                          </Link>
                          {result.caseStatus && (
                            <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                              {result.caseStatus}
                            </Badge>
                          )}
                        </div>
                      )}
                      {result.clientName && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{t('CASES.FIELDS.CLIENT')}:</span>
                          <span className="font-medium truncate">{result.clientName}</span>
                        </div>
                      )}
                      {result.caseClientName && result.caseClientName !== result.clientName && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{t('CASES.FIELDS.CLIENT')}:</span>
                          <span className="font-medium truncate">{result.caseClientName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
