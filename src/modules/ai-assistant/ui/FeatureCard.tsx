import type { LucideIcon } from 'lucide-react';
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
    <Card className="hover:shadow-md transition-all cursor-pointer group">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
      </div>
      <h3 className="tracking-tight mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">{title}</h3>
      <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{description}</p>
      <Badge className="bg-muted text-muted-foreground border-0 text-xs">{count}</Badge>
    </Card>
  );
}
