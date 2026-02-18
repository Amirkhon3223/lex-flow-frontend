import { useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '@/shared/hooks/useSpeechToText';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';
import { cn } from '@/shared/ui/utils';

interface DictationButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
  disabled?: boolean;
  className?: string;
}

export function DictationButton({ onTranscript, language, disabled, className }: DictationButtonProps) {
  const { t, language: currentLanguage } = useI18n();
  const lang = (language || currentLanguage) as 'ru' | 'en' | 'tj';
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechToText(lang);

  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    if (transcript) {
      onTranscriptRef.current(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const tooltipText = isListening ? t('DICTATION.STOP') : t('DICTATION.START');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'relative shrink-0',
            isListening && 'text-red-500 hover:text-red-600',
            className,
          )}
          aria-label={tooltipText}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span className="absolute inset-0 rounded-md animate-ping bg-red-500/20" />
            </>
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
