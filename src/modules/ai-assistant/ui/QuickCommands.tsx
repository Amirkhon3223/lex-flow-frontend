import { Zap } from 'lucide-react';
import { Card } from '@/shared/ui/card';

interface QuickCommandsProps {
  commands: string[];
  onCommandClick: (command: string) => void;
}

export function QuickCommands({ commands, onCommandClick }: QuickCommandsProps) {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
      <div className="p-6">
        <h3 className="tracking-tight mb-4">Быстрые команды</h3>
        <div className="space-y-2">
          {commands.map((action, index) => (
            <button
              key={index}
              onClick={() => onCommandClick(action)}
              className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-600 transition-all text-sm group"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-500" strokeWidth={2} />
                <span>{action}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
