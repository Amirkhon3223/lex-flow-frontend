import { Bell, CreditCard, Shield, Sparkles, User, Users } from "lucide-react";
import { BillingTabContent } from '@/modules/settings/components/tabs/BillingTabContent';
import { NotificationsTabContent } from '@/modules/settings/components/tabs/NotificationsTabContent';
import { ProfileTabContent } from '@/modules/settings/components/tabs/ProfileTabContent';
import { SecurityTabContent } from '@/modules/settings/components/tabs/SecurityTabContent';
import { TeamTabContent } from '@/modules/settings/components/tabs/TeamTabContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs.tsx";


export default function SettingsPage() {
  return (
    <div>
      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5}/>
            </div>
            <div>
              <h1 className="text-4xl tracking-tight">Настройки</h1>
              <p className="text-gray-500 text-lg">Управление аккаунтом и предпочтениями</p>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-gray-100 rounded-xl p-1.5 grid grid-cols-5 w-full">
              <TabsTrigger value="profile"
                           className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <User className="w-4 h-4 mr-2" strokeWidth={2}/>
                Профиль
              </TabsTrigger>
              <TabsTrigger value="notifications"
                           className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Bell className="w-4 h-4 mr-2" strokeWidth={2}/>
                Уведомления
              </TabsTrigger>
              <TabsTrigger value="security"
                           className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Shield className="w-4 h-4 mr-2" strokeWidth={2}/>
                Безопасность
              </TabsTrigger>
              <TabsTrigger value="team"
                           className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Users className="w-4 h-4 mr-2" strokeWidth={2}/>
                Команда
              </TabsTrigger>
              <TabsTrigger value="billing"
                           className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <CreditCard className="w-4 h-4 mr-2" strokeWidth={2}/>
                Подписка
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileTabContent />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationsTabContent />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecurityTabContent />
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <TeamTabContent />
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <BillingTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
