import { Send } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
}

export function ChatInput({ message, setMessage, onSend }: ChatInputProps) {
  return (
    <div className="p-6 border-t border-gray-100">
      <div className="flex items-end gap-3">
        <Textarea
          placeholder="Задайте вопрос AI ассистенту..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          className="resize-none rounded-xl border-gray-200 focus-visible:ring-purple-500"
          rows={3}
        />
        <Button
          onClick={onSend}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl h-12 px-6 shadow-lg shadow-purple-500/30"
        >
          <Send className="w-4 h-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
