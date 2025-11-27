import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { useI18n } from '@/shared/context/I18nContext';

interface QuickActionsProps {
  onAddClient?: () => void;
  onAddCase?: () => void;
  onUploadDocument?: () => void;
}

export function QuickActions({ onAddClient, onAddCase, onUploadDocument }: QuickActionsProps) {
  const { t } = useI18n();

  return (
    <Card>
      <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">{t('DASHBOARD.QUICK_ACTIONS.TITLE')}</h3>

      <div className="space-y-2">
          <Button
            className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3"
            onClick={onAddClient}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
            {t('DASHBOARD.QUICK_ACTIONS.NEW_CLIENT')}
          </Button>
          <Button
            className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3"
            onClick={onAddCase}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
            {t('DASHBOARD.QUICK_ACTIONS.NEW_CASE')}
          </Button>
          <Button
            className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3"
            onClick={onUploadDocument}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
            {t('DASHBOARD.QUICK_ACTIONS.UPLOAD_DOCUMENT')}
          </Button>
        </div>
    </Card>
  );
}
