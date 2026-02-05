/**
 * @file TemplateCard.tsx
 * @description Card component for displaying a document template
 */

import { memo } from 'react';
import {
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileOutput,
  Calendar,
  User,
  Hash,
} from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import type { TemplateCardProps } from '@/app/types/templates/templates.types';
import { TemplateCategoryEnum, TemplateStatusEnum } from '@/app/types/templates/templates.types';

const categoryColors: Record<TemplateCategoryEnum, string> = {
  [TemplateCategoryEnum.LAWSUIT]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  [TemplateCategoryEnum.CONTRACT]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [TemplateCategoryEnum.STATEMENT]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [TemplateCategoryEnum.LETTER]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  [TemplateCategoryEnum.POWER_OF_ATTORNEY]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const statusColors: Record<TemplateStatusEnum, string> = {
  [TemplateStatusEnum.DRAFT]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  [TemplateStatusEnum.ACTIVE]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  [TemplateStatusEnum.ARCHIVED]: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export const TemplateCard = memo(function TemplateCard({
  template,
  onEdit,
  onDelete,
  onGenerate,
  onPreview,
}: TemplateCardProps) {
  const { t } = useI18n();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryLabel = (category: TemplateCategoryEnum) => {
    const labels: Record<TemplateCategoryEnum, string> = {
      [TemplateCategoryEnum.LAWSUIT]: t('TEMPLATES.CATEGORIES.LAWSUIT'),
      [TemplateCategoryEnum.CONTRACT]: t('TEMPLATES.CATEGORIES.CONTRACT'),
      [TemplateCategoryEnum.STATEMENT]: t('TEMPLATES.CATEGORIES.STATEMENT'),
      [TemplateCategoryEnum.LETTER]: t('TEMPLATES.CATEGORIES.LETTER'),
      [TemplateCategoryEnum.POWER_OF_ATTORNEY]: t('TEMPLATES.CATEGORIES.POWER_OF_ATTORNEY'),
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status: TemplateStatusEnum) => {
    const labels: Record<TemplateStatusEnum, string> = {
      [TemplateStatusEnum.DRAFT]: t('TEMPLATES.STATUS.DRAFT'),
      [TemplateStatusEnum.ACTIVE]: t('TEMPLATES.STATUS.ACTIVE'),
      [TemplateStatusEnum.ARCHIVED]: t('TEMPLATES.STATUS.ARCHIVED'),
    };
    return labels[status] || status;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-blue-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
              <FileText className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">{template.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {template.description || t('TEMPLATES.NO_DESCRIPTION')}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onPreview?.(template)}>
                <Eye className="w-4 h-4 mr-2" />
                {t('COMMON.ACTIONS.PREVIEW')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onGenerate?.(template)}>
                <FileOutput className="w-4 h-4 mr-2" />
                {t('TEMPLATES.GENERATE')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit?.(template)}>
                <Edit className="w-4 h-4 mr-2" />
                {t('COMMON.ACTIONS.EDIT')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(template)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('COMMON.ACTIONS.DELETE')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={categoryColors[template.category]} variant="secondary">
            {getCategoryLabel(template.category)}
          </Badge>
          <Badge className={statusColors[template.status]} variant="secondary">
            {getStatusLabel(template.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="w-4 h-4" />
            <span>
              {template.variables.length} {t('TEMPLATES.VARIABLES_COUNT')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileOutput className="w-4 h-4" />
            <span>
              {template.usageCount} {t('TEMPLATES.USES')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="truncate">{template.createdByName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(template.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg"
            onClick={() => onPreview?.(template)}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            {t('COMMON.ACTIONS.PREVIEW')}
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => onGenerate?.(template)}
          >
            <FileOutput className="w-4 h-4 mr-1.5" />
            {t('TEMPLATES.GENERATE')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

TemplateCard.displayName = 'TemplateCard';
