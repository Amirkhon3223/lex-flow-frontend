import { useState } from 'react';
import { Video, Copy, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { MeetingInterface } from '@/app/types/calendar/calendar.interfaces';
import { VideoProviderEnum } from '@/app/types/calendar/calendar.enums';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface VideoCallCardProps {
  meeting: MeetingInterface;
}

export function VideoCallCard({ meeting }: VideoCallCardProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  if (!meeting.videoLink && meeting.videoProvider !== VideoProviderEnum.JITSI) {
    return null;
  }

  const getVideoLink = (): string => {
    if (meeting.videoLink) {
      return meeting.videoLink;
    }
    if (meeting.videoProvider === VideoProviderEnum.JITSI) {
      const roomName = `lexflow-${meeting.id.replace(/-/g, '').slice(0, 12)}`;
      return `https://meet.jit.si/${roomName}`;
    }
    return '';
  };

  const videoLink = getVideoLink();

  if (!videoLink) {
    return null;
  }

  const getProviderLabel = (): string => {
    switch (meeting.videoProvider) {
      case VideoProviderEnum.JITSI:
        return t('VIDEO_CALL.JITSI');
      case VideoProviderEnum.GOOGLE_MEET:
        return t('VIDEO_CALL.GOOGLE_MEET');
      case VideoProviderEnum.ZOOM:
        return t('VIDEO_CALL.ZOOM');
      case VideoProviderEnum.CUSTOM:
        return t('VIDEO_CALL.CUSTOM');
      default:
        return t('CALENDAR.MEETING_TYPE.VIDEO');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoLink);
      setCopied(true);
      toast.success(t('VIDEO_CALL.LINK_COPIED'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('COMMON.ERRORS.COPY_FAILED'));
    }
  };

  const handleJoinCall = () => {
    window.open(videoLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
          <Video className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          {getProviderLabel()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">{t('VIDEO_CALL.MEETING_LINK')}</p>
          <p className="text-sm font-mono break-all">{videoLink}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleJoinCall}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {t('VIDEO_CALL.JOIN_CALL')}
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                {t('COMMON.COPIED')}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                {t('VIDEO_CALL.COPY_LINK')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
