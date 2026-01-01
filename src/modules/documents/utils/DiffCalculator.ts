import DiffMatchPatch from 'diff-match-patch';

export interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

/**
 * DiffCalculator - утилита для вычисления character-level diff между текстами
 * Использует библиотеку diff-match-patch от Google
 */
export class DiffCalculator {
  private dmp: DiffMatchPatch;

  constructor() {
    this.dmp = new DiffMatchPatch();
    // Настройки для более качественного diff
    this.dmp.Diff_Timeout = 1.0; // Таймаут в секундах
    this.dmp.Diff_EditCost = 4; // Стоимость редактирования
  }

  /**
   * Вычисляет character-level diff между двумя текстами
   * @param oldText - исходный текст
   * @param newText - новый текст
   * @returns массив DiffResult с подсветкой добавлений/удалений/неизмененных частей
   */
  calculateTextDiff(oldText: string, newText: string): DiffResult[] {
    // Выполняем diff
    const diffs = this.dmp.diff_main(oldText, newText);

    // Применяем semantic cleanup для более читабельного diff
    this.dmp.diff_cleanupSemantic(diffs);

    // Конвертируем в наш формат
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
    return Math.round(similarity * 10) / 10; // Округляем до 1 знака после запятой
  }

  /**
   * Подсчитывает статистику изменений
   * @param oldText - исходный текст
   * @param newText - новый текст
   * @returns объект со статистикой (added, removed, unchanged characters)
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
}

/**
 * Singleton instance для использования во всем приложении
 */
export const diffCalculator = new DiffCalculator();
