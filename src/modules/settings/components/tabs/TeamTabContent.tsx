import { useState } from 'react';
import { Users } from 'lucide-react';
import type { TeamMemberInterface } from '@/app/types/settings/settings.interfaces';
import { TeamMemberItem } from '@/modules/settings/components/TeamMemberItem';
import { InviteTeamMemberDialog } from '@/shared/components/InviteTeamMemberDialog';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

const TEAM_MEMBERS: TeamMemberInterface[] = [
  {
    name: 'Александр Иванов',
    email: 'a.ivanov@lexflow.ru',
    role: 'admin',
    status: 'Администратор',
  },
  { name: 'Мария Смирнова', email: 'm.smirnova@lexflow.ru', role: 'lawyer', status: 'Юрист' },
  { name: 'Дмитрий Петров', email: 'd.petrov@lexflow.ru', role: 'lawyer', status: 'Юрист' },
  { name: 'Елена Волкова', email: 'e.volkova@lexflow.ru', role: 'assistant', status: 'Ассистент' },
];

export function TeamTabContent() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleInvite = () => {
    setIsInviteDialogOpen(true);
  };

  const handleInviteSubmit = (data: { email: string; role: string }) => {
    console.log('Приглашение отправлено:', data);
  };

  const handleMemberSettings = (memberName: string) => {
    console.log('Настройки члена команды:', memberName);
  };

  return (
    <>
      <InviteTeamMemberDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteSubmit}
      />

      <div className="space-y-4 sm:space-y-6">
        <Card>
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-base sm:text-lg md:text-xl tracking-tight">Члены команды</h3>
              <Button
                onClick={handleInvite}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4"
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">Пригласить</span>
              </Button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {TEAM_MEMBERS.map((member, index) => (
                <TeamMemberItem key={index} member={member} onSettings={() => handleMemberSettings(member.name)} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
