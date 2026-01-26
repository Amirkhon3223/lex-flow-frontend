import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Server, Brain, Lock, Users, Bell, Cookie, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { LanguageSelectorPublic } from '@/shared/components/LanguageSelectorPublic.tsx';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button.tsx';

interface PrivacySection {
  title: string;
  text?: string;
  items?: string[];
  highlight?: boolean;
}

const sectionIcons: Record<number, React.ElementType> = {
  1: Shield,
  2: FileText,
  3: Users,
  4: Brain,
  5: Server,
  6: Server,
  7: Lock,
  8: FileText,
  9: Users,
  10: Lock,
  11: Bell,
  12: Cookie,
  13: FileText,
  14: Mail,
};

export default function PrivacyPolicyPage() {
  const { t, language } = useI18n();

  const getTranslations = () => {
    switch (language) {
      case 'en':
        return import('@/assets/i18n/en.json');
      case 'tj':
        return import('@/assets/i18n/tj.json');
      default:
        return import('@/assets/i18n/ru.json');
    }
  };

  const [privacyData, setPrivacyData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    getTranslations().then((data) => {
      setPrivacyData(data.default.PRIVACY_POLICY || data.PRIVACY_POLICY);
    });
  }, [language]);

  if (!privacyData) {
    return null;
  }

  // Dynamically get all sections
  const sections: PrivacySection[] = [];
  let sectionNum = 1;
  while (privacyData[`SECTION_${sectionNum}_TITLE`]) {
    sections.push({
      title: privacyData[`SECTION_${sectionNum}_TITLE`] as string,
      text: privacyData[`SECTION_${sectionNum}_TEXT`] as string | undefined,
      items: privacyData[`SECTION_${sectionNum}_ITEMS`] as string[] | undefined,
      highlight: privacyData[`SECTION_${sectionNum}_HIGHLIGHT`] as boolean | undefined,
    });
    sectionNum++;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelectorPublic />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link to={ROUTES.AUTH.LOGIN}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('PRIVACY_POLICY.BACK_TO_LOGIN')}
          </Button>
        </Link>

        <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {t('PRIVACY_POLICY.TITLE')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t('PRIVACY_POLICY.LAST_UPDATED', { date: '26 января 2026' })}
          </p>

          <div className="space-y-8 text-foreground">
            {sections.map((section, index) => {
              const Icon = sectionIcons[index + 1] || Shield;
              const isHighlight = section.highlight;

              return (
                <section
                  key={index}
                  className={isHighlight ? 'bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 -mx-4' : ''}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isHighlight ? 'bg-amber-500/20' : 'bg-primary/10'}`}>
                      <Icon className={`w-5 h-5 ${isHighlight ? 'text-amber-600' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                      {section.text && (
                        <p className="text-muted-foreground leading-relaxed mb-3">{section.text}</p>
                      )}
                      {section.items && (
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}

            {/* Contacts Section */}
            <section>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-3">
                    {privacyData.CONTACTS_TITLE as string}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {privacyData.CONTACTS_TEXT as string}
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4">
                    <li>
                      <strong>{t('CONTACTS_MODAL.EMAIL')}:</strong>{' '}
                      <a href="mailto:lexflow.team@gmail.com" className="text-blue-500 hover:underline">
                        lexflow.team@gmail.com
                      </a>
                    </li>
                    <li>
                      <strong>{t('CONTACTS_MODAL.TELEGRAM')}:</strong>{' '}
                      <a
                        href="https://t.me/Amirichinvoker"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        @Amirichinvoker
                      </a>
                    </li>
                    <li>
                      <strong>{t('CONTACTS_MODAL.PHONE')}:</strong>{' '}
                      <a href="tel:+12672283117" className="text-blue-500 hover:underline">
                        +1 267 228 3117
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">{t('AUTH_FOOTER.COPYRIGHT', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </div>
  );
}
