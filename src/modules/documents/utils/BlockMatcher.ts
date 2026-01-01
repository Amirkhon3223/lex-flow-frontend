import type { DocumentBlockInterface } from '@/app/types/documents/documents.interfaces';
import { diffCalculator } from './DiffCalculator';

export interface AlignedBlockPair {
  block1: DocumentBlockInterface | null;
  block2: DocumentBlockInterface | null;
  matchType: 'matched' | 'added' | 'removed' | 'modified';
}

/**
 * BlockMatcher - использует LCS (Longest Common Subsequence) алгоритм
 * для правильного выравнивания блоков между двумя версиями документа
 *
 * Проблема без LCS:
 * V1: [A, B, C]
 * V2: [A, X, B, C]
 * Простое сравнение по индексу: A<->A ✓, B<->X ✗, C<->B ✗
 *
 * С LCS:
 * V1: [A, B, C]
 * V2: [A, X, B, C]
 * Результат: A<->A ✓, null<->X (added), B<->B ✓, C<->C ✓
 */
export class BlockMatcher {
  /**
   * Выравнивает два массива блоков используя LCS алгоритм
   */
  alignBlocks(
    blocks1: DocumentBlockInterface[],
    blocks2: DocumentBlockInterface[]
  ): AlignedBlockPair[] {
    if (blocks1.length === 0 && blocks2.length === 0) {
      return [];
    }

    if (blocks1.length === 0) {
      return blocks2.map((block) => ({
        block1: null,
        block2: block,
        matchType: 'added' as const,
      }));
    }

    if (blocks2.length === 0) {
      return blocks1.map((block) => ({
        block1: block,
        block2: null,
        matchType: 'removed' as const,
      }));
    }

    // 1. Build LCS matrix
    const lcsMatrix = this.buildLCSMatrix(blocks1, blocks2);

    // 2. Backtrack to find aligned pairs
    const alignedPairs = this.backtrack(lcsMatrix, blocks1, blocks2);

    return alignedPairs;
  }

  /**
   * Построение LCS matrix динамическим программированием
   * dp[i][j] = длина LCS для blocks1[0..i-1] и blocks2[0..j-1]
   */
  private buildLCSMatrix(
    blocks1: DocumentBlockInterface[],
    blocks2: DocumentBlockInterface[]
  ): number[][] {
    const m = blocks1.length;
    const n = blocks2.length;

    // Защита от OOM: ограничиваем размер матрицы
    const MAX_SIZE = 5000;
    if (m > MAX_SIZE || n > MAX_SIZE) {
      throw new Error(
        `Document too large for comparison: ${m}×${n} blocks (max ${MAX_SIZE}×${MAX_SIZE}). ` +
        `Please try comparing smaller sections of the document.`
      );
    }

    const dp: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (this.blocksMatch(blocks1[i - 1], blocks2[j - 1])) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    return dp;
  }

  /**
   * Backtracking для построения aligned pairs из LCS matrix
   */
  private backtrack(
    dp: number[][],
    blocks1: DocumentBlockInterface[],
    blocks2: DocumentBlockInterface[]
  ): AlignedBlockPair[] {
    const pairs: AlignedBlockPair[] = [];
    let i = blocks1.length;
    let j = blocks2.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && this.blocksMatch(blocks1[i - 1], blocks2[j - 1])) {
        // Matched pair
        const similarity = this.calculateSimilarity(blocks1[i - 1], blocks2[j - 1]);
        pairs.unshift({
          block1: blocks1[i - 1],
          block2: blocks2[j - 1],
          matchType: similarity > 0.95 ? 'matched' : 'modified',
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        // Block added in version 2
        pairs.unshift({
          block1: null,
          block2: blocks2[j - 1],
          matchType: 'added',
        });
        j--;
      } else {
        // Block removed from version 1
        pairs.unshift({
          block1: blocks1[i - 1],
          block2: null,
          matchType: 'removed',
        });
        i--;
      }
    }

    return pairs;
  }

  /**
   * Проверяет, совпадают ли два блока (для LCS)
   * Используется более мягкий критерий, чем точное совпадение
   */
  private blocksMatch(block1: DocumentBlockInterface, block2: DocumentBlockInterface): boolean {
    // Разные типы блоков - не совпадают
    if (block1.blockType !== block2.blockType) {
      return false;
    }

    // IMAGE блоки - сравниваем по meta
    if (block1.blockType === 'IMAGE') {
      return (
        block1.meta?.imageId === block2.meta?.imageId ||
        block1.meta?.fileName === block2.meta?.fileName
      );
    }

    // TEXT блоки
    if (block1.blockType === 'TEXT') {
      // DOCX-эвристика: если paragraphIndex совпадает → считаем тем же блоком
      if (
        block1.meta?.paragraphIndex !== undefined &&
        block2.meta?.paragraphIndex !== undefined &&
        block1.meta.paragraphIndex === block2.meta.paragraphIndex
      ) {
        return true;
      }

      // Иначе используем адаптивный порог similarity
      const text1 = block1.content || '';
      const text2 = block2.content || '';
      const avgLength = (text1.length + text2.length) / 2;
      const threshold = this.getAdaptiveThreshold(avgLength);

      const similarity = this.calculateSimilarity(block1, block2);
      return similarity > threshold;
    }

    return false;
  }

  /**
   * Возвращает адаптивный порог similarity в зависимости от длины текста
   * Короткие тексты требуют более низкий порог для распознавания изменений
   */
  private getAdaptiveThreshold(textLength: number): number {
    if (textLength < 50) {
      return 0.4; // 40% для очень коротких текстов (напр. заголовков)
    } else if (textLength < 200) {
      return 0.6; // 60% для коротких абзацев
    } else {
      return 0.7; // 70% для нормальных абзацев
    }
  }

  /**
   * Вычисляет similarity между двумя TEXT блоками (0.0 - 1.0)
   */
  private calculateSimilarity(
    block1: DocumentBlockInterface,
    block2: DocumentBlockInterface
  ): number {
    if (block1.blockType !== 'TEXT' || block2.blockType !== 'TEXT') {
      return 0;
    }

    const text1 = block1.content || '';
    const text2 = block2.content || '';

    if (text1 === text2) {
      return 1.0;
    }

    if (text1.length === 0 && text2.length === 0) {
      return 1.0;
    }

    if (text1.length === 0 || text2.length === 0) {
      return 0;
    }

    return diffCalculator.calculateSimilarity(text1, text2) / 100;
  }
}

/**
 * Singleton instance
 */
export const blockMatcher = new BlockMatcher();
