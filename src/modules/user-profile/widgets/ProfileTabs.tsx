import { User, Bell, Shield, CreditCard } from 'lucide-react';
import { NotificationsTabContent } from '@/modules/settings/components/tabs/NotificationsTabContent';
import { SecurityTabContent } from '@/modules/settings/components/tabs/SecurityTabContent';
import { BillingTabContent } from '@/modules/user-profile/ui/BillingTabContent';
import { ProfileTabContent } from '@/modules/user-profile/ui/ProfileTabContent';
import { Card } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function ProfileTabs({
  profileData,
  handleProfileChange,
}: {
  profileData: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    position: string;
    company: string;
    address: string;
    specialization: string;
  };
  handleProfileChange: (field: string, value: string) => void;
}) {
  return (
    <Card>
      <Tabs defaultValue="profile" className="w-full">
        <div className="border-b border-gray-100 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <TabsList className="bg-gray-100 rounded-lg sm:rounded-xl w-full flex overflow-x-auto">
            <TabsTrigger
              value="profile"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">Уведомления</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">Безопасность</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="rounded-md sm:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
              <span className="hidden sm:inline">Подписка</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <ProfileTabContent profileData={profileData} handleProfileChange={handleProfileChange} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTabContent />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTabContent />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTabContent />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
