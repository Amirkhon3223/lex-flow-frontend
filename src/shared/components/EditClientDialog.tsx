/**
 * @file EditClientDialog.tsx
 * @description Диалог редактирования информации о существующем клиенте
 *
 * НАЗНАЧЕНИЕ:
 * - Редактирование данных клиента (физлицо или юрлицо)
 * - Обновление личных, контактных и дополнительных данных
 * - Предзаполнение формы текущими данными клиента
 *
 * ИСПОЛЬЗОВАНИЕ:
 * - Открывается из списка клиентов (dropdown меню → Редактировать)
 * - Открывается из детальной страницы клиента (кнопка "Редактировать")
 * - Используется в ClientsListView и ClientDetailView
 *
 * МИГРАЦИЯ В FSD:
 * - Перенести в src/features/clients/ui/EditClientDialog.tsx
 * - Логику формы в src/features/clients/model/useEditClientForm.ts
 * - API в src/entities/client/api/updateClient.ts
 *
 * ПЕРЕИСПОЛЬЗУЕМОСТЬ:
 * - Feature компонент для работы с клиентами
 * - Похож на AddClientDialog, но с предзаполнением
 * - Можно объединить с AddClientDialog в один компонент с режимами create/edit
 *
 * ОСОБЕННОСТИ:
 * - Три секции: Личные данные / Контактные данные / Дополнительная информация
 * - Предзаполнение всех полей текущими данными
 * - Поля: ФИО, дата рождения, ИНН, email, телефон, адрес
 * - Дополнительно: тип клиента, категория, источник, заметки
 * - Визуальное разделение секций (Separator)
 * - Иконки для каждой секции (User, Phone, Tag)
 *
 * TODO:
 * - Добавить валидацию (email, телефон, ИНН)
 * - Реализовать API integration
 * - Добавить загрузку аватара клиента
 * - История изменений
 * - Diff текущих и новых данных перед сохранением
 */

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Hash, Tag } from 'lucide-react';
import { Button } from '@/shared/ui/button'; // shared/ui в FSD
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'; // shared/ui в FSD
import { Input } from '@/shared/ui/input'; // shared/ui в FSD
import { Label } from '@/shared/ui/label'; // shared/ui в FSD
import { ScrollArea } from '@/shared/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'; // shared/ui в FSD
// shared/ui в FSD
import { Textarea } from '@/shared/ui/textarea'; // shared/ui в FSD

interface EditClientDialogProps {
  open: boolean; // Состояние открытия диалога
  onOpenChange: (open: boolean) => void; // Callback для закрытия/открытия
}

export function EditClientDialog({ open, onOpenChange }: EditClientDialogProps) {
  const [formData, setFormData] = useState({
    firstName: 'Петр',
    lastName: 'Иванов',
    middleName: 'Алексеевич',
    email: 'ivanov@mail.ru',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Ленина, д. 10, кв. 25',
    birthDate: '1985-03-15',
    inn: '771234567890',
    clientType: 'individual',
    category: 'vip',
    source: 'referral',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Form submitted:', formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden bg-background border-0 shadow-2xl rounded-3xl p-0">
        <DialogHeader className="px-8 pt-8 pb-4 bg-background z-10">
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
            </div>
            Редактирование клиента
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base ml-14">
            Обновите информацию о клиенте. Все изменения будут сохранены в истории.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-8 -mx-6">
          <form id="edit-client-form" onSubmit={handleSubmit} className="space-y-8 pb-8 px-6">
            {/* Personal Data Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg">Личные данные</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="h-11 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="h-11 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Отчество</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleChange('middleName', e.target.value)}
                    className="h-11 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Дата рождения</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      className="h-11 pl-10 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Data Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg">Контактные данные</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="h-11 pl-10 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="h-11 pl-10 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                    />
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Адрес</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="h-11 pl-10 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg">Дополнительно</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inn">ИНН</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="inn"
                      value={formData.inn}
                      onChange={(e) => handleChange('inn', e.target.value)}
                      className="h-11 pl-10 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientType">Тип клиента</Label>
                  <Select
                    value={formData.clientType}
                    onValueChange={(value) => handleChange('clientType', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-input">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Физическое лицо</SelectItem>
                      <SelectItem value="entity">Юридическое лицо</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-input">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Стандарт</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="corporate">Корпоративный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Источник</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleChange('source', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-input">
                      <SelectValue placeholder="Выберите источник" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Сайт</SelectItem>
                      <SelectItem value="referral">Рекомендация</SelectItem>
                      <SelectItem value="adv">Реклама</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Заметки</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="min-h-[100px] rounded-xl bg-muted/30 border-input focus:bg-background transition-colors resize-none"
                    placeholder="Дополнительная информация о клиенте..."
                  />
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-8 py-6 bg-background border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 px-6 rounded-xl border-input hover:bg-muted"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            form="edit-client-form"
            className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
          >
            Сохранить изменения
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
