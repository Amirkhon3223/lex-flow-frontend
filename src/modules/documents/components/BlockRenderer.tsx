import React from 'react';
import { Image, FileText, Plus, Minus } from 'lucide-react';
import type { DocumentBlockInterface } from '@/app/types/documents/documents.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { cn } from '@/shared/ui/utils';
import { diffCalculator, type HybridWordDiff } from '../utils/DiffCalculator';

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
  const { t } = useI18n();

  if (!block) {
    return (
      <div
        className={cn(
          'p-4 rounded-lg border-2 border-dashed',
          side === 'old'
            ? 'border-green-400 bg-green-100 dark:bg-green-900/40'
            : 'border-red-400 bg-red-100 dark:bg-red-900/40',
          className
        )}
      >
        <div className="flex items-center gap-2">
          {side === 'old' ? (
            <>
              <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                {t('DOCUMENTS.BLOCKS.ADDED_IN_NEW')}
              </span>
            </>
          ) : (
            <>
              <Minus className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                {t('DOCUMENTS.BLOCKS.REMOVED_IN_NEW')}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

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
            <div className="font-semibold text-sm">{t('DOCUMENTS.BLOCKS.IMAGE_LABEL')}</div>
            <div className="text-xs text-muted-foreground">
              {block.meta?.fileName || block.meta?.imageId || t('DOCUMENTS.BLOCKS.EMBEDDED_IMAGE')}
              {block.meta?.page && ` (Page ${block.meta.page})`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For diff calculation we always need both old and new text
  // block is the current side's content, comparisonBlock is the other side
  const oldText = side === 'old' ? (block.content || '') : (comparisonBlock?.content || '');
  const newText = side === 'old' ? (comparisonBlock?.content || '') : (block.content || '');

  let hybridDiffs: HybridWordDiff[] = [];

  if (comparisonBlock?.blockType === 'TEXT') {
    hybridDiffs = diffCalculator.calculateHybridDiff(oldText, newText, side);
  } else {
    // No comparison block - mark all as modified (all chars changed)
    const content = block.content || '';
    const regex = /(\S+)(\s*)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      hybridDiffs.push({
        type: 'modified',
        parts: match[1].split('').map(char => ({ char, changed: true })),
        trailingParts: match[2].split('').map(char => ({ char, changed: true })),
      });
    }
  }

  if (hybridDiffs.length === 0 && block.content) {
    const regex = /(\S+)(\s*)/g;
    let match;
    while ((match = regex.exec(block.content)) !== null) {
      hybridDiffs.push({
        type: 'unchanged',
        parts: match[1].split('').map(char => ({ char, changed: false })),
        trailingParts: match[2].split('').map(char => ({ char, changed: false })),
      });
    }
  }

  // Neutral block styling - no colored borders/backgrounds
  const blockStyle = cn(
    'p-4 rounded-lg border-2 transition-colors bg-card border-border',
    className
  );

  return (
    <div className={blockStyle}>
      <div className="flex items-start gap-2 mb-2">
        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
        <div className="text-xs text-muted-foreground">
          {t('DOCUMENTS.BLOCKS.PARAGRAPH')} {block.meta?.paragraphIndex ?? block.orderIndex + 1}
        </div>
      </div>
      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {hybridDiffs.map((wordDiff, idx) => {
          const isModified = wordDiff.type === 'modified';
          const hasWordContent = wordDiff.parts.length > 0;

          // Word background color when modified (only for actual words, not whitespace-only tokens)
          const wordStyle = isModified && hasWordContent
            ? {
                backgroundColor: side === 'old'
                  ? 'rgba(239, 68, 68, 0.3)'  // red
                  : 'rgba(34, 197, 94, 0.3)', // green
                borderRadius: '2px',
                padding: '0 2px',
              }
            : {};

          // Group consecutive chars by their changed status for cleaner rendering
          const charGroups: { text: string; changed: boolean }[] = [];
          for (const part of wordDiff.parts) {
            const lastGroup = charGroups[charGroups.length - 1];
            if (lastGroup && lastGroup.changed === part.changed) {
              lastGroup.text += part.char;
            } else {
              charGroups.push({ text: part.char, changed: part.changed });
            }
          }

          // Group trailing whitespace chars by changed status
          const trailingGroups: { text: string; changed: boolean }[] = [];
          for (const part of wordDiff.trailingParts) {
            const lastGroup = trailingGroups[trailingGroups.length - 1];
            if (lastGroup && lastGroup.changed === part.changed) {
              lastGroup.text += part.char;
            } else {
              trailingGroups.push({ text: part.char, changed: part.changed });
            }
          }

          return (
            <span key={idx}>
              <span style={wordStyle}>
                {charGroups.map((group, groupIdx) => {
                  if (group.changed) {
                    // Changed characters get extra highlight
                    const charClass = side === 'old'
                      ? 'bg-red-500 dark:bg-red-500 text-white font-semibold'
                      : 'bg-green-500 dark:bg-green-500 text-white font-semibold';
                    return (
                      <span key={groupIdx} className={charClass}>
                        {group.text}
                      </span>
                    );
                  }
                  // Unchanged characters - just text, inherits word background
                  return <React.Fragment key={groupIdx}>{group.text}</React.Fragment>;
                })}
              </span>
              {/* Render trailing whitespace with potential highlighting */}
              {trailingGroups.map((group, groupIdx) => {
                if (group.changed) {
                  // Changed whitespace gets highlight (visible as colored background)
                  const spaceClass = side === 'old'
                    ? 'bg-red-400 dark:bg-red-400'
                    : 'bg-green-400 dark:bg-green-400';
                  return (
                    <span key={`trail-${groupIdx}`} className={spaceClass}>
                      {group.text}
                    </span>
                  );
                }
                return <React.Fragment key={`trail-${groupIdx}`}>{group.text}</React.Fragment>;
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
};
