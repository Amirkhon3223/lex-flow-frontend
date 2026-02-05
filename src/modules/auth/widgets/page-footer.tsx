import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { ContactsModal } from '@/modules/auth/widgets/contacts-modal.tsx';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button.tsx';

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
    <footer
      className="text-center mt-6 sm:mt-8"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <p className="text-xs sm:text-sm text-slate-600">
        <span itemProp="name">LexFlow</span> - {t('AUTH_FOOTER.COPYRIGHT', { year: new Date().getFullYear() })}
      </p>
      <nav
        className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-2.5 sm:mt-3"
        aria-label="Footer navigation"
      >
        <Button
          variant="ghost"
          className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2"
          onClick={handleHelpClick}
          aria-label="Get help via Telegram"
        >
          {t('AUTH_FOOTER.HELP')}
        </Button>
        <Button
          variant="ghost"
          className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2"
          onClick={handleContactsClick}
          aria-label="View contact information"
        >
          {t('AUTH_FOOTER.CONTACTS')}
        </Button>
        <Link to={ROUTES.PRIVACY_POLICY} aria-label="View privacy policy">
          <Button
            variant="ghost"
            className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 h-auto py-1 sm:py-2"
          >
            {t('AUTH_FOOTER.PRIVACY')}
          </Button>
        </Link>
      </nav>
      <meta itemProp="url" content="https://lexflow.app" />
      <link itemProp="sameAs" href="https://twitter.com/lexflowapp" />

      <ContactsModal
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
      />
    </footer>
  );
}
