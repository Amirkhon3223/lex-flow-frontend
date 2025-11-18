import { FileText, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CaseCardProps } from '@/app/types/cases/cases.interfaces';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { getStatusColor } from '@/shared/utils/styleHelpers';

export function CaseCard({ caseItem }: CaseCardProps) {
  return (
    <Link
      to={`/cases/${caseItem.id}`}
      className="block rounded-xl border p-3 sm:p-4 transition-colors hover:bg-gray-50"
    >
      {/* Mobile layout (< 768px) */}
      <div className="md:hidden">
        {/* Top zone: Avatar + Title, Badge under title */}
        <div className="flex items-start gap-3 mb-2">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {caseItem.clientInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{caseItem.title}</h3>
            <Badge className={`${getStatusColor(caseItem.status)} text-xs`}>
              {caseItem.statusText}
            </Badge>
          </div>
        </div>

        {/* Category and deadline in one row */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>{caseItem.category}</span>
          <span className="font-medium">{caseItem.deadline}</span>
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-600">Прогресс</span>
            <span className="font-medium">{caseItem.progress}%</span>
          </div>
          <Progress value={caseItem.progress} className="h-1.5" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {caseItem.documents} документов.
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {caseItem.events} событий.
          </div>
          <div className={`ml-auto text-xs ${caseItem.daysLeft < 0 ? 'text-red-600' : caseItem.daysLeft < 7 ? 'text-orange-600' : 'text-gray-600'}`}>
            {caseItem.daysLeft < 0 ? `Просрочено` : `${caseItem.daysLeft} дн.`}
          </div>
        </div>
      </div>

      {/* Desktop/Tablet layout (>= 768px) */}
      <div className="hidden md:flex items-start gap-4">
        {}
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">
            {caseItem.clientInitials}
          </AvatarFallback>
        </Avatar>

        {}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
                <Badge className={getStatusColor(caseItem.status)}>
                  {caseItem.statusText}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                <span>👤 {caseItem.client}</span>
                <span>•</span>
                <span>{caseItem.category}</span>
              </div>
            </div>

            {}
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-gray-600">Дедлайн</div>
              <div className="font-medium text-gray-900">{caseItem.deadline}</div>
              <div className={`text-xs ${caseItem.daysLeft < 0 ? 'text-red-600' : caseItem.daysLeft < 7 ? 'text-orange-600' : 'text-gray-600'}`}>
                {caseItem.daysLeft < 0 ? `Просрочено на ${Math.abs(caseItem.daysLeft)} дн.` : `Осталось ${caseItem.daysLeft} дн.`}
              </div>
            </div>
          </div>

          {}
          <div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-gray-600">Прогресс:</span>
              <span className="font-medium">{caseItem.progress}%</span>
            </div>
            <Progress value={caseItem.progress} />
          </div>

          {}
          <div className="flex items-center gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {caseItem.documents} документов
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {caseItem.events} событий
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {caseItem.daysLeft < 0 ? 'Просрочено' : `${caseItem.daysLeft} дней до суда`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
