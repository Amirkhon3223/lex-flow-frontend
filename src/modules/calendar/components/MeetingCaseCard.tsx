import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MeetingCaseCardProps {
  caseName: string;
}

export function MeetingCaseCard({ caseName }: MeetingCaseCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base md:text-lg">Связанное дело</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => navigate('/cases/1')}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs sm:text-sm mb-1">{caseName}</div>
              <div className="text-xs text-gray-500">Посмотреть дело →</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
