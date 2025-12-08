import { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Edit2 } from 'lucide-react';
import { useCasesStore } from '@/app/store/cases.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { Textarea } from '@/shared/ui/textarea';

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
}

export function CommentsDialog({ open, onOpenChange, caseId }: CommentsDialogProps) {
  const { t } = useI18n();

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const {
    comments,
    commentsLoading,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
  } = useCasesStore();

  useEffect(() => {
    if (open && caseId) {
      fetchComments(caseId);
    }
  }, [open, caseId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment(caseId, newComment);
    await fetchComments(caseId);
    setNewComment('');
  };

  const handleEdit = (id: string, content: string) => {
    setEditingCommentId(id);
    setEditingContent(content);
  };

  const handleUpdateComment = async (id: string) => {
    if (!editingContent.trim()) return;

    await updateComment(caseId, id, editingContent);
    await fetchComments(caseId);
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleDeleteComment = async (id: string) => {
    await deleteComment(caseId, id);
    await fetchComments(caseId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" strokeWidth={2} />
            </div>
            {t('COMMENTS.TITLE')} ({comments.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <ScrollArea className="h-[400px] pr-4">
            {commentsLoading && comments.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t('COMMON.LOADING')}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t('COMMENTS.EMPTY')}
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={comment.id}>
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-border">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                          {getInitials(comment.userName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium">{comment.userName}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        {editingCommentId === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>
                                {t('COMMON.ACTIONS.SAVE')}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingCommentId(null)}
                              >
                                {t('COMMON.ACTIONS.CANCEL')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm bg-muted/40 rounded-xl p-3">{comment.content}</p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(comment.id, comment.content)}
                                className="h-8 px-2 text-xs"
                              >
                                <Edit2 className="w-3 h-3 mr-1" />
                                {t('COMMON.ACTIONS.EDIT')}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2 text-xs text-red-600"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                {t('COMMON.ACTIONS.DELETE')}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {index < comments.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder={t('COMMENTS.ADD_PLACEHOLDER')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />

            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('COMMON.ACTIONS.CLOSE')}
              </Button>
              <Button type="submit" disabled={!newComment.trim()}>
                <Send className="w-4 h-4 mr-2" />
                {t('COMMENTS.SEND')}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
