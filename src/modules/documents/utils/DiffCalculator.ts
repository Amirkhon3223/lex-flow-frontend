import DiffMatchPatch from 'diff-match-patch';

export interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export interface WordDiffResult {
  type: 'added' | 'removed' | 'unchanged';
  word: string;
  trailingSpace: string; // preserve spaces after word
}

export interface HybridDiffPart {
  char: string;
  changed: boolean; // true if this specific char was changed
}

export interface HybridWordDiff {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  parts: HybridDiffPart[]; // character-level breakdown within the word
  trailingParts: HybridDiffPart[]; // character-level breakdown of trailing whitespace
}

/**
 * DiffCalculator - утилита для вычисления character-level diff между текстами
 */
export class DiffCalculator {
  private dmp: DiffMatchPatch;

  constructor() {
    this.dmp = new DiffMatchPatch();
    this.dmp.Diff_Timeout = 1.0;
    this.dmp.Diff_EditCost = 4;
  }

  /**
   * Вычисляет character-level diff между двумя текстами
   * @param oldText - исходный текст
   * @param newText - новый текст
   * @returns массив DiffResult с подсветкой добавлений/удалений/неизмененных частей
   */
  calculateTextDiff(oldText: string, newText: string): DiffResult[] {
    const diffs = this.dmp.diff_main(oldText, newText);

    this.dmp.diff_cleanupSemantic(diffs);

    return diffs.map(([operation, text]) => {
      if (operation === 1) {
        return { type: 'added', text };
      } else if (operation === -1) {
        return { type: 'removed', text };
      } else {
        return { type: 'unchanged', text };
      }
    });
  }

  /**
   * Вычисляет процент схожести двух текстов
   * @param oldText - исходный текст
   * @param newText - новый текст
   * @returns процент схожести (0-100)
   */
  calculateSimilarity(oldText: string, newText: string): number {
    const diffs = this.dmp.diff_main(oldText, newText);
    const levenshteinDistance = this.dmp.diff_levenshtein(diffs);
    const maxLength = Math.max(oldText.length, newText.length);

    if (maxLength === 0) return 100;

    const similarity = ((maxLength - levenshteinDistance) / maxLength) * 100;
    return Math.round(similarity * 10) / 10;
  }

  /**
   * Подсчитывает статистику изменений
   * @param oldText - исходный текст
   * @param newText - новый текст
   * @returns объект со статистикой
   */
  calculateStats(
    oldText: string,
    newText: string
  ): { added: number; removed: number; unchanged: number } {
    const diffs = this.dmp.diff_main(oldText, newText);
    this.dmp.diff_cleanupSemantic(diffs);

    let added = 0;
    let removed = 0;
    let unchanged = 0;

    diffs.forEach(([operation, text]) => {
      if (operation === 1) {
        added += text.length;
      } else if (operation === -1) {
        removed += text.length;
      } else {
        unchanged += text.length;
      }
    });

    return { added, removed, unchanged };
  }

  /**
   * Вычисляет word-level diff между двумя текстами
   * Слово = любая последовательность символов без пробелов (включая даты типа "24.10.2024")
   * @param oldText - исходный текст
   * @param newText - новый текст
   * @returns массив WordDiffResult
   */
  calculateWordDiff(oldText: string, newText: string): WordDiffResult[] {
    // Split text into words preserving spaces
    const splitIntoWords = (text: string): { word: string; trailingSpace: string }[] => {
      const result: { word: string; trailingSpace: string }[] = [];
      const regex = /(\S+)(\s*)/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        result.push({ word: match[1], trailingSpace: match[2] });
      }
      return result;
    };

    const oldWords = splitIntoWords(oldText);
    const newWords = splitIntoWords(newText);

    // Use diff-match-patch on words (as single units)
    const oldWordsText = oldWords.map(w => w.word).join('\x00');
    const newWordsText = newWords.map(w => w.word).join('\x00');

    const diffs = this.dmp.diff_main(oldWordsText, newWordsText);
    this.dmp.diff_cleanupSemantic(diffs);

    const result: WordDiffResult[] = [];
    let oldIdx = 0;
    let newIdx = 0;

    for (const [operation, text] of diffs) {
      const words = text.split('\x00').filter(w => w.length > 0);

      for (const word of words) {
        if (operation === 0) {
          // Unchanged - use spacing from appropriate source
          const trailing = oldWords[oldIdx]?.trailingSpace || newWords[newIdx]?.trailingSpace || '';
          result.push({ type: 'unchanged', word, trailingSpace: trailing });
          oldIdx++;
          newIdx++;
        } else if (operation === -1) {
          // Removed
          const trailing = oldWords[oldIdx]?.trailingSpace || '';
          result.push({ type: 'removed', word, trailingSpace: trailing });
          oldIdx++;
        } else if (operation === 1) {
          // Added
          const trailing = newWords[newIdx]?.trailingSpace || '';
          result.push({ type: 'added', word, trailingSpace: trailing });
          newIdx++;
        }
      }
    }

    return result;
  }

  /**
   * Гибридный diff на основе токенов (слово + пробелы как единица).
   * Отслеживает ВСЕ изменения включая пробелы и пустые строки.
   *
   * Подход:
   * 1. Разбиваем тексты на токены (слово + trailing whitespace)
   * 2. Сравниваем токены целиком чтобы найти измененные/добавленные/удаленные
   * 3. Для измененных токенов делаем char-level diff
   * 4. Это гарантирует что если токен изменился - он будет помечен на ОБЕИХ сторонах
   *
   * @param oldText - исходный текст
   * @param newText - новый текст
   * @param side - 'old' или 'new' для какой стороны генерировать
   * @returns массив HybridWordDiff
   */
  calculateHybridDiff(oldText: string, newText: string, side: 'old' | 'new'): HybridWordDiff[] {
    // DEBUG: Log input texts
    console.log(`[DIFF DEBUG] side=${side}, oldText.length=${oldText.length}, newText.length=${newText.length}`);
    console.log(`[DIFF DEBUG] oldText first 100: "${oldText.substring(0, 100)}"`);
    console.log(`[DIFF DEBUG] newText first 100: "${newText.substring(0, 100)}"`);
    console.log(`[DIFF DEBUG] texts are identical: ${oldText === newText}`);

    // Split text into tokens (word + all trailing whitespace as one unit)
    const tokenize = (text: string): string[] => {
      const tokens: string[] = [];
      // Handle leading whitespace specially
      const leadingWs = text.match(/^(\s+)/);
      if (leadingWs) {
        tokens.push(leadingWs[1]);
      }
      // Match words with their trailing whitespace
      const wordRegex = /\S+\s*/g;
      const startIdx = leadingWs ? leadingWs[1].length : 0;
      const restText = text.slice(startIdx);
      let match;
      while ((match = wordRegex.exec(restText)) !== null) {
        tokens.push(match[0]);
      }
      return tokens;
    };

    const oldTokens = tokenize(oldText);
    const newTokens = tokenize(newText);

    // Compare tokens using diff-match-patch with separator
    const oldTokensText = oldTokens.join('\x00');
    const newTokensText = newTokens.join('\x00');

    const tokenDiffs = this.dmp.diff_main(oldTokensText, newTokensText);
    // DEBUG: Log raw diffs BEFORE cleanup
    const rawDiffCount = tokenDiffs.filter(([op]) => op !== 0).length;
    console.log(`[DIFF DEBUG] side=${side}, raw token diffs (non-zero): ${rawDiffCount}`);

    this.dmp.diff_cleanupSemantic(tokenDiffs);

    // DEBUG: Log diffs AFTER cleanup
    const cleanedDiffCount = tokenDiffs.filter(([op]) => op !== 0).length;
    console.log(`[DIFF DEBUG] side=${side}, after cleanup: ${cleanedDiffCount} changed operations`);

    // Process token-level diff to build aligned pairs
    type TokenPair = {
      oldToken: string | null;
      newToken: string | null;
    };
    const pairs: TokenPair[] = [];

    // Parse the diffs back into token pairs
    let tempRemoved: string[] = [];
    let tempAdded: string[] = [];

    const flushPairs = () => {
      // Match removed and added tokens as modifications
      const maxLen = Math.max(tempRemoved.length, tempAdded.length);
      for (let i = 0; i < maxLen; i++) {
        pairs.push({
          oldToken: tempRemoved[i] || null,
          newToken: tempAdded[i] || null,
        });
      }
      tempRemoved = [];
      tempAdded = [];
    };

    for (const [op, text] of tokenDiffs) {
      const tokens = text.split('\x00').filter(t => t.length > 0);

      if (op === 0) {
        // Unchanged tokens - flush any pending and add as pairs
        flushPairs();
        for (const token of tokens) {
          pairs.push({ oldToken: token, newToken: token });
        }
      } else if (op === -1) {
        // Removed tokens
        tempRemoved.push(...tokens);
      } else if (op === 1) {
        // Added tokens
        tempAdded.push(...tokens);
      }
    }
    flushPairs();

    // Now build the result for the requested side
    const result: HybridWordDiff[] = [];

    const splitToken = (token: string): { word: string; trailing: string } => {
      const match = token.match(/^(\S*)(\s*)$/);
      return {
        word: match?.[1] || '',
        trailing: match?.[2] || '',
      };
    };

    for (const pair of pairs) {
      if (pair.oldToken && pair.newToken) {
        if (pair.oldToken === pair.newToken) {
          // Unchanged token
          const { word, trailing } = splitToken(pair.oldToken);
          result.push({
            type: 'unchanged',
            parts: word.split('').map(char => ({ char, changed: false })),
            trailingParts: trailing.split('').map(char => ({ char, changed: false })),
          });
        } else {
          // Modified token - do char-level diff
          // Char-level diff for the whole token
          const charDiffs = this.dmp.diff_main(pair.oldToken, pair.newToken);
          this.dmp.diff_cleanupSemantic(charDiffs);

          // Build parts for the requested side
          const allParts: HybridDiffPart[] = [];

          for (const [op, text] of charDiffs) {
            if (op === 0) {
              for (const char of text) {
                allParts.push({ char, changed: false });
              }
            } else if (op === -1) {
              // Deleted - only show on old side
              if (side === 'old') {
                for (const char of text) {
                  allParts.push({ char, changed: true });
                }
              }
            } else if (op === 1) {
              // Added - only show on new side
              if (side === 'new') {
                for (const char of text) {
                  allParts.push({ char, changed: true });
                }
              }
            }
          }

          // Split allParts into word and trailing based on content
          const wordParts: HybridDiffPart[] = [];
          const trailingParts: HybridDiffPart[] = [];
          let inTrailing = false;

          for (const part of allParts) {
            const isWs = part.char === ' ' || part.char === '\t' || part.char === '\n' || part.char === '\r';
            if (!inTrailing && !isWs) {
              wordParts.push(part);
            } else if (!inTrailing && isWs) {
              // First whitespace - check if we have more non-ws chars ahead
              const remainingHasWord = allParts.slice(allParts.indexOf(part) + 1).some(p =>
                p.char !== ' ' && p.char !== '\t' && p.char !== '\n' && p.char !== '\r'
              );
              if (remainingHasWord) {
                wordParts.push(part); // whitespace in middle of word
              } else {
                inTrailing = true;
                trailingParts.push(part);
              }
            } else {
              trailingParts.push(part);
            }
          }

          // Mark as modified - the key point: BOTH sides show this as modified
          // even if one side only has insertions/deletions
          result.push({
            type: 'modified',
            parts: wordParts,
            trailingParts: trailingParts,
          });
        }
      } else if (pair.oldToken && !pair.newToken) {
        // Token only in old (removed) - only show on old side
        if (side === 'old') {
          const { word, trailing } = splitToken(pair.oldToken);
          result.push({
            type: 'modified',
            parts: word.split('').map(char => ({ char, changed: true })),
            trailingParts: trailing.split('').map(char => ({ char, changed: true })),
          });
        }
      } else if (!pair.oldToken && pair.newToken) {
        // Token only in new (added) - only show on new side
        if (side === 'new') {
          const { word, trailing } = splitToken(pair.newToken);
          result.push({
            type: 'modified',
            parts: word.split('').map(char => ({ char, changed: true })),
            trailingParts: trailing.split('').map(char => ({ char, changed: true })),
          });
        }
      }
    }

    // DEBUG: Log result summary
    const modifiedCount = result.filter(r => r.type === 'modified').length;
    const unchangedCount = result.filter(r => r.type === 'unchanged').length;
    console.log(`[DIFF DEBUG] side=${side}, RESULT: ${modifiedCount} modified, ${unchangedCount} unchanged tokens`);

    return result;
  }
}

/**
 * Singleton instance для использования во всем приложении
 */
export const diffCalculator = new DiffCalculator();
