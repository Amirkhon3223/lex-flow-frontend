import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { MessageTypeEnum } from "@/app/types/ai-assistant/ai-assistant.enums.ts";
import type { ChatAreaProps } from "@/app/types/ai-assistant/ai-assistant.interfaces";
import { useI18n } from '@/shared/context/I18nContext';
import { Card } from "@/shared/ui/card";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export function ChatArea({ chatHistory }: ChatAreaProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chatHistory);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      type: MessageTypeEnum.USER,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        const viewport = scrollRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
        if (viewport) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);
    }
  }, [messages]);

  return (
    <Card className="lg:col-span-2 bg-card border-0 shadow-sm overflow-hidden relative">
      <div className="flex flex-col h-[60vh] sm:h-[70vh] md:h-[80vh] relative">
        <div className="p-3 sm:p-4 border-b border-border flex-shrink-0 bg-card sticky top-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="tracking-tight text-sm sm:text-base">{t('AI_ASSISTANT.CHAT.TITLE')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('AI_ASSISTANT.CHAT.STATUS')}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-muted/30" ref={scrollRef}>
          <ScrollArea className="h-full">
            <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
              {messages.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-shrink-0 sticky bottom-0 z-30 bg-card border-t border-border">
          <ChatInput message={message} setMessage={setMessage} onSend={handleSendMessage} />
        </div>
      </div>
    </Card>
  );
}
