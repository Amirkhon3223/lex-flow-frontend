import { MessageSquare } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface CaseCommentsCardProps {
  commentsCount: number;
  onOpenComments: () => void;
}

export function CaseCommentsCard({ commentsCount, onOpenComments }: CaseCommentsCardProps) {
  const { t } = useI18n();
  return (
    <Card>
      <div>
        <div
          className="flex items-center justify-between mb-3 sm:mb-4 cursor-pointer"
          onClick={onOpenComments}
        >
          <h3 className="text-base sm:text-lg tracking-tight">{t('CASES.DETAIL.COMMENTS')}</h3>
          <Badge className="bg-blue-100 text-blue-700 border-0">{commentsCount}</Badge>
        </div>

        <Button
          variant="outline"
          className="w-full rounded-xl border-gray-200 hover:bg-gray-50 text-sm sm:text-base"
          onClick={onOpenComments}
        >
          <MessageSquare className="w-4 h-4 mr-2" strokeWidth={2} />
          {t('CASES.COMMENTS.ADD')}
        </Button>
      </div>
    </Card>
  );
}
