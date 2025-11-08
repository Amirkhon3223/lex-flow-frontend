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
import { User, Mail, Phone, MapPin, Calendar, Building2, Hash, Tag } from 'lucide-react';
import { Button } from '@/shared/ui/button'; // shared/ui в FSD
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'; // shared/ui в FSD
import { Input } from '@/shared/ui/input'; // shared/ui в FSD
import { Label } from '@/shared/ui/label'; // shared/ui в FSD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'; // shared/ui в FSD
import { Separator } from '@/shared/ui/separator'; // shared/ui в FSD
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted:', formData);
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-3xl p-0">
        <DialogHeader className="px-8 pt-8 pb-6">
          <DialogTitle className="text-2xl tracking-tight">Редактирование клиента</DialogTitle>
          <DialogDescription className="text-gray-500">
            Обновите информацию о клиенте
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg tracking-tight mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-500" strokeWidth={2} />
                </div>
                Личные данные
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm text-gray-600">
                    Фамилия
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                    placeholder="Иванов"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm text-gray-600">
                    Имя
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                    placeholder="Петр"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-sm text-gray-600">
                    Отчество
                  </Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleChange('middleName', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                    placeholder="Алексеевич"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    Дата рождения
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inn" className="text-sm text-gray-600 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    ИНН
                  </Label>
                  <Input
                    id="inn"
                    value={formData.inn}
                    onChange={(e) => handleChange('inn', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                    placeholder="771234567890"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {}
            <div>
              <h3 className="text-lg tracking-tight mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-500" strokeWidth={2} />
                </div>
                Контактные данные
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                    placeholder="ivanov@mail.ru"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="address" className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  Адрес
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                  placeholder="г. Москва, ул. Ленина, д. 10, кв. 25"
                />
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {}
            <div>
              <h3 className="text-lg tracking-tight mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-purple-500" strokeWidth={2} />
                </div>
                Дополнительная информация
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientType" className="text-sm text-gray-600 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    Тип клиента
                  </Label>
                  <Select
                    value={formData.clientType}
                    onValueChange={(value) => handleChange('clientType', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="individual">Физическое лицо</SelectItem>
                      <SelectItem value="legal">Юридическое лицо</SelectItem>
                      <SelectItem value="entrepreneur">ИП</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm text-gray-600">
                    Категория
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="standard">Стандарт</SelectItem>
                      <SelectItem value="premium">Премиум</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source" className="text-sm text-gray-600">
                    Источник
                  </Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleChange('source', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="website">Сайт</SelectItem>
                      <SelectItem value="referral">Рекомендация</SelectItem>
                      <SelectItem value="advertising">Реклама</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="notes" className="text-sm text-gray-600">
                  Заметки
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="min-h-[100px] rounded-xl border-gray-200 focus-visible:ring-blue-500 resize-none"
                  placeholder="Дополнительная информация о клиенте..."
                />
              </div>
            </div>
          </div>

          {}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
            >
              Сохранить изменения
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
