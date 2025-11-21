import { DollarSign, CreditCard, Wallet } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { IconContainer } from '@/shared/ui/common/IconContainer';
import { TrendingBadge } from '@/shared/ui/common/TrendingBadge';
import { getMedalGradient } from '@/shared/utils/styleHelpers';

const revenueBySource = [
  { source: 'Консультации', amount: 1250000, percentage: 32, color: 'bg-blue-500' },
  { source: 'Представительство', amount: 1875000, percentage: 48, color: 'bg-purple-500' },
  { source: 'Юридическое сопровождение', amount: 625000, percentage: 16, color: 'bg-green-500' },
  { source: 'Прочее', amount: 156000, percentage: 4, color: 'bg-gray-400' },
];

const paymentStats = [
  { title: 'Получено оплат', value: '3.8M ₽', change: '+23%', icon: DollarSign, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
  { title: 'Ожидается оплат', value: '850K ₽', change: '+8%', icon: CreditCard, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  { title: 'Средний чек', value: '125K ₽', change: '+15%', icon: Wallet, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
];

const topClients = [
  { name: 'ООО "ТехноСтрой"', revenue: 680000, cases: 8 },
  { name: 'ИП Смирнов А.В.', revenue: 520000, cases: 12 },
  { name: 'ООО "МегаТорг"', revenue: 450000, cases: 6 },
  { name: 'ЗАО "ПромИнвест"', revenue: 390000, cases: 5 },
  { name: 'ИП Петрова М.И.', revenue: 320000, cases: 9 },
];

export function FinanceTabContent() {
  const totalRevenue = revenueBySource.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {paymentStats.map((stat) => (
          <Card key={stat.title}>
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <IconContainer icon={stat.icon} bgColor={stat.bgColor} iconColor={stat.iconColor} />
              <TrendingBadge value={stat.change} variant="success" />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">{stat.value}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{stat.title}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-2 md:mb-4">Доходы по источникам</h3>
            <div className="space-y-3 sm:space-y-4">
              {revenueBySource.map((item) => (
                <div key={item.source} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground truncate mr-2">{item.source}</span>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-foreground font-medium">
                        {(item.amount / 1000).toFixed(0)}K ₽
                      </span>
                      <span className="text-muted-foreground">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="relative h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${item.color} transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 sm:pt-4 border-t border-border flex items-center justify-between">
                <span className="font-medium text-sm sm:text-base">Итого</span>
                <span className="text-lg sm:text-xl md:text-2xl tracking-tight">
                  {(totalRevenue / 1000000).toFixed(1)}M ₽
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-2 sm:mb-2 md:mb-4">ТОП клиенты по доходу</h3>
            <div className="space-y-2 sm:space-y-3">
              {topClients.map((client, index) => (
                <div
                  key={client.name}
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-all"
                >
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0 ${getMedalGradient(index)}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="tracking-tight text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{client.name}</h4>
                    <p className="text-xs text-muted-foreground">{client.cases} дел</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-medium text-xs sm:text-sm">{(client.revenue / 1000).toFixed(0)}K ₽</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
