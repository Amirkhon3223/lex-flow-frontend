import { useRef, useEffect, useState } from 'react';
import { Send, Paperclip, Mic, X } from 'lucide-react';
import { toast } from 'sonner';
import type {
  ChatInputProps,
  SpeechRecognitionInstance,
} from '@/app/types/ai-assistant/ai-assistant.interfaces';
import {
  createSpeechRecognition,
  setupSpeechRecognitionCallbacks,
  startSpeechRecognition,
  stopSpeechRecognition,
  cleanupSpeechRecognition,
  isSpeechRecognitionSupported,
} from '@/app/utils/speechRecognition';
import { useI18n } from '@/shared/context/I18nContext';

interface ExtendedChatInputProps extends ChatInputProps {
  disabled?: boolean;
}

export function ChatInput({ message, setMessage, onSend, disabled: _disabled }: ExtendedChatInputProps) {
  const { t } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseMessageRef = useRef<string>('');
  const [interimText, setInterimText] = useState<string>('');

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, window.innerHeight * 0.4);
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  useEffect(() => {
    recognitionRef.current = createSpeechRecognition({
      lang: 'ru-RU',
      continuous: true,
      interimResults: true,
    });

    if (recognitionRef.current) {
      setupSpeechRecognitionCallbacks(recognitionRef.current, {
        onResult: (transcript: string, isFinal: boolean) => {
          if (isFinal) {
            const finalText =
              baseMessageRef.current + (baseMessageRef.current ? ' ' : '') + transcript.trim();
            setMessage(finalText);
            baseMessageRef.current = finalText;
            setInterimText('');
          } else {
            setInterimText(transcript.trim());
          }
        },
        onError: (_error: string) => {
          setIsRecording(false);
          setInterimText('');
        },
        onEnd: () => {
          setIsRecording(false);
          setInterimText('');
        },
      });
    }

    return () => {
      cleanupSpeechRecognition(recognitionRef.current);
    };
  }, [setMessage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
    e.target.value = '';
  };

  const handleSend = () => {
    if (!message.trim() && !files.length) return;
    onSend();
    setMessage('');
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = '40px';
  };

  const handleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      toast.error(t('AI_ASSISTANT.CHAT.VOICE_UNAVAILABLE'), {
        description: t('AI_ASSISTANT.CHAT.VOICE_BROWSER_ERROR'),
      });
      return;
    }

    if (isRecording) {
      stopSpeechRecognition(recognitionRef.current);
      setIsRecording(false);
      setInterimText('');
    } else {
      baseMessageRef.current = message;
      setInterimText('');
      const started = startSpeechRecognition(recognitionRef.current);
      if (started) {
        setIsRecording(true);
      }
    }
  };

  const isDisabled = !message.trim() && !files.length;

  return (
    <div className="px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4 bg-card relative z-10">
      {!!files.length && (
        <div className="mb-2 flex flex-wrap gap-1.5 sm:gap-2 animate-fadeIn">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-muted rounded-md sm:rounded-lg text-xs shadow-sm"
            >
              <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              <span className="text-foreground truncate max-w-[100px] sm:max-w-[150px]">
                {file.name}
              </span>
              <button
                onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2 bg-muted/50 rounded-xl sm:rounded-2xl border border-input focus-within:border-purple-400 transition-all duration-200 shadow-md">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            placeholder={interimText ? '' : t('AI_ASSISTANT.CHAT.MESSAGE_PLACEHOLDER')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="chat-textarea w-full bg-transparent pl-3 sm:pl-4 pr-20 sm:pr-24 md:pr-28 py-2 sm:py-2.5 md:py-3 outline-none resize-none min-h-[36px] sm:min-h-[40px] max-h-[35vh] sm:max-h-[45vh] overflow-y-auto text-xs sm:text-sm leading-relaxed transition-all"
            rows={1}
          />
          {interimText && (
            <div className="absolute inset-0 pl-3 sm:pl-4 pr-20 sm:pr-24 md:pr-28 py-2 sm:py-2.5 md:py-3 pointer-events-none text-xs sm:text-sm leading-relaxed overflow-hidden">
              <span className="invisible">{message}</span>
              <span className="text-muted-foreground">
                {message ? ' ' : ''}
                {interimText}
              </span>
            </div>
          )}
        </div>

        <div className="absolute right-1.5 sm:right-2 bottom-1 sm:bottom-1.5 flex items-center gap-0.5 sm:gap-1">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 sm:p-2 hover:bg-muted rounded-md sm:rounded-lg transition-colors cursor-pointer"
            type="button"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </button>

          <button
            onClick={handleVoiceInput}
            className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-colors cursor-pointer ${
              isRecording ? 'bg-destructive/10 hover:bg-destructive/20' : 'hover:bg-muted'
            }`}
            type="button"
          >
            <Mic
              className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecording ? 'text-destructive' : 'text-muted-foreground'}`}
            />
          </button>

          <button
            onClick={handleSend}
            disabled={isDisabled}
            className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${
              isDisabled
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-500/30 cursor-pointer'
            }`}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
