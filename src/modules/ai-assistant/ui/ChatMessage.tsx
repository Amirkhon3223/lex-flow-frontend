import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageTypeEnum, InsightTypeEnum } from '@/app/types/ai-assistant/ai-assistant.enums';
import type { ChatMessageProps } from '@/app/types/ai-assistant/ai-assistant.interfaces';
import { useI18n } from '@/shared/context/I18nContext';

export function ChatMessage({ chat }: ChatMessageProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chat.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copy failed - silently handle
    }
  };

  const isUser = chat.type === MessageTypeEnum.USER;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[90%] sm:max-w-[80%] group`}>
        <div
          className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
            isUser ? 'bg-blue-500 text-white' : 'bg-muted text-foreground'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{chat.message}</p>
          ) : (
            <div className="markdown-content text-xs sm:text-sm leading-relaxed [&_p]:my-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:my-2.5 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-0.5 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 [&_strong]:font-semibold [&_a]:text-purple-500 [&_a]:underline">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {chat.message}
              </ReactMarkdown>
            </div>
          )}
          {chat.type === MessageTypeEnum.AI && chat.insights && (
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border space-y-1.5 sm:space-y-2">
              {chat.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 sm:gap-2 text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg ${
                    insight.type === InsightTypeEnum.SUCCESS
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : insight.type === InsightTypeEnum.WARNING
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {insight.type === InsightTypeEnum.SUCCESS && '✅'}
                  {insight.type === InsightTypeEnum.WARNING && '⚠️'}
                  {insight.type === InsightTypeEnum.ERROR && '❌'}
                  <span>{insight.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`flex items-center gap-1.5 sm:gap-2 mt-1 px-1.5 sm:px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <p className="text-xs text-muted-foreground">{chat.time}</p>
          <button
            onClick={handleCopy}
            className={`
              opacity-0 group-hover:opacity-100 transition-opacity
              p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-muted
              flex items-center gap-1 text-xs cursor-pointer
              ${copied ? 'text-green-600' : 'text-muted-foreground'}
            `}
            title={copied ? t('AI_ASSISTANT.CHAT.COPIED') : t('AI_ASSISTANT.CHAT.COPY_MESSAGE')}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                <span className="text-[10px] hidden sm:inline">
                  {t('AI_ASSISTANT.CHAT.COPIED')}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                <span className="text-[10px] hidden sm:inline">{t('AI_ASSISTANT.CHAT.COPY')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
