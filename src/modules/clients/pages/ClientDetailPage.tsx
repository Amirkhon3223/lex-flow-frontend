import { useState } from "react";
import { ChevronLeft, Briefcase, FileText, DollarSign, Clock, TrendingUp, Plus, Mail, Phone } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import type { CaseCardInterface } from "@/app/types/cases/cases.interfaces.ts";
import { CaseCard } from "@/modules/cases/ui/CaseCard.tsx";
import { ContactInfoCard } from "@/modules/clients/ui/ContactInfoCard.tsx";
import { FinancialCard } from "@/modules/clients/widgets/FinancialCard.tsx";
import { AddCaseDialog } from "@/shared/components/AddCaseDialog.tsx";
import { EditClientDialog } from "@/shared/components/EditClientDialog.tsx";
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { StatCard } from '@/shared/ui/stat-card';

export default function ClientDetailPage() {
  const [isAddCaseDialogOpen, setIsAddCaseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { id: _id } = useParams();

  const client = {
    id: 1,
    name: 'Иванов Петр Алексеевич',
    initials: 'ИП',
    type: 'Физическое лицо',
    since: 'Клиент с января 2024',
    vip: true,
    status: 'Активный клиент',
    email: 'ivanov@mail.ru',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Ленина, д. 10, кв. 25',
    birthDate: '15 марта 1985 (39 лет)',
    activeCases: 3,
    documents: 25,
    totalRevenue: '250 000 ₽',
    hoursWorked: 45,
    interactions: 12,
  };

  const cases: CaseCardInterface[] = [
    {
      id: 1,
      title: 'Трудовой спор - незаконное увольнение',
      client: 'Иванов Петр Алексеевич',
      clientInitials: 'ИП',
      category: 'Трудовое право',
      deadline: '20 окт 2025',
      daysLeft: 5,
      progress: 75,
      documents: 8,
      events: 3,
      status: 'urgent',
      statusText: 'Срочно',
    },
    {
      id: 2,
      title: 'Восстановление на работе',
      client: 'Иванов Петр Алексеевич',
      clientInitials: 'ИП',
      category: 'Трудовое право',
      deadline: '15 ноя 2025',
      daysLeft: 30,
      progress: 45,
      documents: 5,
      events: 2,
      status: 'medium',
      statusText: 'На проверке',
    },
    {
      id: 3,
      title: 'Взыскание задолженности по зарплате',
      client: 'Иванов Петр Алексеевич',
      clientInitials: 'ИП',
      category: 'Трудовое право',
      deadline: '5 окт 2025',
      daysLeft: -10,
      progress: 100,
      documents: 12,
      events: 5,
      status: 'completed',
      statusText: 'Завершено',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <AddCaseDialog open={isAddCaseDialogOpen} onOpenChange={setIsAddCaseDialogOpen} />
      <EditClientDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      { }
      <Link to="/clients" className="inline-flex items-center text-xs sm:text-sm text-gray-600 hover:text-gray-900">
        <ChevronLeft className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Все клиенты
      </Link>

      { }
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
            <AvatarFallback className="bg-blue-600 text-lg sm:text-xl text-white">
              {client.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{client.name}</h1>
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 w-fit">
                {client.status}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span>🏢 {client.type}</span>
              <span>📅 {client.since}</span>
              {client.vip && <span>⭐ VIP клиент</span>}
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                {client.phone}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none text-sm sm:text-base">
            Написать
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md flex-1 sm:flex-none text-sm sm:text-base"
            onClick={() => setIsAddCaseDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
            Новое дело
          </Button>
        </div>
      </div>

      { }
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          label="Активных дел"
          value={client.activeCases}
          icon={Briefcase}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Документов"
          value={client.documents}
          icon={FileText}
          iconBg="bg-purple-500/10"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label="Общий гонорар"
          value={client.totalRevenue}
          icon={DollarSign}
          iconBg="bg-green-500/10"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          label="Часов работы"
          value={client.hoursWorked}
          icon={Clock}
          iconBg="bg-orange-500/10"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          label="Взаимодействий"
          value={client.interactions}
          icon={TrendingUp}
          iconBg="bg-red-500/10"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>

      { }
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        { }
        <div className="lg:col-span-2 rounded-xl !p-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base sm:text-lg">Дела клиента</CardTitle>
              <Badge className="bg-blue-500 text-gray-100 border-0 text-md">3 дел</Badge>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 mt-2">
              {cases.map((caseItem) => (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ))}
            </CardContent>
          </Card>
        </div>

        { }
        <div className="space-y-4 sm:space-y-6">
          <ContactInfoCard
            contactInfo={{
              email: client.email,
              phone: client.phone,
              address: client.address,
              birthDate: client.birthDate,
            }}
            onEdit={() => setIsEditDialogOpen(true)}
          />

          <FinancialCard
            financialData={{
              totalAmount: 250000,
              paidAmount: 125000,
              remainingAmount: 125000,
              paymentPercentage: 50,
            }}
          />
        </div>
      </div>
    </div>
  );
}
