import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { MessageTypeEnum } from "@/app/types/ai-assistant/ai-assistant.enums.ts";
import type { ChatAreaProps } from "@/app/types/ai-assistant/ai-assistant.interfaces";
import { Card } from "@/shared/ui/card";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export function ChatArea({ chatHistory }: ChatAreaProps) {
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


  // Плавный автоскролл вниз при новом сообщении
  useEffect(() => {
    if (scrollRef.current) {
      // Небольшая задержка для обновления DOM
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
    <Card className="col-span-2 bg-white border-0 shadow-sm overflow-hidden relative">
      <div className="flex flex-col h-[80vh] relative">
        {/* Заголовок */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="tracking-tight">Юридический ассистент</h3>
              <p className="text-sm text-gray-500">Всегда онлайн</p>
            </div>
          </div>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-hidden bg-gray-50" ref={scrollRef}>
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {messages.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Поле ввода */}
        <div className="flex-shrink-0 sticky bottom-0 z-30 bg-white border-t border-gray-200">
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </Card>
  );
}
