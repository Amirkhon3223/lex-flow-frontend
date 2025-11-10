import { Settings } from 'lucide-react';
import type { TeamMemberInterface, TeamMemberItemProps } from '@/app/types/settings/settings.interfaces';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function TeamMemberItem({ member, onSettings }: TeamMemberItemProps) {
  const getRoleBadgeColor = (role: TeamMemberInterface['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'lawyer':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h4 className="tracking-tight mb-1">{member.name}</h4>
          <p className="text-sm text-gray-500">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={`border-0 ${getRoleBadgeColor(member.role)}`}>
          {member.status}
        </Badge>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={onSettings}>
          <Settings className="w-4 h-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
