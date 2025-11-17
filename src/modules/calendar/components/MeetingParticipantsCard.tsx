import { ParticipantItem } from '@/modules/calendar/ui/ParticipantItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MeetingParticipantsCardProps {
  participants: string[];
}

export function MeetingParticipantsCard({ participants }: MeetingParticipantsCardProps) {
  if (!participants?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base md:text-lg">Участники</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {participants.map((participant, index) => (
            <ParticipantItem key={index} name={participant} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
