import { Calendar, Edit, Link, Mail, MoreHorizontal, Paperclip, Share2, Tag, User } from 'lucide-react';
import { BackButton } from '@/shared/components/BackButton';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface CaseHeaderProps {
  onBack: () => void;
  onCopyLink: () => void;
  onShareEmail: () => void;
  onEdit: () => void;
  onAddDocument: () => void;
}

export function CaseHeader({ onBack, onCopyLink, onShareEmail, onEdit, onAddDocument }: CaseHeaderProps) {
  const { t } = useI18n();
  return (
    <header className="relative bg-card border-b border-border rounded-xl">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <BackButton onClick={onBack} label={t('CASES.ALL_CASES')} />

          <div className="flex items-center gap-1 sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                  <Share2 className="w-5 h-5" strokeWidth={2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onCopyLink}>
                  <Link className="w-4 h-4 mr-2" strokeWidth={2} />
                  {t('COMMON.ACTIONS.COPY_LINK')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShareEmail}>
                  <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
                  {t('COMMON.ACTIONS.SHARE_EMAIL')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                  <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" strokeWidth={2} />
                  {t('COMMON.ACTIONS.EDIT')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl tracking-tight">
                Трудовой спор - незаконное увольнение
              </h1>
              <Badge className="bg-amber-100 text-amber-700 border-0 w-fit">{t('CASES.IN_WORK')}</Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm lg:text-[15px] text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
                <span className="truncate">Иванов Петр Алексеевич</span>
              </span>
              <span className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
                {t('CASES.CATEGORIES.LABOR')}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
                <span className="hidden sm:inline">{t('CASES.FIELDS.DEADLINE')}:</span> 20 октября 2025
              </span>
            </div>
          </div>

          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md w-full lg:w-auto text-sm sm:text-base"
            onClick={onAddDocument}
          >
            <Paperclip className="w-4 h-4 mr-2" strokeWidth={2} />
            {t('DOCUMENTS.UPLOAD_DOCUMENT')}
          </Button>
        </div>
      </div>
    </header>
  );
}
