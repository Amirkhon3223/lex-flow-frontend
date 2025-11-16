import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

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
      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {paymentStats.map((stat) => (
          <Card key={stat.title} className="bg-white border-0 shadow-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stat.iconColor}`} strokeWidth={2} />
                </div>
                <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-0.5 sm:gap-1 text-xs">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
                  {stat.change}
                </Badge>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500">{stat.title}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue by Source */}
        <Card className="bg-white border-0 shadow-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
          <div className="p-3 sm:p-4 md:p-6">
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">Доходы по источникам</h3>
            <div className="space-y-3 sm:space-y-4">
              {revenueBySource.map((item) => (
                <div key={item.source} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 truncate mr-2">{item.source}</span>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-gray-900 font-medium">
                        {(item.amount / 1000).toFixed(0)}K ₽
                      </span>
                      <span className="text-gray-500">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="relative h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${item.color} transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 sm:pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="font-medium text-sm sm:text-base">Итого</span>
                <span className="text-lg sm:text-xl md:text-2xl tracking-tight">
                  {(totalRevenue / 1000000).toFixed(1)}M ₽
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Clients by Revenue */}
        <Card className="bg-white border-0 shadow-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
          <div className="p-3 sm:p-4 md:p-6">
            <h3 className="text-base sm:text-lg md:text-xl tracking-tight mb-3 sm:mb-4 md:mb-6">ТОП клиенты по доходу</h3>
            <div className="space-y-2 sm:space-y-3">
              {topClients.map((client, index) => (
                <div
                  key={client.name}
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0 ${
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                        : index === 1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                          : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="tracking-tight text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{client.name}</h4>
                    <p className="text-xs text-gray-500">{client.cases} дел</p>
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
