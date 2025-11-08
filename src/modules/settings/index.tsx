import { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { ProfileSidebar } from './ui/ProfileSidebar';
import { ProfileTab } from './ui/ProfileTab';
import { SubscriptionTab } from './ui/SubscriptionTab';
import { TabsHeader } from './ui/TabsHeader';

type TabId = 'profile' | 'notifications' | 'security' | 'subscription';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('profile');

    const profileData = {
        name: 'Петров Александр',
        position: 'Старший юрист',
        email: 'petrov@lexflow.ru',
        phone: '+7 (999) 999-99-99',
        location: 'Москва, Россия',
        company: 'Юридическая фирма "ЛексПро"',
        office: 'г. Москва, ул. Тверская, д. 1, офис 101',
        specialization: 'Трудовое право',
        stats: {
            activeCases: 47,
            clients: 24,
            completedCases: 128,
            daysInSystem: 342,
        },
        subscription: {
            plan: 'Pro Plan',
            price: '2 990 ₽',
            period: 'месяц',
            expiresAt: '15 января 2026',
            status: 'Активна',
            features: {
                clients: 'Безлимит',
                cases: 'Безлимит',
                storage: '100 ГБ',
                users: 5,
            },
            payments: [
                { date: '15 октября 2025', plan: 'Pro Plan - Октябрь 2025', amount: '2 990 ₽' },
                { date: '15 сентября 2025', plan: 'Pro Plan - Сентябрь 2025', amount: '2 990 ₽' },
            ],
        },
    };

    return (
        <div className="space-y-6">
            {}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
                <p className="text-sm text-gray-600">Управление личными данными и настройками</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {}
                <div className="lg:col-span-1">
                    <ProfileSidebar
                        name={profileData.name}
                        position={profileData.position}
                        email={profileData.email}
                        phone={profileData.phone}
                        location={profileData.location}
                        stats={profileData.stats}
                    />
                </div>

                {}
                <div className="lg:col-span-3">
                    <Card>
                        {}
                        <TabsHeader activeTab={activeTab} onTabChange={setActiveTab} />

                        <CardContent className="p-6">
                            {}
                            {activeTab === 'profile' && (
                                <ProfileTab
                                    email={profileData.email}
                                    phone={profileData.phone}
                                    position={profileData.position}
                                    specialization={profileData.specialization}
                                    company={profileData.company}
                                    office={profileData.office}
                                />
                            )}

                            {}
                            {activeTab === 'subscription' && (
                                <SubscriptionTab
                                    plan={profileData.subscription.plan}
                                    price={profileData.subscription.price}
                                    period={profileData.subscription.period}
                                    expiresAt={profileData.subscription.expiresAt}
                                    status={profileData.subscription.status}
                                    features={profileData.subscription.features}
                                    payments={profileData.subscription.payments}
                                />
                            )}

                            {}
                            {activeTab === 'notifications' && (
                                <div className="text-center text-gray-500 py-12">
                                    Настройки уведомлений
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="text-center text-gray-500 py-12">
                                    Настройки безопасности
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
