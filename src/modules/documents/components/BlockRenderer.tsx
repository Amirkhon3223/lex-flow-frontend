import React from 'react';
import { Image, FileText, Plus, Minus } from 'lucide-react';
import type { DocumentBlockInterface } from '@/app/types/documents/documents.interfaces';
import { cn } from '@/shared/ui/utils';
import { diffCalculator, type DiffResult } from '../utils/DiffCalculator';

interface BlockRendererProps {
  block: DocumentBlockInterface | null;
  comparisonBlock?: DocumentBlockInterface;
  side: 'old' | 'new';
  className?: string;
}

/**
 * BlockRenderer - компонент для рендеринга блоков документа с подсветкой изменений
 * Поддерживает TEXT блоки (с diff) и IMAGE блоки (placeholders)
 * После LCS alignment block может быть null для added/removed блоков
 */
export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  comparisonBlock,
  side,
  className,
}) => {
  // Если block === null, показываем placeholder (для выравнивания layout)
  if (!block) {
    return (
      <div
        className={cn(
          'p-4 rounded-lg border-2 border-dashed',
          side === 'old'
            ? 'border-green-500/20 bg-green-500/5'
            : 'border-red-500/20 bg-red-500/5',
          className
        )}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          {side === 'old' ? (
            <>
              <Plus className="h-4 w-4 text-green-500" />
              <span className="text-xs">Block added in new version</span>
            </>
          ) : (
            <>
              <Minus className="h-4 w-4 text-red-500" />
              <span className="text-xs">Block removed in new version</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // IMAGE блок - показываем placeholder
  if (block.blockType === 'IMAGE') {
    return (
      <div
        className={cn(
          'p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Image className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-semibold text-sm">[IMAGE]</div>
            <div className="text-xs text-muted-foreground">
              {block.meta?.fileName || block.meta?.imageId || 'Embedded image'}
              {block.meta?.page && ` (Page ${block.meta.page})`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TEXT блок - вычисляем diff и рендерим с подсветкой
  const oldText = side === 'old' ? (block.content || '') : (comparisonBlock?.content || '');
  const newText = side === 'new' ? (block.content || '') : (comparisonBlock?.content || '');

  let diffs: DiffResult[] = [];

  // Если есть comparisonBlock, вычисляем diff
  if (comparisonBlock?.blockType === 'TEXT') {
    diffs = diffCalculator.calculateTextDiff(oldText, newText);
  } else {
    // Если нет comparisonBlock, показываем текст как добавленный/удаленный целиком
    if (block.content) {
      diffs = [
        {
          type: side === 'new' ? 'added' : 'removed',
          text: block.content,
        },
      ];
    }
  }

  // Если нет изменений и это старая версия без пары, показываем как удаленное
  if (diffs.length === 0 && !comparisonBlock) {
    diffs = [{ type: 'removed', text: block.content || '' }];
  }

  // Если нет изменений и есть пара, показываем неизмененный текст
  if (diffs.length === 0) {
    diffs = [{ type: 'unchanged', text: block.content || '' }];
  }

  return (
    <div className={cn('p-4 rounded-lg bg-card border border-border', className)}>
      <div className="flex items-start gap-2 mb-2">
        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
        <div className="text-xs text-muted-foreground">
          Paragraph {block.meta?.paragraphIndex ?? block.orderIndex + 1}
        </div>
      </div>
      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {diffs.map((diff, idx) => (
          <span
            key={idx}
            className={cn(
              diff.type === 'added' &&
                side === 'new' &&
                'bg-green-500/20 text-green-900 dark:text-green-100',
              diff.type === 'removed' &&
                side === 'old' &&
                'bg-red-500/20 text-red-900 dark:text-red-100 line-through',
              diff.type === 'unchanged' && 'text-foreground'
            )}
          >
            {diff.text}
          </span>
        ))}
      </div>
    </div>
  );
};
