import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button.tsx';
import { ContactsModal } from '@/modules/auth/widgets/contacts-modal.tsx';
import { ROUTES } from '@/app/config/routes.config';
import { useI18n } from '@/shared/context/I18nContext';

export function PageFooter() {
  const { t } = useI18n();
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);

  const handleHelpClick = () => {
    window.open('https://t.me/Amirichinvoker', '_blank');
  };

  const handleContactsClick = () => {
    setIsContactsModalOpen(true);
  };

  return (
    <div className="text-center mt-6 sm:mt-8">
      <p className="text-xs sm:text-sm text-slate-600">
        {t('AUTH_FOOTER.COPYRIGHT', { year: '2026' })}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-2.5 sm:mt-3">
        <Button
          variant="ghost"
          className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2"
          onClick={handleHelpClick}
        >
          {t('AUTH_FOOTER.HELP')}
        </Button>
        <Button
          variant="ghost"
          className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2"
          onClick={handleContactsClick}
        >
          {t('AUTH_FOOTER.CONTACTS')}
        </Button>
        <Link to={ROUTES.PRIVACY_POLICY}>
          <Button
            variant="ghost"
            className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2"
          >
            {t('AUTH_FOOTER.PRIVACY')}
          </Button>
        </Link>
      </div>

      <ContactsModal
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
      />
    </div>
  );
}
