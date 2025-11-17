import type { CompactStatCardProps } from '@/app/types/clients/clients.interfaces';
import { Card } from '@/shared/ui/card';

export function CompactStatCard({ label, value, icon: Icon, color }: CompactStatCardProps) {
  const getIconBg = (color: string) => {
    const colorMap: Record<string, string> = {
      'text-blue-500': 'bg-blue-50',
      'text-green-500': 'bg-green-50',
      'text-purple-500': 'bg-purple-50',
      'text-orange-500': 'bg-orange-50',
      'text-red-500': 'bg-red-50',
      'text-amber-500': 'bg-amber-50',
      'text-yellow-500': 'bg-yellow-50',
      'text-gray-500': 'bg-gray-50',
    };
    return colorMap[color] || 'bg-gray-50';
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl tracking-tight mb-1 ${color}`}>{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
        <div className={`w-12 h-12 rounded-2xl ${getIconBg(color)} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} strokeWidth={2} />
        </div>
      </div>
    </Card>
  );
}
