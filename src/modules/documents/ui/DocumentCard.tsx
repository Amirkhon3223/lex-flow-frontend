import { FileText, Star, FolderOpen, User, Tag, History, MoreHorizontal, Eye, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DocumentCardProps } from '@/app/types/documents/documents.interfaces';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { StatusBadge } from './StatusBadge';

export function DocumentCard({
  id,
  title,
  case: caseName,
  author,
  type,
  size,
  date,
  versions,
  status,
  favorite,
}: DocumentCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/documents/${id}/versions`);
  };

  const handleOpenDocument = () => {
    navigate(`/documents/${id}/versions`);
  };

  return (
    <Card
      className="hover:shadow-md transition-all group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="tracking-tight truncate text-sm">{title}</h3>
              {favorite && (
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" strokeWidth={2} />
              )}
            </div>
            <StatusBadge status={status} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenDocument(); }}>
                <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                Открыть
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                Скачать
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <FolderOpen className="w-3 h-3" strokeWidth={2} />
            <span className="truncate max-w-[120px]">{caseName}</span>
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" strokeWidth={2} />
            <span className="truncate max-w-[100px]">{author}</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{size}</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted">
            <History className="w-3 h-3" strokeWidth={2} />
            <span>{versions} верс.</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-7 h-7 text-blue-600" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="tracking-tight truncate">{title}</h3>
            {favorite && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" strokeWidth={2} />
            )}
            <StatusBadge status={status} />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" strokeWidth={2} />
              {caseName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" strokeWidth={2} />
              {author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" strokeWidth={2} />
              {type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="text-right">
            <div className="text-foreground mb-0.5">{size}</div>
            <div className="text-xs">{date}</div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted">
            <History className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="text-xs">{versions} версий</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenDocument(); }}>
                <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                Открыть
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                Скачать
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
