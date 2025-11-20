import type { CompactStatCardProps } from '@/app/types/clients/clients.interfaces';
import { Card } from '@/shared/ui/card';
import { IconContainer } from '@/shared/ui/common/IconContainer';

const getIconBg = (color: string) => {
  const colorMap: Record<string, string> = {
    'text-blue-500': 'bg-blue-50',
    'text-green-500': 'bg-green-50',
    'text-purple-500': 'bg-purple-50',
    'text-orange-500': 'bg-orange-50',
    'text-red-500': 'bg-red-50',
    'text-amber-500': 'bg-amber-50',
    'text-yellow-500': 'bg-yellow-50',
    'text-muted-foreground': 'bg-muted',
  };
  return colorMap[color] || 'bg-muted';
};

export function CompactStatCard({ label, value, icon, color }: CompactStatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl tracking-tight mb-1 ${color}`}>{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
        <IconContainer
          icon={icon}
          bgColor={getIconBg(color)}
          iconColor={color}
          className="w-12 h-12 rounded-2xl"
        />
      </div>
    </Card>
  );
}
