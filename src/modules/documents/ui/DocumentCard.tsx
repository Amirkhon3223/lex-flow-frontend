import { FileText, Star, FolderOpen, User, Tag, History, MoreHorizontal, Eye, Download, Trash2 } from 'lucide-react';
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
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="p-5">
        <div className="flex items-center gap-4">
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

            <div className="flex items-center gap-4 text-sm text-gray-500">
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

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="text-right">
              <div className="text-gray-900 mb-0.5">{size}</div>
              <div className="text-xs">{date}</div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100">
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
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                  Открыть
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                  Скачать
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
