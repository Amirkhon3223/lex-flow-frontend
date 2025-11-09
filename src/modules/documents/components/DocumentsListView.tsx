import { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  History,
  Upload,
  MoreHorizontal,
  Star,
  Trash2,
  FolderOpen,
  Clock,
  User,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentStatusEnum, DocumentCategoryEnum } from '@/app/types/documents/documents.enums';
import type { DocumentInterface } from '@/app/types/documents/documents.interfaces';
import { UploadDocumentDialog } from '@/shared/components/UploadDocumentDialog';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';


export function DocumentsListView() {
  const navigate = useNavigate();
  const onDocumentOpen = (docId: number) => console.log('Document opened:', docId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const documents: DocumentInterface[] = [
    {
      id: 1,
      name: 'Исковое заявление.pdf',
      case: 'Трудовой спор - увольнение',
      client: 'Иванов П.А.',
      type: 'Иск',
      size: '2.4 MB',
      date: '15 окт 2025',
      versions: 3,
      status: DocumentStatusEnum.FINAL,
      category: DocumentCategoryEnum.LEGAL,
      lastModified: '2 часа назад',
      starred: true,
    },
    {
      id: 2,
      name: 'Договор аренды помещения.pdf',
      case: 'Договор аренды',
      client: 'ООО "ТехноСтрой"',
      type: 'Договор',
      size: '1.8 MB',
      date: '14 окт 2025',
      versions: 2,
      status: DocumentStatusEnum.REVIEW,
      category: DocumentCategoryEnum.CONTRACT,
      lastModified: '5 часов назад',
      starred: false,
    },
    {
      id: 3,
      name: 'Трудовой договор.pdf',
      case: 'Трудовой спор - увольнение',
      client: 'Иванов П.А.',
      type: 'Договор',
      size: '1.5 MB',
      date: '12 окт 2025',
      versions: 2,
      status: DocumentStatusEnum.FINAL,
      category: DocumentCategoryEnum.CONTRACT,
      lastModified: '1 день назад',
      starred: true,
    },
    {
      id: 4,
      name: 'Приказ об увольнении.pdf',
      case: 'Трудовой спор - увольнение',
      client: 'Иванов П.А.',
      type: 'Приказ',
      size: '856 KB',
      date: '10 окт 2025',
      versions: 1,
      status: DocumentStatusEnum.DRAFT,
      category: DocumentCategoryEnum.ADMINISTRATIVE,
      lastModified: '3 дня назад',
      starred: false,
    },
    {
      id: 5,
      name: 'Возражение на иск.pdf',
      case: 'Наследственное дело',
      client: 'Смирнова А.В.',
      type: 'Возражение',
      size: '3.2 MB',
      date: '8 окт 2025',
      versions: 4,
      status: DocumentStatusEnum.REVIEW,
      category: DocumentCategoryEnum.LEGAL,
      lastModified: '5 дней назад',
      starred: false,
    },
    {
      id: 6,
      name: 'Доверенность.pdf',
      case: 'Договор аренды',
      client: 'ООО "ТехноСтрой"',
      type: 'Доверенность',
      size: '456 KB',
      date: '5 окт 2025',
      versions: 1,
      status: DocumentStatusEnum.FINAL,
      category: DocumentCategoryEnum.ADMINISTRATIVE,
      lastModified: '1 неделю назад',
      starred: true,
    },
  ];

  const getStatusColor = (status: DocumentStatusEnum) => {
    switch (status) {
      case DocumentStatusEnum.FINAL:
        return 'bg-green-100 text-green-700';
      case DocumentStatusEnum.REVIEW:
        return 'bg-blue-100 text-blue-700';
      case DocumentStatusEnum.DRAFT:
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: DocumentStatusEnum) => {
    switch (status) {
      case DocumentStatusEnum.FINAL:
        return 'Финал';
      case DocumentStatusEnum.REVIEW:
        return 'Проверка';
      case DocumentStatusEnum.DRAFT:
        return 'Черновик';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: DocumentCategoryEnum) => {
    switch (category) {
      case DocumentCategoryEnum.LEGAL:
        return 'bg-blue-100 text-blue-600';
      case DocumentCategoryEnum.CONTRACT:
        return 'bg-purple-100 text-purple-600';
      case DocumentCategoryEnum.ADMINISTRATIVE:
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div>
      <UploadDocumentDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />

      {}
      <header className="relative bg-white border-b border-gray-200/50">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl tracking-tight mb-2">Документы</h1>
              <p className="text-gray-500 text-lg">Управление всеми документами и версиями</p>
            </div>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
              Загрузить документ
            </Button>
          </div>

          {}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border-0 shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl tracking-tight mb-1">156</div>
                    <div className="text-sm text-gray-500">Всего</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-500" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl tracking-tight mb-1">12</div>
                    <div className="text-sm text-gray-500">На проверке</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl tracking-tight mb-1">8</div>
                    <div className="text-sm text-gray-500">Избранные</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-500" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl tracking-tight mb-1">34</div>
                    <div className="text-sm text-gray-500">Версий</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <History className="w-5 h-5 text-purple-500" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
              <Input
                placeholder="Поиск документов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 rounded-xl border-gray-200 focus-visible:ring-blue-500"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 h-12 rounded-xl border-gray-200">
                <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="legal">Иски</SelectItem>
                <SelectItem value="contract">Договоры</SelectItem>
                <SelectItem value="administrative">Административные</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12 rounded-xl border-gray-200">
                <ArrowUpDown className="w-4 h-4 mr-2" strokeWidth={2} />
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">По дате</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
                <SelectItem value="size">По размеру</SelectItem>
                <SelectItem value="versions">По версиям</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {}
      <main className="p-8">
        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className="bg-white border-0 shadow-sm hover:shadow-md transition-all group cursor-pointer"
              onClick={() => onDocumentOpen?.(doc.id)}
            >
              <div className="p-5">
                <div className="flex items-center gap-4">
                  {}
                  <div className={`w-14 h-14 rounded-2xl ${getCategoryIcon(doc.category)} flex items-center justify-center flex-shrink-0`}>
                    <FileText className="w-7 h-7" strokeWidth={2} />
                  </div>

                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="tracking-tight truncate">{doc.name}</h3>
                      {doc.starred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" strokeWidth={2} />
                      )}
                      <Badge className={`${getStatusColor(doc.status)} border-0 text-xs`}>
                        {getStatusText(doc.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5" strokeWidth={2} />
                        {doc.case}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" strokeWidth={2} />
                        {doc.client}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" strokeWidth={2} />
                        {doc.type}
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="text-right">
                      <div className="text-gray-900 mb-0.5">{doc.size}</div>
                      <div className="text-xs">{doc.date}</div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50">
                      <History className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
                      <span className="text-purple-700">{doc.versions}</span>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Eye className="w-4 h-4 text-blue-500" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Download className="w-4 h-4 text-green-500" strokeWidth={2} />
                    </Button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl hover:bg-gray-100"
                          >
                            <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => navigate(`/documents/${doc.id}/versions`)}>
                            <History className="w-4 h-4 mr-2" strokeWidth={2} />
                            История версий
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="w-4 h-4 mr-2" strokeWidth={2} />
                            {doc.starred ? 'Убрать из избранного' : 'В избранное'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
