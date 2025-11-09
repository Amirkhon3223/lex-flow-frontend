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
    <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
      <div className="p-6">
        <h3 className="text-lg tracking-tight mb-4">Быстрые действия</h3>

        <div className="space-y-2">
          <Button
            className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer"
            onClick={onAddClient}
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
            Новый клиент
          </Button>
          <Button
            className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer"
            onClick={onAddCase}
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
            Новое дело
          </Button>
          <Button
            className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border-0 rounded-xl cursor-pointer"
            onClick={onUploadDocument}
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
            Загрузить документ
          </Button>
        </div>
      </div>
    </Card>
  );
}
