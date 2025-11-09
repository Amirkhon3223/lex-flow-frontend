import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type {
  ChatAreaProps,
} from '@/app/types/ai-assistant/ai-assistant.interfaces';
import { Card } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

export function ChatArea({ chatHistory }: ChatAreaProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {

      setMessage('');
    }
  };

  return (
    <Card className="col-span-2 bg-white border-0 shadow-sm">
      <div className="flex flex-col h-[600px]">
        {}
        <div className="p-6 border-b border-gray-100">
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

        {}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>
        </ScrollArea>

        {}
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
        />
      </div>
    </Card>
  );
}
