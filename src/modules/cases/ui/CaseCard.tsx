import { FileText, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CaseCardProps } from '@/app/types/cases/cases.interfaces';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'urgent':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export function CaseCard({ caseItem }: CaseCardProps) {
  return (
    <Link
      to={`/cases/${caseItem.id}`}
      className="block rounded-lg border p-4 transition-colors hover:bg-gray-50"
    >
      <div className="flex items-start gap-4">
        {}
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-blue-600 text-white">
            {caseItem.clientInitials}
          </AvatarFallback>
        </Avatar>

        {}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
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
            <div className="text-right">
              <div className="text-sm text-gray-600">Дедлайн</div>
              <div className="font-medium text-gray-900">{caseItem.deadline}</div>
              <div className={`text-xs ${caseItem.daysLeft < 0 ? 'text-red-600' : caseItem.daysLeft < 7 ? 'text-orange-600' : 'text-gray-600'}`}>
                {caseItem.daysLeft < 0 ? `Просрочено на ${Math.abs(caseItem.daysLeft)} дн.` : `Осталось ${caseItem.daysLeft} дн.`}
              </div>
            </div>
          </div>

          {}
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Прогресс</span>
              <span className="font-medium">{caseItem.progress}%</span>
            </div>
            <Progress value={caseItem.progress} />
          </div>

          {}
          <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
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
