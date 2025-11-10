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
    <div className="space-y-6">
      <AddCaseDialog open={isAddCaseDialogOpen} onOpenChange={setIsAddCaseDialogOpen}/>
      <EditClientDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}/>
      {}
      <Link to="/clients" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
        <ChevronLeft className="mr-1 h-4 w-4"/>
        Все клиенты
      </Link>

      {}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-600 text-xl text-white">
              {client.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {client.status}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
              <span>🏢 {client.type}</span>
              <span>📅 {client.since}</span>
              {client.vip && <span>⭐ VIP клиент</span>}
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Mail className="h-4 w-4"/>
                {client.email}
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Phone className="h-4 w-4"/>
                {client.phone}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Написать
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
            onClick={() => setIsAddCaseDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2}/>
            Новое дело
          </Button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
        <StatCard
          label="Активных дел"
          value={client.activeCases}
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Документов"
          value={client.documents}
          icon={FileText}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          label="Общий гонорар"
          value={client.totalRevenue}
          icon={DollarSign}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="Часов работы"
          value={client.hoursWorked}
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          label="Взаимодействий"
          value={client.interactions}
          icon={TrendingUp}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {}
        <div className="lg:col-span-2 bg-white rounded-xl">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Дела клиента</CardTitle>
              <span className="text-sm text-gray-600">3 дел</span>
            </CardHeader>
            <CardContent className="space-y-4">
              {cases.map((caseItem) => (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ))}
            </CardContent>
          </Card>
        </div>

        {}
        <div className="space-y-6">
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
