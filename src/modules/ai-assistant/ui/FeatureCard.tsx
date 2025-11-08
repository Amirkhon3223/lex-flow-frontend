import { LucideIcon } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  count: string;
}

export function FeatureCard({ icon: Icon, title, description, gradient, count }: FeatureCardProps) {
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="p-5">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <h3 className="tracking-tight mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
          {count}
        </Badge>
      </div>
    </Card>
  );
}
