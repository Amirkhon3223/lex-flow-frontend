import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Briefcase, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { usersService } from '@/app/services/users/users.service';
import { useAuthStore } from '@/app/store/auth.store';
import { handleLogout } from '@/app/utils/authUtils';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { ProfileSidebar } from './widgets/ProfileSidebar';
import { ProfileTabs } from './widgets/ProfileTabs';

export default function UserProfilePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, updateUserData, refreshUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    activeCases: 0,
    totalClients: 0,
    completedCases: 0,
    daysInSystem: 0,
  });

  const onBack = () => navigate(-1);

  const onLogout = () => {
    handleLogout(navigate);
  };

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    address: '',
    specialization: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || '',
        company: user.company || '',
        address: user.address || '',
        specialization: user.specialization || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await usersService.getStats();
        setUserStats({
          activeCases: stats.activeCases || 0,
          totalClients: stats.clients || 0,
          completedCases: stats.completedCases || 0,
          daysInSystem: stats.daysInSystem || 0,
        });
      } catch (error) {
        console.error('Failed to load user stats:', error);
      }
    };

    loadData();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const updatedUser = await usersService.updateMe({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        middleName: profileData.middleName || undefined,
        phone: profileData.phone,
        position: profileData.position,
        company: profileData.company || undefined,
        address: profileData.address || undefined,
        specialization: profileData.specialization as any,
      });
      updateUserData(updatedUser);
      toast.success(t('USER_PROFILE.CHANGES_SAVED'));
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: t('USER_PROFILE.STATS.ACTIVE_CASES'),
      value: userStats.activeCases.toString(),
      icon: Briefcase,
      color: 'text-blue-500',
    },
    {
      label: t('USER_PROFILE.STATS.CLIENTS'),
      value: userStats.totalClients.toString(),
      icon: User,
      color: 'text-purple-500',
    },
    {
      label: t('USER_PROFILE.STATS.COMPLETED_CASES'),
      value: userStats.completedCases.toString(),
      icon: Briefcase,
      color: 'text-green-500',
    },
    {
      label: t('USER_PROFILE.STATS.DAYS_IN_SYSTEM'),
      value: userStats.daysInSystem.toString(),
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
            <Button
              onClick={handleSaveChanges}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl shadow-md text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10 px-3 sm:px-4 w-full sm:w-auto"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
              {loading ? t('COMMON.LOADING') : t('USER_PROFILE.SAVE_CHANGES')}
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
