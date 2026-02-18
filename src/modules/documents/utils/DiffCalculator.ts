import DiffMatchPatch from 'diff-match-patch';

export interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export interface WordDiffResult {
  type: 'added' | 'removed' | 'unchanged';
  word: string;
  trailingSpace: string;
}

export interface HybridDiffPart {
  char: string;
  changed: boolean;
}

export interface HybridWordDiff {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  parts: HybridDiffPart[];
  trailingParts: HybridDiffPart[];
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
          const trailing = oldWords[oldIdx]?.trailingSpace || newWords[newIdx]?.trailingSpace || '';
          result.push({ type: 'unchanged', word, trailingSpace: trailing });
          oldIdx++;
          newIdx++;
        } else if (operation === -1) {
          const trailing = oldWords[oldIdx]?.trailingSpace || '';
          result.push({ type: 'removed', word, trailingSpace: trailing });
          oldIdx++;
        } else if (operation === 1) {
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
    const tokenize = (text: string): string[] => {
      const tokens: string[] = [];
      const leadingWs = text.match(/^(\s+)/);
      if (leadingWs) {
        tokens.push(leadingWs[1]);
      }
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

    const oldTokensText = oldTokens.join('\x00');
    const newTokensText = newTokens.join('\x00');

    const tokenDiffs = this.dmp.diff_main(oldTokensText, newTokensText);

    this.dmp.diff_cleanupSemantic(tokenDiffs);

    type TokenPair = {
      oldToken: string | null;
      newToken: string | null;
    };
    const pairs: TokenPair[] = [];

    let tempRemoved: string[] = [];
    let tempAdded: string[] = [];

    const flushPairs = () => {
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
        flushPairs();
        for (const token of tokens) {
          pairs.push({ oldToken: token, newToken: token });
        }
      } else if (op === -1) {
        tempRemoved.push(...tokens);
      } else if (op === 1) {
        tempAdded.push(...tokens);
      }
    }
    flushPairs();

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
          const { word, trailing } = splitToken(pair.oldToken);
          result.push({
            type: 'unchanged',
            parts: word.split('').map(char => ({ char, changed: false })),
            trailingParts: trailing.split('').map(char => ({ char, changed: false })),
          });
        } else {
          const charDiffs = this.dmp.diff_main(pair.oldToken, pair.newToken);
          this.dmp.diff_cleanupSemantic(charDiffs);

          const allParts: HybridDiffPart[] = [];

          for (const [op, text] of charDiffs) {
            if (op === 0) {
              for (const char of text) {
                allParts.push({ char, changed: false });
              }
            } else if (op === -1) {
              if (side === 'old') {
                for (const char of text) {
                  allParts.push({ char, changed: true });
                }
              }
            } else if (op === 1) {
              if (side === 'new') {
                for (const char of text) {
                  allParts.push({ char, changed: true });
                }
              }
            }
          }

          const wordParts: HybridDiffPart[] = [];
          const trailingParts: HybridDiffPart[] = [];
          let inTrailing = false;

          for (const part of allParts) {
            const isWs = part.char === ' ' || part.char === '\t' || part.char === '\n' || part.char === '\r';
            if (!inTrailing && !isWs) {
              wordParts.push(part);
            } else if (!inTrailing && isWs) {
              const remainingHasWord = allParts.slice(allParts.indexOf(part) + 1).some(p =>
                p.char !== ' ' && p.char !== '\t' && p.char !== '\n' && p.char !== '\r'
              );
              if (remainingHasWord) {
                wordParts.push(part);
              } else {
                inTrailing = true;
                trailingParts.push(part);
              }
            } else {
              trailingParts.push(part);
            }
          }

          result.push({
            type: 'modified',
            parts: wordParts,
            trailingParts: trailingParts,
          });
        }
      } else if (pair.oldToken && !pair.newToken) {
        if (side === 'old') {
          const { word, trailing } = splitToken(pair.oldToken);
          result.push({
            type: 'modified',
            parts: word.split('').map(char => ({ char, changed: true })),
            trailingParts: trailing.split('').map(char => ({ char, changed: true })),
          });
        }
      } else if (!pair.oldToken && pair.newToken) {
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

    return result;
  }
}

/**
 * Singleton instance для использования во всем приложении
 */
export const diffCalculator = new DiffCalculator();
