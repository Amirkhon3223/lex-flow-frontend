import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

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
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-3 gap-6">
        {paymentStats.map((stat) => (
          <Card key={stat.title} className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2} />
                </div>
                <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" strokeWidth={2} />
                  {stat.change}
                </Badge>
              </div>
              <div className="text-3xl tracking-tight mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
          <div className="p-6">
            <h3 className="text-xl tracking-tight mb-6">Доходы по источникам</h3>
            <div className="space-y-4">
              {revenueBySource.map((item) => (
                <div key={item.source} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 font-medium">
                        {(item.amount / 1000).toFixed(0)}K ₽
                      </span>
                      <span className="text-gray-500">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${item.color} transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="font-medium">Итого</span>
                <span className="text-2xl tracking-tight">
                  {(totalRevenue / 1000000).toFixed(1)}M ₽
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Clients by Revenue */}
        <Card className="bg-white border-0 shadow-sm rounded-xl px-3 py-2">
          <div className="p-6">
            <h3 className="text-xl tracking-tight mb-6">ТОП клиенты по доходу</h3>
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div
                  key={client.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium ${
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
                    <h4 className="tracking-tight text-sm mb-1 truncate">{client.name}</h4>
                    <p className="text-xs text-gray-500">{client.cases} дел</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{(client.revenue / 1000).toFixed(0)}K ₽</div>
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
