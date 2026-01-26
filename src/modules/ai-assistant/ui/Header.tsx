import { Sparkles, Zap, MessageSquare, ChevronDown, ShoppingCart, AlertTriangle, Clock } from 'lucide-react';
import type { ChatInterface, TokenBalanceResponse } from '@/app/types/ai/ai.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import { Progress } from '@/shared/ui/progress';

interface HeaderProps {
  tokenBalance?: TokenBalanceResponse | null;
  chats?: ChatInterface[];
  currentChat?: ChatInterface | null;
  onSelectChat?: (chatId: string) => void;
  onPurchaseTokens?: () => void;
}

export function Header({
  tokenBalance,
  chats = [],
  currentChat,
  onSelectChat,
  onPurchaseTokens,
}: HeaderProps) {
  const { t } = useI18n();

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(0)}K`;
    }
    return tokens.toString();
  };

  const formatTimeUntilReset = (resetDate: string) => {
    const now = new Date();
    const reset = new Date(resetDate);
    const diff = reset.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}${t('AI_ASSISTANT.TOKENS.DAYS')}`;
    if (hours > 0) return `${hours}${t('AI_ASSISTANT.TOKENS.HOURS')}`;
    return t('AI_ASSISTANT.TOKENS.SOON');
  };

  const isLimitReached = tokenBalance?.limitStatus?.includes('reached');
  const isWarning = tokenBalance?.limitStatus?.includes('warning');

  return (
    <header className="relative bg-card border-b border-border rounded-xl">
      <div className="p-3 sm:p-4">
        {/* Top row: Title + Premium button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
              <Sparkles
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                strokeWidth={2.5}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">
                {t('AI_ASSISTANT.HEADER.TITLE')}
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                {t('AI_ASSISTANT.HEADER.SUBTITLE')}
              </p>
            </div>
          </div>

          {/* Premium Badge */}
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
            <Zap
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5"
              strokeWidth={2}
            />
            <span>{t('AI_ASSISTANT.HEADER.PREMIUM_ACCESS')}</span>
          </Badge>
        </div>

        {/* Bottom row: Token balance + Chat dropdown */}
        <div className="flex items-center gap-2 justify-end">
          {/* Token Balance with Popover for details */}
          {tokenBalance && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    isLimitReached
                      ? 'border-destructive text-destructive'
                      : isWarning
                      ? 'border-amber-500 text-amber-600'
                      : ''
                  }`}
                >
                  {isLimitReached ? (
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                  ) : (
                    <Zap className="w-3 h-3 text-amber-500" />
                  )}
                  <span className="text-xs">
                    {formatTokens(tokenBalance.totalAvailable)}
                  </span>
                  <Progress
                    value={100 - tokenBalance.usagePercentage}
                    className="w-16 h-1.5"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{t('AI_ASSISTANT.TOKENS.BALANCE')}</h4>
                    {tokenBalance.purchasedTokens > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{formatTokens(tokenBalance.purchasedTokens)} {t('AI_ASSISTANT.TOKENS.PURCHASED')}
                      </Badge>
                    )}
                  </div>

                  {/* Daily Limit */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('AI_ASSISTANT.TOKENS.DAILY')}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{formatTimeUntilReset(tokenBalance.dailyResetsAt)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formatTokens(tokenBalance.dailyRemaining)} / {formatTokens(tokenBalance.dailyLimit)}</span>
                      <span className={tokenBalance.dailyRemaining === 0 ? 'text-destructive' : ''}>
                        {Math.round((tokenBalance.dailyUsed / tokenBalance.dailyLimit) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(tokenBalance.dailyUsed / tokenBalance.dailyLimit) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Weekly Limit */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('AI_ASSISTANT.TOKENS.WEEKLY')}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{formatTimeUntilReset(tokenBalance.weeklyResetsAt)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formatTokens(tokenBalance.weeklyRemaining)} / {formatTokens(tokenBalance.weeklyLimit)}</span>
                      <span className={tokenBalance.weeklyRemaining === 0 ? 'text-destructive' : ''}>
                        {Math.round((tokenBalance.weeklyUsed / tokenBalance.weeklyLimit) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(tokenBalance.weeklyUsed / tokenBalance.weeklyLimit) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Monthly Limit */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('AI_ASSISTANT.TOKENS.MONTHLY')}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{formatTimeUntilReset(tokenBalance.monthlyResetsAt)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formatTokens(tokenBalance.monthlyRemaining)} / {formatTokens(tokenBalance.monthlyLimit)}</span>
                      <span className={tokenBalance.monthlyRemaining === 0 ? 'text-destructive' : ''}>
                        {Math.round(tokenBalance.usagePercentage)}%
                      </span>
                    </div>
                    <Progress
                      value={tokenBalance.usagePercentage}
                      className="h-2"
                    />
                  </div>

                  {/* Purchase More Button */}
                  <Button
                    onClick={onPurchaseTokens}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('AI_ASSISTANT.TOKENS.BUY_MORE')}
                  </Button>

                  {isLimitReached && (
                    <p className="text-xs text-muted-foreground text-center">
                      {t('AI_ASSISTANT.TOKENS.LIMIT_REACHED_HINT')}
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Chat History Dropdown */}
          {chats.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 max-w-[200px]">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {currentChat?.title || t('AI_ASSISTANT.HEADER.CHATS')}
                  </span>
                  <ChevronDown className="w-3 h-3 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {chats.slice(0, 10).map((chat) => (
                  <DropdownMenuItem
                    key={chat.id}
                    onClick={() => onSelectChat?.(chat.id)}
                    className={currentChat?.id === chat.id ? 'bg-muted' : ''}
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{chat.title}</span>
                  </DropdownMenuItem>
                ))}
                {chats.length > 10 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-muted-foreground text-xs">
                      +{chats.length - 10} {t('AI_ASSISTANT.HEADER.MORE_CHATS')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
