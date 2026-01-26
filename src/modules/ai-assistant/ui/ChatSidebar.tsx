import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Archive,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ChatInterface } from '@/app/types/ai/ai.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import { ScrollArea } from '@/shared/ui/scroll-area';

interface ChatSidebarProps {
  chats: ChatInterface[];
  currentChat: ChatInterface | null;
  loading: boolean;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onArchiveChat: (chatId: string) => void;
}

export function ChatSidebar({
  chats,
  currentChat,
  loading,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onArchiveChat,
}: ChatSidebarProps) {
  const { t } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const safeChats = chats || [];
  const filteredChats = safeChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChats = filteredChats.filter((chat) => !chat.isArchived);
  const archivedChats = filteredChats.filter((chat) => chat.isArchived);

  const handleDelete = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onDeleteChat(chatId);
      toast.success(t('AI_ASSISTANT.CHAT.DELETED'));
    } catch {
      toast.error(t('AI_ASSISTANT.CHAT.DELETE_ERROR'));
    }
  };

  const handleArchive = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onArchiveChat(chatId);
      toast.success(t('AI_ASSISTANT.CHAT.ARCHIVED'));
    } catch {
      toast.error(t('AI_ASSISTANT.CHAT.ARCHIVE_ERROR'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('AI_ASSISTANT.SIDEBAR.TODAY');
    if (diffDays === 1) return t('AI_ASSISTANT.SIDEBAR.YESTERDAY');
    if (diffDays < 7) return t('AI_ASSISTANT.SIDEBAR.THIS_WEEK');
    return date.toLocaleDateString();
  };

  if (isCollapsed) {
    return (
      <div className="w-10 flex flex-col items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          onClick={onNewChat}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        {activeChats.slice(0, 5).map((chat) => (
          <Button
            key={chat.id}
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${currentChat?.id === chat.id ? 'bg-purple-500/20' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="p-2 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">{t('AI_ASSISTANT.SIDEBAR.HISTORY')}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm h-9"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('AI_ASSISTANT.HEADER.NEW_CHAT')}
        </Button>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('AI_ASSISTANT.SIDEBAR.SEARCH')}
            className="pl-8 h-8 text-sm rounded-lg"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="">
        <div className="py-2">
          {loading && safeChats.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeChats.length === 0 && archivedChats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery
                ? t('AI_ASSISTANT.SIDEBAR.NO_RESULTS')
                : t('AI_ASSISTANT.SIDEBAR.NO_CHATS')}
            </div>
          ) : (
            <>
              {/* Active Chats */}
              {activeChats.length > 0 && (
                <div className="space-y-1 w-full">
                  {activeChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className={`group relative flex items-center gap-2 p-2 rounded-lg w-full cursor-pointer transition-colors ${
                        currentChat?.id === chat.id
                          ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{chat.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(chat.updatedAt)} • {chat.messageCount}{' '}
                          {t('AI_ASSISTANT.SIDEBAR.MESSAGES')}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-6 w-6 opacity-none group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="bottom" className="min-w-[140px] z-[100]">
                          <DropdownMenuItem onClick={(e) => handleArchive(chat.id, e as unknown as React.MouseEvent)}>
                            <Archive className="w-4 h-4 mr-2" />
                            {t('AI_ASSISTANT.SIDEBAR.ARCHIVE')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleDelete(chat.id, e as unknown as React.MouseEvent)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('AI_ASSISTANT.SIDEBAR.DELETE')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}

              {/* Archived Chats */}
              {archivedChats.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-medium text-muted-foreground px-2 mb-2">
                    {t('AI_ASSISTANT.SIDEBAR.ARCHIVED')}
                  </div>
                  <div className="space-y-1">
                    {archivedChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors opacity-60 ${
                          currentChat?.id === chat.id
                            ? 'bg-purple-500/20'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Archive className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{chat.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(chat.updatedAt)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => handleDelete(chat.id, e)}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
