/**
 * @file ClientFormModal.tsx
 * @description Унифицированный диалог для создания и редактирования клиентов
 *
 * НАЗНАЧЕНИЕ:
 * - Единый компонент для создания нового клиента и редактирования существующего
 * - Поддержка физических лиц и юридических лиц
 * - 3-колоночная сетка для компактного отображения формы
 *
 * ИСПОЛЬЗОВАНИЕ:
 * - mode: 'create' | 'edit' - режим работы диалога
 * - client?: ClientInterface - данные клиента для редактирования (обязательно для mode='edit')
 *
 * ОСОБЕННОСТИ:
 * - Переключатель типа клиента (физлицо/юрлицо) только для режима создания
 * - В режиме редактирования тип клиента отображается только для информации
 * - 3-колоночная сетка для оптимального использования пространства
 * - Все поля из API спецификации
 * - Полная поддержка валидации и i18n
 */

import { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Briefcase,
  Hash,
  Shield,
} from 'lucide-react';
import { useClientsStore } from '@/app/store/clients.store';
import {
  ClientTypeEnum,
  ClientCategoryEnum,
  ClientStatusEnum,
} from '@/app/types/clients/clients.enums';
import type {
  ClientInterface,
  CreateClientInterface,
  UpdateClientInterface,
} from '@/app/types/clients/clients.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  client?: ClientInterface;
}

export function ClientFormModal({ open, onOpenChange, mode, client }: ClientFormModalProps) {
  const { t } = useI18n();
  const { createClient, updateClient } = useClientsStore();
  const [clientType, setClientType] = useState<ClientTypeEnum>(ClientTypeEnum.INDIVIDUAL);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    companyName: '',
    inn: '',
    kpp: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    category: '',
    status: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && client) {
        setClientType(client.type);
        setFormData({
          firstName: client.firstName || '',
          lastName: client.lastName || '',
          middleName: client.middleName || '',
          companyName: client.companyName || '',
          inn: client.inn || '',
          kpp: client.kpp || '',
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          birthDate: client.birthDate || '',
          category: client.category || '',
          status: client.status || '',
          notes: client.notes || '',
        });
      } else {
        setClientType(ClientTypeEnum.INDIVIDUAL);
        setFormData({
          firstName: '',
          lastName: '',
          middleName: '',
          companyName: '',
          inn: '',
          kpp: '',
          email: '',
          phone: '',
          address: '',
          birthDate: '',
          category: '',
          status: '',
          notes: '',
        });
      }
    }
  }, [open, mode, client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'create') {
        const clientData: CreateClientInterface = {
          type: clientType,
          email: formData.email,
          phone: formData.phone,
        };

        // Отправляем ВСЕ заполненные поля независимо от типа клиента
        // (backend принимает все поля для любого типа)
        if (formData.firstName) clientData.firstName = formData.firstName;
        if (formData.lastName) clientData.lastName = formData.lastName;
        if (formData.middleName) clientData.middleName = formData.middleName;
        if (formData.companyName) clientData.companyName = formData.companyName;
        if (formData.inn) clientData.inn = formData.inn;
        if (formData.kpp) clientData.kpp = formData.kpp;
        if (formData.birthDate) clientData.birthDate = formData.birthDate;
        if (formData.address) clientData.address = formData.address;
        if (formData.notes) clientData.notes = formData.notes;
        if (formData.category) clientData.category = formData.category as ClientCategoryEnum;

        await createClient(clientData);
      } else {
        if (!client) return;

        const updateData: UpdateClientInterface = {};

        if (formData.firstName) updateData.firstName = formData.firstName;
        if (formData.lastName) updateData.lastName = formData.lastName;
        if (formData.middleName) updateData.middleName = formData.middleName;
        if (formData.companyName) updateData.companyName = formData.companyName;
        if (formData.inn) updateData.inn = formData.inn;
        if (formData.kpp) updateData.kpp = formData.kpp;
        if (formData.birthDate) updateData.birthDate = formData.birthDate;
        if (formData.email) updateData.email = formData.email;
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.address) updateData.address = formData.address;
        if (formData.category) updateData.category = formData.category as ClientCategoryEnum;
        if (formData.status) updateData.status = formData.status as ClientStatusEnum;
        if (formData.notes) updateData.notes = formData.notes;

        await updateClient(client.id, updateData);
      }

      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${mode} client:`, error);
    }
  };

  const getDialogTitle = () => {
    return mode === 'create' ? t('CLIENTS.NEW_CLIENT') : t('CLIENTS.EDIT_DIALOG.TITLE');
  };

  const getDialogDescription = () => {
    return mode === 'create'
      ? t('CLIENTS.ADD_DIALOG.DESCRIPTION')
      : t('CLIENTS.EDIT_DIALOG.DESCRIPTION');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl! max-h-[90vh] bg-background/95 backdrop-blur-2xl border-border/50 flex flex-col overflow-hidden p-0">
        <DialogHeader className="px-6 pt-4 pb-2 flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              {mode === 'create' ? (
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2} />
              ) : (
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
              )}
            </div>
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="sr-only">{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-6 px-6 overflow-y-auto flex-1">
            {}
            {mode === 'create' ? (
              <Tabs value={clientType} onValueChange={(v) => setClientType(v as ClientTypeEnum)}>
                <TabsList className="grid w-full grid-cols-2 bg-muted rounded-xl p-1">
                  <TabsTrigger
                    value={ClientTypeEnum.INDIVIDUAL}
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <User className="w-4 h-4 mr-2" strokeWidth={2} />
                    {t('CLIENTS.TYPES.INDIVIDUAL')}
                  </TabsTrigger>
                  <TabsTrigger
                    value={ClientTypeEnum.LEGAL}
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Building2 className="w-4 h-4 mr-2" strokeWidth={2} />
                    {t('CLIENTS.TYPES.LEGAL')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
                <span className="text-sm text-muted-foreground">{t('CLIENTS.FIELDS.TYPE')}:</span>
                <Badge variant="secondary" className="gap-2">
                  {clientType === ClientTypeEnum.INDIVIDUAL ? (
                    <>
                      <User className="w-3.5 h-3.5" strokeWidth={2} />
                      {t('CLIENTS.TYPES.INDIVIDUAL')}
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5" strokeWidth={2} />
                      {t('CLIENTS.TYPES.LEGAL')}
                    </>
                  )}
                </Badge>
              </div>
            )}

            {}
            {clientType === ClientTypeEnum.INDIVIDUAL && (
              <div className="space-y-4">
                {}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm text-foreground">
                      {t('USER_PROFILE.LAST_NAME')} {mode === 'create' && '*'}
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Иванов"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-11 rounded-xl border-input focus-visible:ring-purple-500"
                      required={mode === 'create'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm text-foreground">
                      {t('USER_PROFILE.FIRST_NAME')} {mode === 'create' && '*'}
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Иван"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-11 rounded-xl border-input focus-visible:ring-purple-500"
                      required={mode === 'create'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-sm text-foreground">
                      {t('USER_PROFILE.MIDDLE_NAME')}
                    </Label>
                    <Input
                      id="middleName"
                      placeholder="Иванович"
                      value={formData.middleName}
                      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      className="h-11 rounded-xl border-input focus-visible:ring-purple-500"
                    />
                  </div>
                </div>

                {}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inn" className="text-sm text-foreground">
                      {t('CLIENTS.FIELDS.INN')}
                    </Label>
                    <div className="relative">
                      <Hash
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                        strokeWidth={2}
                      />
                      <Input
                        id="inn"
                        placeholder="123456789012"
                        value={formData.inn}
                        onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                        maxLength={12}
                        className="h-11 pl-10 rounded-xl border-input focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpp" className="text-sm text-foreground">
                      {t('CLIENTS.FIELDS.KPP')}
                    </Label>
                    <div className="relative">
                      <Hash
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                        strokeWidth={2}
                      />
                      <Input
                        id="kpp"
                        placeholder="123456789"
                        value={formData.kpp}
                        onChange={(e) => setFormData({ ...formData, kpp: e.target.value })}
                        maxLength={20}
                        className="h-11 pl-10 rounded-xl border-input focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 overflow-hidden">
                    <Label htmlFor="birthDate" className="text-sm text-foreground">
                      {t('CLIENTS.FIELDS.BIRTH_DATE')}
                    </Label>
                    <DatePicker
                      value={formData.birthDate}
                      onChange={(date) => setFormData({ ...formData, birthDate: date })}
                      placeholder={t('CLIENTS.SELECT_BIRTH_DATE')}
                    />
                  </div>
                </div>
              </div>
            )}

            {}
            {clientType === ClientTypeEnum.LEGAL && (
              <div className="space-y-4">
                {}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm text-foreground">
                    {t('CLIENTS.FIELDS.COMPANY_NAME')} {mode === 'create' && '*'}
                  </Label>
                  <Input
                    id="companyName"
                    placeholder='ООО "Рога и Копыта"'
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="h-11 rounded-xl border-input focus-visible:ring-purple-500"
                    required={mode === 'create'}
                  />
                </div>

                {}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inn" className="text-sm text-foreground">
                      {t('CLIENTS.FIELDS.INN')}
                    </Label>
                    <div className="relative">
                      <Hash
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                        strokeWidth={2}
                      />
                      <Input
                        id="inn"
                        placeholder="123456789012"
                        value={formData.inn}
                        onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                        maxLength={12}
                        className="h-11 pl-10 rounded-xl border-input focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpp" className="text-sm text-foreground">
                      {t('CLIENTS.FIELDS.KPP')}
                    </Label>
                    <div className="relative">
                      <Hash
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                        strokeWidth={2}
                      />
                      <Input
                        id="kpp"
                        placeholder="123456789"
                        value={formData.kpp}
                        onChange={(e) => setFormData({ ...formData, kpp: e.target.value })}
                        maxLength={20}
                        className="h-11 pl-10 rounded-xl border-input focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            )}

            {}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-foreground">
                  {t('CLIENTS.FIELDS.EMAIL')} {mode === 'create' && '*'}
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11 pl-10 rounded-xl border-input focus-visible:ring-purple-500"
                    required={mode === 'create'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-foreground">
                  {t('CLIENTS.FIELDS.PHONE')} {mode === 'create' && '*'}
                </Label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d+]/g, '');
                      setFormData({ ...formData, phone: value });
                    }}
                    className="h-11 pl-10 rounded-xl border-input focus-visible:ring-purple-500"
                    required={mode === 'create'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm text-foreground">
                  {t('CLIENTS.FIELDS.CATEGORY')}
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-input">
                    <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                    <SelectValue placeholder={t('CLIENTS.SELECT_CATEGORY')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">{t('CLIENTS.CATEGORY.STANDARD')}</SelectItem>
                    <SelectItem value="premium">{t('CLIENTS.CATEGORY.PREMIUM')}</SelectItem>
                    <SelectItem value="vip">{t('CLIENTS.CATEGORY.VIP')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm text-foreground">
                  {t('CLIENTS.FIELDS.STATUS')}
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-input">
                    <Shield className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                    <SelectValue placeholder={t('CLIENTS.SELECT_STATUS')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('CLIENTS.STATUS.ACTIVE')}</SelectItem>
                    <SelectItem value="inactive">{t('CLIENTS.STATUS.INACTIVE')}</SelectItem>
                    <SelectItem value="pending">{t('CLIENTS.STATUS.PENDING')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="address" className="text-sm text-foreground">
                  {t('CLIENTS.FIELDS.ADDRESS')}
                </Label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="address"
                    placeholder="г. Москва, ул. Пушкина, д. 10"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-11 pl-10 rounded-xl border-input focus-visible:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {}
            <div className="space-y-2 pb-3">
              <Label htmlFor="notes" className="text-sm text-foreground">
                {t('CLIENTS.FIELDS.NOTES')}
              </Label>
              <Textarea
                id="notes"
                placeholder={t('CLIENTS.NOTES_PLACEHOLDER')}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[100px] rounded-xl border-input focus-visible:ring-purple-500 resize-none"
              />
            </div>
          </div>

          {}
          <div className="flex items-center gap-3 px-6 py-6 border-t border-border flex-shrink-0 bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-input hover:bg-muted"
            >
              {t('COMMON.ACTIONS.CANCEL')}
            </Button>
            <Button
              type="submit"
              className={`flex-1 h-12 rounded-xl shadow-md ${
                mode === 'create'
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {mode === 'create' ? (
                <>
                  <Users className="w-4 h-4 mr-2" strokeWidth={2} />
                  {t('CLIENTS.CREATE_CLIENT')}
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" strokeWidth={2} />
                  {t('CLIENTS.EDIT_DIALOG.SAVE_CHANGES')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
