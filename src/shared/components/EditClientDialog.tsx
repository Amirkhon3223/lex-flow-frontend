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

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Hash, Tag } from 'lucide-react';
import { useClientsStore } from '@/app/store/clients.store';
import { ClientCategoryEnum, ClientStatusEnum } from '@/app/types/clients/clients.enums';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { ScrollArea } from '@/shared/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditClientDialog({ open, onOpenChange }: EditClientDialogProps) {
  const { t } = useI18n();
  const { selectedClient, updateClient } = useClientsStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    inn: '',
    category: '',
    status: '',
    notes: '',
  });

  useEffect(() => {
    if (selectedClient && open) {
      setFormData({
        firstName: selectedClient.firstName || '',
        lastName: selectedClient.lastName || '',
        middleName: selectedClient.middleName || '',
        email: selectedClient.email || '',
        phone: selectedClient.phone || '',
        address: selectedClient.address || '',
        birthDate: selectedClient.birthDate || '',
        inn: selectedClient.inn || '',
        category: selectedClient.category || '',
        status: selectedClient.status || '',
        notes: selectedClient.notes || '',
      });
    }
  }, [selectedClient, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) return;

    try {
      await updateClient(selectedClient.id, {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        middleName: formData.middleName || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        birthDate: formData.birthDate || undefined,
        inn: formData.inn || undefined,
        category: formData.category as ClientCategoryEnum || undefined,
        status: formData.status as ClientStatusEnum || undefined,
        notes: formData.notes || undefined,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  if (!selectedClient) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden bg-background border-0 shadow-2xl rounded-3xl p-0">
        <DialogHeader className="px-8 pt-8 pb-4 bg-background z-10">
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
            </div>
            {t('CLIENTS.EDIT_DIALOG.TITLE')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base ml-14">
            {t('CLIENTS.EDIT_DIALOG.DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-8 -mx-6">
          <form id="edit-client-form" onSubmit={handleSubmit} className="space-y-8 pb-8 px-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg">{t('CLIENTS.EDIT_DIALOG.PERSONAL_INFO')}</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('USER_PROFILE.LAST_NAME')}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="h-11 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('USER_PROFILE.FIRST_NAME')}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="h-11 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">{t('USER_PROFILE.MIDDLE_NAME')}</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleChange('middleName', e.target.value)}
                    className="h-11 rounded-xl bg-muted/30 border-input focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">{t('CLIENTS.FIELDS.BIRTH_DATE')}</Label>
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

            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg">{t('CLIENTS.FIELDS.CONTACT_INFO')}</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('CLIENTS.FIELDS.EMAIL')}</Label>
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
                  <Label htmlFor="phone">{t('CLIENTS.FIELDS.PHONE')}</Label>
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
                  <Label htmlFor="address">{t('CLIENTS.FIELDS.ADDRESS')}</Label>
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

            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg">{t('CLIENTS.EDIT_DIALOG.ADDITIONAL_INFO')}</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inn">{t('CLIENTS.FIELDS.INN')}</Label>
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
                  <Label htmlFor="status">{t('CLIENTS.FIELDS.STATUS')}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-input">
                      <SelectValue placeholder={t('CLIENTS.SELECT_STATUS')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('CLIENTS.STATUS.ACTIVE')}</SelectItem>
                      <SelectItem value="inactive">{t('CLIENTS.STATUS.INACTIVE')}</SelectItem>
                      <SelectItem value="pending">{t('CLIENTS.STATUS.PENDING')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('CLIENTS.FIELDS.CATEGORY')}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-input">
                      <SelectValue placeholder={t('CLIENTS.SELECT_CATEGORY')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t('CLIENTS.CATEGORIES.STANDARD')}</SelectItem>
                      <SelectItem value="premium">{t('CLIENTS.CATEGORIES.PREMIUM')}</SelectItem>
                      <SelectItem value="vip">{t('CLIENTS.CATEGORIES.VIP')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"></div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">{t('CLIENTS.FIELDS.NOTES')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="min-h-[100px] rounded-xl bg-muted/30 border-input focus:bg-background transition-colors resize-none"
                    placeholder={t('CLIENTS.NOTES_PLACEHOLDER')}
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
            {t('COMMON.ACTIONS.CANCEL')}
          </Button>
          <Button
            type="submit"
            form="edit-client-form"
            className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
          >
            {t('CLIENTS.EDIT_DIALOG.SAVE_CHANGES')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
