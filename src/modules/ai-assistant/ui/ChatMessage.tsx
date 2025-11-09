import { MessageTypeEnum, InsightTypeEnum } from '@/app/types/ai-assistant/ai-assistant.enums';
import type {
  ChatMessageProps,
} from '@/app/types/ai-assistant/ai-assistant.interfaces';

export function ChatMessage({ chat }: ChatMessageProps) {
  return (
    <div
      className={`flex ${chat.type === MessageTypeEnum.USER ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] ${chat.type === MessageTypeEnum.USER ? 'order-2' : ''}`}>
        <div className={`rounded-2xl p-4 ${
          chat.type === MessageTypeEnum.USER
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
        <p className="text-xs text-gray-400 mt-1 px-2">{chat.time}</p>
      </div>
    </div>
  );
}
