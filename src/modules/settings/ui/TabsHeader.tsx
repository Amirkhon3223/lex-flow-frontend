import { Bell, Shield, CreditCard, Users } from 'lucide-react';

type TabId = 'profile' | 'notifications' | 'security' | 'subscription';

interface TabsHeaderProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

const tabs = [
    { id: 'profile' as TabId, label: 'Профиль', icon: Users },
    { id: 'notifications' as TabId, label: 'Уведомления', icon: Bell },
    { id: 'security' as TabId, label: 'Безопасность', icon: Shield },
    { id: 'subscription' as TabId, label: 'Подписка', icon: CreditCard },
];

export function TabsHeader({ activeTab, onTabChange }: TabsHeaderProps) {
    return (
        <div className="border-b">
            <div className="flex gap-4 px-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
                                activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
