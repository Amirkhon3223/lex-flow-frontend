import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MessageTypeEnum, InsightTypeEnum } from '@/app/types/ai-assistant/ai-assistant.enums';
import type {
  ChatMessageProps,
} from '@/app/types/ai-assistant/ai-assistant.interfaces';

export function ChatMessage({ chat }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chat.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isUser = chat.type === MessageTypeEnum.USER;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] group`}>
        <div className={`rounded-2xl p-4 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{chat.message}</p>
          {chat.type === MessageTypeEnum.AI && chat.insights && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              {chat.insights.map((insight, idx) => (
                <div key={idx} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                  insight.type === InsightTypeEnum.SUCCESS ? 'bg-green-50 text-green-700' :
                  insight.type === InsightTypeEnum.WARNING ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {insight.type === InsightTypeEnum.SUCCESS && '✅'}
                  {insight.type === InsightTypeEnum.WARNING && '⚠️'}
                  {insight.type === InsightTypeEnum.ERROR && '❌'}
                  <span>{insight.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Время и кнопка копирования */}
        <div className={`flex items-center gap-2 mt-1 px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <p className="text-xs text-gray-400">{chat.time}</p>

          {/* Кнопка копирования */}
          <button
            onClick={handleCopy}
            className={`
              opacity-0 group-hover:opacity-100 transition-opacity
              p-1.5 rounded-lg hover:bg-gray-200
              flex items-center gap-1 text-xs cursor-pointer
              ${copied ? 'text-green-600' : 'text-gray-500'}
            `}
            title={copied ? 'Скопировано!' : 'Копировать сообщение'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="text-[10px]">Скопировано</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="text-[10px]">Копировать</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
