/**
 * @file CommentsDialog.tsx
 * @description Диалог для просмотра и добавления комментариев к делу
 */

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Textarea } from '@/shared/ui/textarea';
import { Separator } from '@/shared/ui/separator';
import { ScrollArea } from '@/shared/ui/scroll-area';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (comment: string) => void;
}

export function CommentsDialog({ open, onOpenChange, onSubmit }: CommentsDialogProps) {
  const [newComment, setNewComment] = useState('');

  // Mock data - в продакшене будет из API
  const comments: Comment[] = [
    {
      id: 1,
      author: 'Александр П.',
      avatar: 'АП',
      text: 'Клиент предоставил все необходимые документы. Можно начинать подготовку искового заявления.',
      date: '15 окт 2025, 14:30',
    },
    {
      id: 2,
      author: 'Вы',
      avatar: 'Я',
      text: 'Отлично! Я уже начал работу над документом. Планирую завершить черновик к концу недели.',
      date: '15 окт 2025, 16:45',
    },
    {
      id: 3,
      author: 'Александр П.',
      avatar: 'АП',
      text: 'Обратите внимание на сроки подачи - осталось всего 5 дней.',
      date: '16 окт 2025, 10:00',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onSubmit?.(newComment);
    setNewComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-2xl border-gray-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" strokeWidth={2} />
            </div>
            Комментарии ({comments.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Comments List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={comment.id}>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                      <AvatarFallback className={`${
                        comment.author === 'Вы'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      } text-white text-sm`}>
                        {comment.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium tracking-tight">{comment.author}</h4>
                        <span className="text-xs text-gray-400">{comment.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">
                        {comment.text}
                      </p>
                    </div>
                  </div>

                  {index < comments.length - 1 && <Separator className="my-4 bg-gray-100" />}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* New Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Добавьте комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] rounded-xl border-gray-200 focus-visible:ring-blue-500 resize-none"
            />

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
              >
                Закрыть
              </Button>
              <Button
                type="submit"
                disabled={!newComment.trim()}
                className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" strokeWidth={2} />
                Отправить
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
