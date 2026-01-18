import { MessageCircle, Phone, Mail } from 'lucide-react';
import { useI18n } from '@/shared/context/I18nContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog.tsx';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactsModal({ isOpen, onClose }: ContactsModalProps) {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('CONTACTS_MODAL.TITLE')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('CONTACTS_MODAL.DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <a
            href="https://t.me/Amirichinvoker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {t('CONTACTS_MODAL.TELEGRAM')}
              </p>
              <p className="text-sm text-muted-foreground truncate">@Amirichinvoker</p>
            </div>
          </a>

          <a
            href="tel:+12672283117"
            className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <Phone className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {t('CONTACTS_MODAL.PHONE')}
              </p>
              <p className="text-sm text-muted-foreground">+1 267 228 3117</p>
            </div>
          </a>

          <a
            href="mailto:lexflow.team@gmail.com"
            className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Mail className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {t('CONTACTS_MODAL.EMAIL')}
              </p>
              <p className="text-sm text-muted-foreground truncate">lexflow.team@gmail.com</p>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
