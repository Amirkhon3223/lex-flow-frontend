import { Card, CardContent, CardHeader } from '@/shared/ui/card';

interface Tab {
    id: string;
    label: string;
}

interface TabsPanelProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function TabsPanel({ tabs, activeTab, onTabChange }: TabsPanelProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4 border-b">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`px-4 py-2 text-sm font-medium ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-8">
                    Детальная статистика по выбранной категории
                </div>
            </CardContent>
        </Card>
    );
}
