import { Users } from 'lucide-react';
import type { TeamMemberInterface } from '@/app/types/settings/settings.interfaces';
import { TeamMemberItem } from '@/modules/settings/components/TeamMemberItem';
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
  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl tracking-tight">Члены команды</h3>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
              <Users className="w-4 h-4 mr-2" strokeWidth={2} />
              Пригласить
            </Button>
          </div>

          <div className="space-y-3">
            {TEAM_MEMBERS.map((member, index) => (
              <TeamMemberItem key={index} member={member} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
