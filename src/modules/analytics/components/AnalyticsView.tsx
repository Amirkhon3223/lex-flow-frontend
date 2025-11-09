import {
  TrendingUp,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  Target,
  Award,
  BarChart3,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';


export function AnalyticsView() {

  const casesData = [
    { month: 'Янв', cases: 12, won: 8, lost: 2, pending: 2 },
    { month: 'Фев', cases: 15, won: 10, lost: 3, pending: 2 },
    { month: 'Мар', cases: 18, won: 12, lost: 4, pending: 2 },
    { month: 'Апр', cases: 14, won: 9, lost: 3, pending: 2 },
    { month: 'Май', cases: 20, won: 14, lost: 4, pending: 2 },
    { month: 'Июн', cases: 22, won: 16, lost: 4, pending: 2 },
  ];

  const revenueData = [
    { month: 'Янв', revenue: 450000 },
    { month: 'Фев', revenue: 520000 },
    { month: 'Мар', revenue: 680000 },
    { month: 'Апр', revenue: 590000 },
    { month: 'Май', revenue: 750000 },
    { month: 'Июн', revenue: 820000 },
  ];

  const caseTypeData = [
    { name: 'Трудовые споры', value: 35, color: '#3B82F6' },
    { name: 'Договорное право', value: 25, color: '#8B5CF6' },
    { name: 'Наследственные дела', value: 20, color: '#F59E0B' },
    { name: 'Семейное право', value: 15, color: '#10B981' },
    { name: 'Прочее', value: 5, color: '#6B7280' },
  ];

  const topLawyers = [
    { name: 'Александр И.', cases: 47, winRate: 89, revenue: 2400000 },
    { name: 'Мария С.', cases: 42, winRate: 86, revenue: 2100000 },
    { name: 'Дмитрий П.', cases: 38, winRate: 82, revenue: 1900000 },
    { name: 'Елена В.', cases: 35, winRate: 91, revenue: 1800000 },
  ];

  return (
    <div>
      {}
      <header className="relative bg-white border-b border-gray-200/50 rounded-xl">
<div className="px-4 py-6">          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl tracking-tight mb-2">Аналитика</h1>
              <p className="text-gray-500 text-lg">Обзор эффективности работы и статистика</p>
            </div>

            <div className="flex items-center gap-3">
              <Select defaultValue="month">
                <SelectTrigger className="w-48 h-12 rounded-xl border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" strokeWidth={2} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Эта неделя</SelectItem>
                  <SelectItem value="month">Этот месяц</SelectItem>
                  <SelectItem value="quarter">Квартал</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md">
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                Экспорт отчета
              </Button>
            </div>
          </div>

          {}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-500" strokeWidth={2} />
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" strokeWidth={2} />
                    +12%
                  </Badge>
                </div>
                <div className="text-3xl tracking-tight mb-1">47</div>
                <div className="text-sm text-gray-500">Активные дела</div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-500" strokeWidth={2} />
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" strokeWidth={2} />
                    +8%
                  </Badge>
                </div>
                <div className="text-3xl tracking-tight mb-1">24</div>
                <div className="text-sm text-gray-500">Новых клиентов</div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-500" strokeWidth={2} />
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" strokeWidth={2} />
                    +5%
                  </Badge>
                </div>
                <div className="text-3xl tracking-tight mb-1">87%</div>
                <div className="text-sm text-gray-500">Успешных дел</div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-500" strokeWidth={2} />
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-0 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" strokeWidth={2} />
                    +23%
                  </Badge>
                </div>
                <div className="text-3xl tracking-tight mb-1">3.8M ₽</div>
                <div className="text-sm text-gray-500">Доход за период</div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      {}
      <main className="p-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100 rounded-xl p-1.5">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <BarChart3 className="w-4 h-4 mr-2" strokeWidth={2} />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="cases" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Briefcase className="w-4 h-4 mr-2" strokeWidth={2} />
              Дела
            </TabsTrigger>
            <TabsTrigger value="finance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <DollarSign className="w-4 h-4 mr-2" strokeWidth={2} />
              Финансы
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" strokeWidth={2} />
              Команда
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {}
              <Card className="col-span-2 bg-white border-0 shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">Статистика дел</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={casesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Bar dataKey="won" fill="#10B981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="pending" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="lost" fill="#EF4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {}
              <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
                <div className="p-6">
                  <h3 className="text-xl tracking-tight mb-6">Типы дел</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={caseTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {caseTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {caseTypeData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-gray-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {}
            <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
              <div className="p-6">
                <h3 className="text-xl tracking-tight mb-6">Динамика дохода</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      formatter={(value: any) => `${(value / 1000).toFixed(0)}k ₽`}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
              <div className="p-6">
                <h3 className="text-xl tracking-tight mb-6">Лучшие юристы</h3>
                <div className="space-y-4">
                  {topLawyers.map((lawyer, index) => (
                    <div key={lawyer.name} className="p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                          'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}>
                          {index === 0 && <Award className="w-5 h-5" strokeWidth={2} />}
                          {index !== 0 && <span className="text-lg">#{index + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <h4 className="tracking-tight mb-1">{lawyer.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{lawyer.cases} дел</span>
                            <span>•</span>
                            <span className="text-green-600">{lawyer.winRate}% успеха</span>
                            <span>•</span>
                            <span>{(lawyer.revenue / 1000000).toFixed(1)}M ₽ дохода</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Процент успеха</span>
                          <span className="text-gray-900">{lawyer.winRate}%</span>
                        </div>
                        <Progress value={lawyer.winRate} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
