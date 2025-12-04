import { useEffect, useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  FileText,
  Eye,
  Edit,
  Trash2,
  Grid3x3,
  List,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import { useCasesStore } from '@/app/store/cases.store';
import { CaseStatusEnum, CasePriorityEnum } from '@/app/types/cases/cases.enums';
import type { CaseInterface } from '@/app/types/cases/cases.interfaces';
import { CaseFilters } from '@/modules/cases/ui/CaseFilters';
import { EditCaseDialog } from "@/modules/cases/ui/EditCaseDialog.tsx";
import { AddCaseDialog } from '@/shared/components/AddCaseDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Progress } from '@/shared/ui/progress';
import { StatCard } from '@/shared/ui/stat-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

export function CasePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { cases, loading, fetchCases, deleteCase } = useCasesStore();
  const [initialized, setInitialized] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isAddCaseDialogOpen, setIsAddCaseDialogOpen] = useState(false);
  const [isEditCaseDialogOpen, setIsEditCaseDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseInterface | null>(null);

  useEffect(() => {
    if (!initialized) {
      fetchCases({ page: 1, limit: 100 });
      setInitialized(true);
    }
  }, [initialized, fetchCases]);


  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = searchQuery === '' ||
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || caseItem.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || caseItem.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusBadge = (status: CaseStatusEnum) => {
    const styles = {
      [CaseStatusEnum.NEW]: 'bg-gray-100 text-gray-700',
      [CaseStatusEnum.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
      [CaseStatusEnum.WAITING]: 'bg-amber-100 text-amber-700',
      [CaseStatusEnum.CLOSED]: 'bg-green-100 text-green-700',
      [CaseStatusEnum.WON]: 'bg-green-100 text-green-700',
      [CaseStatusEnum.LOST]: 'bg-red-100 text-red-700',
      [CaseStatusEnum.SETTLED]: 'bg-purple-100 text-purple-700',
    };
    const labels = {
      [CaseStatusEnum.NEW]: t('COMMON.STATUS.NEW'),
      [CaseStatusEnum.IN_PROGRESS]: t('COMMON.STATUS.IN_PROGRESS'),
      [CaseStatusEnum.WAITING]: t('COMMON.STATUS.WAITING'),
      [CaseStatusEnum.CLOSED]: t('COMMON.STATUS.CLOSED'),
      [CaseStatusEnum.WON]: t('COMMON.STATUS.WON'),
      [CaseStatusEnum.LOST]: t('COMMON.STATUS.LOST'),
      [CaseStatusEnum.SETTLED]: t('COMMON.STATUS.SETTLED'),
    };
    return <Badge className={`${styles[status] || 'bg-gray-100 text-gray-700'} border-0`}>{labels[status] || status}</Badge>;
  };

  const getPriorityBadge = (priority: CasePriorityEnum) => {
    const styles = {
      [CasePriorityEnum.HIGH]: 'bg-red-100 text-red-700',
      [CasePriorityEnum.MEDIUM]: 'bg-amber-100 text-amber-700',
      [CasePriorityEnum.LOW]: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      [CasePriorityEnum.HIGH]: t('COMMON.PRIORITY.HIGH'),
      [CasePriorityEnum.MEDIUM]: t('COMMON.PRIORITY.MEDIUM'),
      [CasePriorityEnum.LOW]: t('COMMON.PRIORITY.LOW'),
    };
    return <Badge className={`${styles[priority]} border-0 text-xs`}>{labels[priority]}</Badge>;
  };

  const stats = [
    {
      label: t('CASES.STATS.TOTAL'),
      value: cases.length,
      color: 'text-blue-500',
      icon: Briefcase,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 dark:bg-muted',
    },
    {
      label: t('CASES.STATS.IN_WORK'),
      value: cases.filter(c => c.status === CaseStatusEnum.IN_PROGRESS).length,
      color: 'text-purple-500',
      icon: Clock,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 dark:bg-muted',
    },
    {
      label: t('CASES.STATS.COMPLETED'),
      value: cases.filter(c => [CaseStatusEnum.CLOSED, CaseStatusEnum.WON, CaseStatusEnum.SETTLED].includes(c.status)).length,
      color: 'text-green-500',
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50 dark:bg-muted',
    },
    {
      label: t('CASES.STATS.URGENT'),
      value: cases.filter(c => c.priority === CasePriorityEnum.HIGH).length,
      color: 'text-red-500',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50 dark:bg-muted',
    },
  ];

  return (
    <div>
      <header className="relative bg-card border-b border-border rounded-xl">
        <div className="px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight">{t('CASES.TITLE')}</h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">{t('CASES.SUBTITLE')}</p>
              </div>
            </div>

            <Button
              onClick={() => setIsAddCaseDialogOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
              {t('CASES.NEW_CASE')}
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
            <CaseFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
            />

            <div className="hidden md:flex items-center gap-1 lg:ml-auto">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="icon"
                className="rounded-xl cursor-pointer"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" strokeWidth={2} />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="rounded-xl cursor-pointer"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-4 sm:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconBg={stat.iconBg}
              iconColor={stat.iconColor}
              valueColor={stat.color}
            />
          ))}
        </div>

        {viewMode === 'table' ? (
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">{t('CASES.FIELDS.TITLE')}</TableHead>
                  <TableHead className="text-muted-foreground">{t('CASES.FIELDS.CLIENT')}</TableHead>
                  <TableHead className="text-muted-foreground">{t('CASES.FIELDS.CATEGORY')}</TableHead>
                  <TableHead className="text-muted-foreground">{t('CASES.FIELDS.STATUS')}</TableHead>
                  <TableHead className="text-muted-foreground">{t('CASES.FIELDS.PRIORITY')}</TableHead>
                  <TableHead className="text-muted-foreground">{t('CASES.FIELDS.PROGRESS')}</TableHead>
                  <TableHead className="text-muted-foreground">{t('CASES.FIELDS.DEADLINE')}</TableHead>
                  <TableHead className="text-muted-foreground">{t('CASES.FIELDS.DOCUMENTS')}</TableHead>
                  <TableHead className="text-right text-muted-foreground">{t('COMMON.ACTIONS.ACTIONS')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    onClick={() => navigate(ROUTES.CASES.DETAIL(caseItem.id.toString()))}
                    className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="tracking-tight mb-1 truncate">{caseItem.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Создано: {caseItem.createdAt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 ring-2 ring-border">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                            {caseItem.clientName?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{caseItem.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                        {caseItem.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                    <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{caseItem.progress}%</span>
                        </div>
                        <Progress value={caseItem.progress} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                        {caseItem.deadline}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FileText className="w-3.5 h-3.5" strokeWidth={2} />
                        {caseItem.documents}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuLabel>{t('COMMON.ACTIONS.ACTIONS')}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(ROUTES.CASES.DETAIL(caseItem.id.toString()));
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                            {t('COMMON.ACTIONS.OPEN')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCase(caseItem);
                              setIsEditCaseDialogOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" strokeWidth={2} />
                            {t('COMMON.ACTIONS.EDIT')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCase(caseItem.id);
                            }}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                            {t('COMMON.ACTIONS.DELETE')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : null}

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ${viewMode === 'table' ? 'md:hidden' : ''}`}>
          {filteredCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              onClick={() => navigate(ROUTES.CASES.DETAIL(caseItem.id.toString()))}
              className="bg-card border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="tracking-tight mb-2 line-clamp-2 text-sm sm:text-base">{caseItem.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 ring-2 ring-border flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                          {caseItem.clientName?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs sm:text-sm text-muted-foreground truncate">{caseItem.clientName}</span>
                    </div>
                  </div>
                  {getPriorityBadge(caseItem.priority)}
                </div>

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">{t('CASES.FIELDS.STATUS')}</span>
                    {getStatusBadge(caseItem.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">{t('CASES.FIELDS.PROGRESS')}</span>
                    <span className="text-foreground">{caseItem.progress}%</span>
                  </div>
                  <Progress value={caseItem.progress} className="h-1.5 sm:h-2" />
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                    {caseItem.deadline}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                    {caseItem.documents}
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(ROUTES.CASES.DETAIL(caseItem.id.toString()));
                  }}
                  variant="outline"
                  className="w-full rounded-xl border-input hover:bg-muted cursor-pointer text-xs sm:text-sm"
                >
                  {t('CASES.OPEN_CASE')}
                </Button>
              </div>
            </Card>
          ))}
        </div>

      </main>

      <AddCaseDialog
        open={isAddCaseDialogOpen}
        onOpenChange={setIsAddCaseDialogOpen}
      />
      <EditCaseDialog
        open={isEditCaseDialogOpen}
        onOpenChange={setIsEditCaseDialogOpen}
        initialData={selectedCase ? {
          title: selectedCase.title,
          client: selectedCase.clientName,
          category: selectedCase.category,
          deadline: selectedCase.deadline,
          fee: selectedCase.fee.toString(),
          description: selectedCase.description,
          priority: selectedCase.priority,
        } : undefined}
      />
    </div>
  );
}
