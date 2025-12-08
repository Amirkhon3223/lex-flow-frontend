/**
 * @file ClientNotesCard.tsx
 * @description Карточка для отображения примечаний/описания клиента
 */

import { FileText, Edit } from 'lucide-react';
import type { ClientInterface } from '@/app/types/clients/clients.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface ClientNotesCardProps {
  client: ClientInterface;
  onEdit: () => void;
}

export function ClientNotesCard({ client, onEdit }: ClientNotesCardProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
          {t('CLIENTS.FIELDS.NOTES')}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 px-3 rounded-lg hover:bg-muted"
        >
          <Edit className="w-4 h-4 mr-1" />
          {t('COMMON.ACTIONS.EDIT')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
            {client.notes || t('CLIENTS.NO_NOTES')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
