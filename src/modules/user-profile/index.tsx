import { useState } from 'react';
import { ArrowLeft, Save, Briefcase, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '@/app/utils/authUtils';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { ProfileSidebar } from './widgets/ProfileSidebar';
import { ProfileTabs } from './widgets/ProfileTabs';

export default function UserProfilePage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const onBack = () => navigate(-1);

  const onLogout = () => {
    handleLogout(navigate);
  };

  const [profileData, setProfileData] = useState({
    firstName: 'Александр',
    lastName: 'Петров',
    middleName: 'Иванович',
    email: 'petrov@lexflow.ru',
    phone: '+7 (999) 999-99-99',
    position: 'Старший юрист',
    company: 'Юридическая фирма "ЛексПро"',
    address: 'г. Москва, ул. Тверская, д. 1, офис 101',
    birthDate: '1985-06-15',
    specialization: 'Трудовое право',
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const stats = [
    {
      label: t('USER_PROFILE.STATS.ACTIVE_CASES'),
      value: '47',
      icon: Briefcase,
      color: 'text-blue-500',
    },
    { label: t('USER_PROFILE.STATS.CLIENTS'), value: '24', icon: User, color: 'text-purple-500' },
    {
      label: t('USER_PROFILE.STATS.COMPLETED_CASES'),
      value: '128',
      icon: Briefcase,
      color: 'text-green-500',
    },
    {
      label: t('USER_PROFILE.STATS.DAYS_IN_SYSTEM'),
      value: '342',
      icon: Calendar,
      color: 'text-orange-500',
    },
  ];

  return (
    <div>
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl hover:bg-muted flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" strokeWidth={2} />
                </Button>
              )}
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl tracking-tight mb-0.5 sm:mb-1 truncate">
                  {t('USER_PROFILE.TITLE')}
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                  {t('USER_PROFILE.SUBTITLE')}
                </p>
              </div>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl shadow-md text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10 px-3 sm:px-4 w-full sm:w-auto">
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
              {t('USER_PROFILE.SAVE_CHANGES')}
            </Button>
          </div>
        </div>
      </header>

      <main className="py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <ProfileSidebar profileData={profileData} stats={stats} onLogout={onLogout} />

          <div className="lg:col-span-2">
            <ProfileTabs profileData={profileData} handleProfileChange={handleProfileChange} />
          </div>
        </div>
      </main>
    </div>
  );
}
