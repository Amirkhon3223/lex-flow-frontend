import { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { MessageTypeEnum } from '@/app/types/ai-assistant/ai-assistant.enums.ts';
import type { ChatMessageInterface } from '@/app/types/ai-assistant/ai-assistant.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

interface ChatAreaProps {
  chatHistory: {
    type: 'user' | 'ai';
    message: string;
    time: string;
    insights?: { type: string; text: string }[];
  }[];
  onSendMessage: (message: string) => Promise<void>;
  loading?: boolean;
  sendingMessage?: boolean;
}

export function ChatArea({ chatHistory, onSendMessage, loading, sendingMessage }: ChatAreaProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || sendingMessage) return;

    const messageToSend = message;
    setMessage('');
    await onSendMessage(messageToSend);
  };

  // Convert to ChatMessageInterface format
  const messages: ChatMessageInterface[] = chatHistory.map((chat) => ({
    type: chat.type === 'user' ? MessageTypeEnum.USER : MessageTypeEnum.AI,
    message: chat.message,
    time: chat.time,
    insights: chat.insights?.map((i) => ({
      type: i.type as 'success' | 'warning' | 'error',
      text: i.text,
    })),
  }));

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        const viewport = scrollRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
        if (viewport) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 50);
    }
  }, [chatHistory]);

  return (
    <Card className="lg:col-span-2 bg-card border-0 shadow-sm overflow-hidden relative">
      <div className="flex flex-col h-[60vh] sm:h-[70vh] md:h-[80vh] relative">
        <div className="p-3 sm:p-4 border-b border-border flex-shrink-0 bg-card sticky top-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white"
                strokeWidth={2.5}
              />
            </div>
            <div>
              <h3 className="tracking-tight text-sm sm:text-base">
                {t('AI_ASSISTANT.CHAT.TITLE')}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {sendingMessage
                  ? t('AI_ASSISTANT.CHAT.THINKING')
                  : t('AI_ASSISTANT.CHAT.STATUS')}
              </p>
            </div>
            {sendingMessage && (
              <Loader2 className="w-4 h-4 ml-auto animate-spin text-purple-500" />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-muted/30" ref={scrollRef}>
          <ScrollArea className="h-full">
            <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">
                    {t('AI_ASSISTANT.CHAT.WELCOME_TITLE')}
                  </h4>
                  <p className="text-muted-foreground text-sm max-w-md">
                    {t('AI_ASSISTANT.CHAT.WELCOME_DESCRIPTION')}
                  </p>
                </div>
              ) : (
                messages.map((chat, index) => <ChatMessage key={index} chat={chat} />)
              )}
              {sendingMessage && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t('AI_ASSISTANT.CHAT.GENERATING')}
                    </span>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-shrink-0 sticky bottom-0 z-30 bg-card border-t border-border">
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSend={handleSendMessage}
            disabled={sendingMessage}
          />
        </div>
      </div>
    </Card>
  );
}
