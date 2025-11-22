/**
 * @file GlobalSearchDialog.tsx
 * @description Глобальный поиск по всем сущностям приложения
 */

import { useState } from 'react';
import {
  Search,
  FileText,
  Users,
  Briefcase,
  X,
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = {
    cases: [
      { id: 1, title: 'Трудовой спор - незаконное увольнение', client: 'Иванов П.А.', status: 'В работе' },
      { id: 2, title: 'Договор аренды помещения', client: 'ООО "ТехноСтрой"', status: 'Новое' },
    ],
    clients: [
      { id: 1, name: 'Иванов Петр Алексеевич', phone: '+7 (999) 123-45-67', cases: 3 },
      { id: 2, name: 'ООО "ТехноСтрой"', phone: '+7 (495) 777-88-99', cases: 5 },
    ],
    documents: [
      { id: 1, name: 'Исковое заявление.pdf', case: 'Трудовой спор', size: '2.4 MB' },
      { id: 2, name: 'Трудовой договор.pdf', case: 'Трудовой спор', size: '1.8 MB' },
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 bg-background/95 backdrop-blur-2xl border-border/50">
        <DialogTitle className="sr-only">Глобальный поиск</DialogTitle>
        <DialogDescription className="sr-only">Поиск по делам, клиентам и документам</DialogDescription>

        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
            <Input
              placeholder="Поиск клиентов, дел, документов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 bg-muted/50 border-0 rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </Button>
            )}
          </div>
        </div>

        <Separator className="bg-border" />

        <ScrollArea className="max-h-[500px]">
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-500" strokeWidth={2} />
                <h3 className="text-sm font-medium text-foreground">Дела</h3>
                <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                  {searchResults.cases.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {searchResults.cases.map((caseItem) => (
                  <button
                    key={caseItem.id}
                    className="w-full p-4 rounded-xl hover:bg-muted transition-colors text-left group"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">
                          {caseItem.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{caseItem.client}</p>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">
                        {caseItem.status}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-500" strokeWidth={2} />
                <h3 className="text-sm font-medium text-foreground">Клиенты</h3>
                <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                  {searchResults.clients.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {searchResults.clients.map((client) => (
                  <button
                    key={client.id}
                    className="w-full p-4 rounded-xl hover:bg-muted transition-colors text-left group"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">
                          {client.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{client.phone}</p>
                      </div>
                      <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                        {client.cases} дел
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-orange-500" strokeWidth={2} />
                <h3 className="text-sm font-medium text-foreground">Документы</h3>
                <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                  {searchResults.documents.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {searchResults.documents.map((doc) => (
                  <button
                    key={doc.id}
                    className="w-full p-4 rounded-xl hover:bg-muted transition-colors text-left group"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{doc.case} • {doc.size}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
