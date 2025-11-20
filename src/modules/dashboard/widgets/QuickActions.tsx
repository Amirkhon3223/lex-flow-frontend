import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface QuickActionsProps {
  onAddClient?: () => void;
  onAddCase?: () => void;
  onUploadDocument?: () => void;
}

export function QuickActions({ onAddClient, onAddCase, onUploadDocument }: QuickActionsProps) {
  return (
    <Card>
      <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">Быстрые действия</h3>

      <div className="space-y-2">
        <Button
          className="w-full justify-start bg-muted/50 hover:bg-muted text-foreground border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3"
          onClick={onAddClient}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
          Новый клиент
        </Button>
        <Button
          className="w-full justify-start bg-muted/50 hover:bg-muted text-foreground border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3"
          onClick={onAddCase}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
          Новое дело
        </Button>
        <Button
          className="w-full justify-start bg-muted/50 hover:bg-muted text-foreground border-0 rounded-xl cursor-pointer text-sm sm:text-base py-2.5 sm:py-3"
          onClick={onUploadDocument}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" strokeWidth={2} />
          Загрузить документ
        </Button>
      </div>
    </Card>
  );
}
