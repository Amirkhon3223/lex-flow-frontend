import { useState } from 'react';
import { Briefcase, Users, TrendingUp, DollarSign, Download } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { CaseStatsChart } from './ui/CaseStatsChart';
import { CaseTypesChart } from './ui/CaseTypesChart';
import { PeriodSelector } from './ui/PeriodSelector';
import { StatsCard } from './ui/StatsCard';
import { TabsPanel } from './ui/TabsPanel';

const caseStatsData = [
    { month: 'Янв', completed: 8, failed: 2 },
    { month: 'Фев', completed: 10, failed: 3 },
    { month: 'Мар', completed: 12, failed: 2 },
    { month: 'Апр', completed: 9, failed: 4 },
    { month: 'Май', completed: 14, failed: 3 },
    { month: 'Июн', completed: 16, failed: 4 },
];

const caseTypesData = [
    { name: 'Трудовые споры', value: 35, color: '#3b82f6' },
    { name: 'Договорное право', value: 25, color: '#8b5cf6' },
    { name: 'Наследственные дела', value: 20, color: '#f59e0b' },
    { name: 'Семейное право', value: 15, color: '#10b981' },
    { name: 'Прочее', value: 5, color: '#6b7280' },
];

const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'cases', label: 'Дела' },
    { id: 'finance', label: 'Финансы' },
    { id: 'team', label: 'Команда' },
];

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
                    <p className="text-sm text-gray-600">Обзор эффективности работы и статистика</p>
                </div>
                <div className="flex gap-2">
                    <PeriodSelector />
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Экспорт отчета
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                <StatsCard
                    title="Активные дела"
                    value="47"
                    change="+12%"
                    icon={Briefcase}
                    iconBgColor="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatsCard
                    title="Новых клиентов"
                    value="24"
                    change="+8%"
                    icon={Users}
                    iconBgColor="bg-purple-50"
                    iconColor="text-purple-600"
                />
                <StatsCard
                    title="Успешных дел"
                    value="87%"
                    change="+5%"
                    icon={TrendingUp}
                    iconBgColor="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatsCard
                    title="Доход за период"
                    value="3.8M ₽"
                    change="+23%"
                    icon={DollarSign}
                    iconBgColor="bg-orange-50"
                    iconColor="text-orange-600"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CaseStatsChart data={caseStatsData} />
                <CaseTypesChart data={caseTypesData} />
            </div>

            <TabsPanel
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div>
    );
}
