import { Bell, CreditCard, Shield, Sparkles, User, Users } from 'lucide-react';
import { BillingTabContent } from '@/modules/settings/components/tabs/BillingTabContent';
import { NotificationsTabContent } from '@/modules/settings/components/tabs/NotificationsTabContent';
import { ProfileTabContent } from '@/modules/settings/components/tabs/ProfileTabContent';
import { SecurityTabContent } from '@/modules/settings/components/tabs/SecurityTabContent';
import { TeamTabContent } from '@/modules/settings/components/tabs/TeamTabContent';
import { useI18n } from '@/shared/context/I18nContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs.tsx';

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <div>
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-3 sm:px-4 py-3 sm:py-4 md:py-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
              <Sparkles
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                strokeWidth={2.5}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">
                {t('SETTINGS.TITLE')}
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                {t('SETTINGS.SUBTITLE')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
            <TabsList className="rounded-lg sm:rounded-xl p-0.5 sm:p-1 md:p-1.5 grid grid-cols-5 w-full">
              <TabsTrigger
                value="profile"
                className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-1 sm:px-2 md:px-3 py-1.5 sm:py-2"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">{t('SETTINGS.TABS.PROFILE')}</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-1 sm:px-2 md:px-3 py-1.5 sm:py-2"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">{t('SETTINGS.TABS.NOTIFICATIONS')}</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-1 sm:px-2 md:px-3 py-1.5 sm:py-2"
              >
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">{t('SETTINGS.TABS.SECURITY')}</span>
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-1 sm:px-2 md:px-3 py-1.5 sm:py-2"
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">{t('SETTINGS.TABS.TEAM')}</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-1 sm:px-2 md:px-3 py-1.5 sm:py-2"
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">{t('SETTINGS.TABS.BILLING')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 sm:space-y-6">
              <ProfileTabContent />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
              <NotificationsTabContent />
            </TabsContent>

            <TabsContent value="security" className="space-y-4 sm:space-y-6">
              <SecurityTabContent />
            </TabsContent>

            <TabsContent value="team" className="space-y-4 sm:space-y-6">
              <TeamTabContent />
            </TabsContent>

            <TabsContent value="billing" className="space-y-4 sm:space-y-6">
              <BillingTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
