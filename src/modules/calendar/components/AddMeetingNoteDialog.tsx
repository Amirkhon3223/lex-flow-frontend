import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Textarea } from '@/shared/ui/textarea';

interface AddMeetingNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentNotes?: string | null;
  onSave: (notes: string) => Promise<void>;
}

export function AddMeetingNoteDialog({
  open,
  onOpenChange,
  currentNotes,
  onSave,
}: AddMeetingNoteDialogProps) {
  const { t } = useI18n();
  const [notes, setNotes] = useState(currentNotes || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNotes(currentNotes || '');
    }
  }, [open, currentNotes]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(notes);
      toast.success(t('COMMON.MESSAGES.SUCCESS'));
      onOpenChange(false);
    } catch (error) {
      toast.error(t('COMMON.MESSAGES.ERROR'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-background border-border shadow-2xl rounded-2xl sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl tracking-tight">
            {t('CALENDAR.MEETING_DETAILS.NOTES')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {t('CALENDAR.MEETING_DETAILS.ADD_NOTE')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('CALENDAR.FORMS.DESCRIPTION_PLACEHOLDER')}
            className="min-h-[200px] rounded-xl border-input focus-visible:ring-blue-500 resize-none"
          />

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 sm:h-11 rounded-xl border-input hover:bg-muted"
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex-1 h-10 sm:h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
            >
              {loading ? t('COMMON.LOADING') : t('COMMON.ACTIONS.SAVE')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
