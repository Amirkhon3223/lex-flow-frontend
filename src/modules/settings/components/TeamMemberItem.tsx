import { Settings } from 'lucide-react';
import type { TeamMemberInterface, TeamMemberItemProps } from '@/app/types/settings/settings.interfaces';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function TeamMemberItem({ member, onSettings }: TeamMemberItemProps) {
  const getRoleBadgeColor = (role: TeamMemberInterface['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'lawyer':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0">
          {member.name
            .split(' ')
            .map(n => n[0])
            .join('')}
        </div>
        <div className="min-w-0">
          <h4 className="tracking-tight mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base truncate">{member.name}</h4>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
        <Badge className={`border-0 text-xs ${getRoleBadgeColor(member.role)}`}>{member.status}</Badge>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg sm:rounded-xl h-7 w-7 sm:h-8 sm:w-8"
          onClick={onSettings}
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
