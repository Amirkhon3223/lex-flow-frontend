import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseHighlightItemResult {
  highlightedId: string | null;
  isHighlighted: (id: string) => boolean;
  clearHighlight: () => void;
}

/**
 * Hook for handling item highlight from URL params
 * Reads ?highlight=id param, auto-clears after duration
 */
export function useHighlightItem(duration = 3000): UseHighlightItemResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Read highlight param on mount and when URL changes
  useEffect(() => {
    const id = searchParams.get('highlight');
    if (id) {
      setHighlightedId(id);

      // Scroll to element after a short delay (allow DOM to render)
      setTimeout(() => {
        const element = document.getElementById(`highlight-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Auto-clear after duration
      const timer = setTimeout(() => {
        setHighlightedId(null);
        // Remove highlight param from URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('highlight');
        setSearchParams(newParams, { replace: true });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams, duration]);

  const isHighlighted = useCallback(
    (id: string) => highlightedId === id,
    [highlightedId]
  );

  const clearHighlight = useCallback(() => {
    setHighlightedId(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('highlight');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return {
    highlightedId,
    isHighlighted,
    clearHighlight,
  };
}
