import { useMemo, useState } from 'react';
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { cn } from '@/shared/ui/utils.ts';

interface ChatSidebarProps {
  chats: ChatInterface[];
  currentChat: ChatInterface | null;
  loading: boolean;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onArchiveChat: (chatId: string) => Promise<void>;
}

/* ---------------- utils ---------------- */

function getDayGroup(date: Date) {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return 'week';
  return 'older';
}

/* ---------------- component ---------------- */

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
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  const filteredChats = useMemo(() => {
    return (chats ?? []).filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  }, [chats, search]);

  const grouped = useMemo(() => {
    const active = filteredChats.filter((c) => !c.isArchived);
    const archived = filteredChats.filter((c) => c.isArchived);

    const groups: Record<string, ChatInterface[]> = {
      today: [],
      yesterday: [],
      week: [],
      older: [],
    };

    active.forEach((chat) => {
      const key = getDayGroup(new Date(chat.updatedAt));
      groups[key].push(chat);
    });

    return { groups, archived };
  }, [filteredChats]);

  const handleDelete = async (id: string) => {
    try {
      await onDeleteChat(id);
      toast.success(t('AI_ASSISTANT.CHAT.DELETED'));
    } catch {
      toast.error(t('AI_ASSISTANT.CHAT.DELETE_ERROR'));
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await onArchiveChat(id);
      toast.success(t('AI_ASSISTANT.CHAT.ARCHIVED'));
    } catch {
      toast.error(t('AI_ASSISTANT.CHAT.ARCHIVE_ERROR'));
    }
  };

  /* ---------------- collapsed ---------------- */

  if (collapsed) {
    return (
      <div className="w-[56px] shrink-0 border-r flex flex-col items-center py-2 gap-2">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)}>
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={onNewChat}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('AI_ASSISTANT.HEADER.NEW_CHAT')}</TooltipContent>
        </Tooltip>

        <div className="flex-1" />

        {filteredChats.slice(0, 6).map((chat) => (
          <Tooltip key={chat.id}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onSelectChat(chat.id)}
                className={cn(currentChat?.id === chat.id && 'bg-muted')}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{chat.title}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  /* ---------------- expanded ---------------- */

  return (
    <aside className="w-[280px] shrink-0 border-r flex flex-col h-full">
      {/* Header */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">{t('AI_ASSISTANT.SIDEBAR.HISTORY')}</h2>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={onNewChat}
          className="w-full h-9 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('AI_ASSISTANT.HEADER.NEW_CHAT')}
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('AI_ASSISTANT.SIDEBAR.SEARCH')}
            className="pl-8 h-8"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overflow-x-visible">
        <div className="p-3 space-y-4">
          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading &&
            Object.entries(grouped.groups).map(
              ([key, list]) =>
                list.length > 0 && (
                  <section key={key}>
                    <div className="px-2 mb-1 text-xs font-medium text-muted-foreground">
                      {t(`AI_ASSISTANT.SIDEBAR.${key.toUpperCase()}`)}
                    </div>

                    <div className="space-y-1">
                      {list.map((chat) => (
                        <ChatRow
                          key={chat.id}
                          chat={chat}
                          active={currentChat?.id === chat.id}
                          onSelect={onSelectChat}
                          onDelete={handleDelete}
                          onArchive={handleArchive}
                        />
                      ))}
                    </div>
                  </section>
                )
            )}

          {grouped.archived.length > 0 && (
            <section>
              <div className="px-2 mb-1 text-xs font-medium text-muted-foreground">
                {t('AI_ASSISTANT.SIDEBAR.ARCHIVED')}
              </div>

              <div className="space-y-1">
                {grouped.archived.map((chat) => (
                  <ChatRow
                    key={chat.id}
                    chat={chat}
                    archived
                    active={currentChat?.id === chat.id}
                    onSelect={onSelectChat}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {!loading && filteredChats.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              {search ? t('AI_ASSISTANT.SIDEBAR.NO_RESULTS') : t('AI_ASSISTANT.SIDEBAR.NO_CHATS')}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ---------------- row ---------------- */

function ChatRow({
  chat,
  active,
  archived,
  onSelect,
  onDelete,
  onArchive,
}: {
  chat: ChatInterface;
  active: boolean;
  archived?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect(chat.id)}
      className={cn(
        'group flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer',
        active ? 'bg-muted' : 'hover:bg-muted/50'
      )}
    >
      {archived ? (
        <Archive className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
      ) : (
        <MessageSquare className="w-4 h-4 flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{chat.title}</div>
        <div className="text-xs text-muted-foreground">{chat.messageCount} сообщений</div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
          {!archived && onArchive && (
            <DropdownMenuItem onClick={() => onArchive(chat.id)}>
              <Archive className="w-4 h-4 mr-2" />
              Архивировать
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-red-600" onClick={() => onDelete(chat.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
