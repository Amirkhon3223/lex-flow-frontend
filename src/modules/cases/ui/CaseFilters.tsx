import { Filter } from 'lucide-react';
import type { CaseFiltersProps } from '@/app/types/cases/cases.interfaces';
import { SearchBar } from '@/modules/cases/ui/SearchBar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export function CaseFilters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory,
}: CaseFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="max-w-md">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[180px] h-10 rounded-xl border-gray-200">
          <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">Все статусы</SelectItem>
          <SelectItem value="in_progress">В работе</SelectItem>
          <SelectItem value="review">На проверке</SelectItem>
          <SelectItem value="completed">Завершено</SelectItem>
          <SelectItem value="on_hold">Приостановлено</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterPriority} onValueChange={setFilterPriority}>
        <SelectTrigger className="w-[160px] h-10 rounded-xl border-gray-200">
          <SelectValue placeholder="Приоритет" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">Все приоритеты</SelectItem>
          <SelectItem value="high">Высокий</SelectItem>
          <SelectItem value="medium">Средний</SelectItem>
          <SelectItem value="low">Низкий</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-[200px] h-10 rounded-xl border-gray-200">
          <SelectValue placeholder="Категория" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">Все категории</SelectItem>
          <SelectItem value="Трудовое право">Трудовое право</SelectItem>
          <SelectItem value="Договорное право">Договорное право</SelectItem>
          <SelectItem value="Наследственное право">Наследственное право</SelectItem>
          <SelectItem value="Семейное право">Семейное право</SelectItem>
          <SelectItem value="Защита прав потребителей">Защита прав потребителей</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
