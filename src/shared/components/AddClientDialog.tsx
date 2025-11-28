/**
 * @file AddClientDialog.tsx
 * @description Диалог для добавления нового клиента (физлицо или юрлицо)
 */

import { useState } from 'react';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Briefcase,
} from 'lucide-react';
import { ClientTypeEnum } from '@/app/types/clients/clients.enums';
import type { CreateClientInterface } from "@/app/types/clients/clients.interfaces.ts";
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (clientData: CreateClientInterface) => void;
}

export function AddClientDialog({ open, onOpenChange, onSubmit }: AddClientDialogProps) {
  const { t } = useI18n();
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
    notes: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...formData, type: clientType });
    onOpenChange(false);

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
      notes: '',
      category: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-background/95 backdrop-blur-2xl border-border/50 flex flex-col overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2} />
            </div>
            {t('CLIENTS.NEW_CLIENT')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-6 px-6 overflow-y-auto flex-1">
            <Tabs value={clientType} onValueChange={(v) => setClientType(v as ClientTypeEnum)}>
              <TabsList className="grid w-full grid-cols-2 bg-muted rounded-xl p-1">
                <TabsTrigger value={ClientTypeEnum.INDIVIDUAL} className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <User className="w-4 h-4 mr-2" strokeWidth={2} />
                  {t('CLIENTS.TYPES.INDIVIDUAL')}
                </TabsTrigger>
                <TabsTrigger value={ClientTypeEnum.LEGAL} className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Building2 className="w-4 h-4 mr-2" strokeWidth={2} />
                  {t('CLIENTS.TYPES.LEGAL')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={ClientTypeEnum.INDIVIDUAL} className="space-y-4 mt-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm text-foreground">
                      {t('USER_PROFILE.LAST_NAME')} *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Иванов"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-12 rounded-xl border-input focus-visible:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm text-foreground">
                      {t('USER_PROFILE.FIRST_NAME')} *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Петр"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-12 rounded-xl border-input focus-visible:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-sm text-foreground">
                      {t('USER_PROFILE.MIDDLE_NAME')}
                    </Label>
                    <Input
                      id="middleName"
                      placeholder="Алексеевич"
                      value={formData.middleName}
                      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      className="h-12 rounded-xl border-input focus-visible:ring-purple-500"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value={ClientTypeEnum.LEGAL} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm text-foreground">
                    {t('CLIENTS.FIELDS.COMPANY_NAME')} *
                  </Label>
                  <Input
                    id="companyName"
                    placeholder='ООО "ТехноСтрой"'
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="h-12 rounded-xl border-input focus-visible:ring-purple-500"
                    required={clientType === ClientTypeEnum.LEGAL}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inn" className="text-sm text-foreground">
                      {t('CLIENTS.FIELDS.INN')}
                    </Label>
                    <Input
                      id="inn"
                      placeholder="1234567890"
                      value={formData.inn}
                      onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                      className="h-12 rounded-xl border-input focus-visible:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpp" className="text-sm text-foreground">
                      {t('CLIENTS.FIELDS.KPP')}
                    </Label>
                    <Input
                      id="kpp"
                      placeholder="123456789"
                      value={formData.kpp}
                      onChange={(e) => setFormData({ ...formData, kpp: e.target.value })}
                      className="h-12 rounded-xl border-input focus-visible:ring-purple-500"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-foreground">
                  {t('CLIENTS.FIELDS.EMAIL')} *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 pl-12 rounded-xl border-input focus-visible:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-foreground">
                  {t('CLIENTS.FIELDS.PHONE')} *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 pl-12 rounded-xl border-input focus-visible:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm text-foreground">
                {t('CLIENTS.FIELDS.ADDRESS')}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" strokeWidth={2} />
                <Input
                  id="address"
                  placeholder="г. Москва, ул. Пушкина, д. 10"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-12 pl-12 rounded-xl border-input focus-visible:ring-purple-500"
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
                <SelectTrigger className="h-12 rounded-xl border-input">
                  <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                  <SelectValue placeholder={t('CLIENTS.SELECT_CATEGORY')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vip">{t('CLIENTS.CATEGORY.VIP')}</SelectItem>
                  <SelectItem value="regular">{t('CLIENTS.CATEGORY.REGULAR')}</SelectItem>
                  <SelectItem value="new">{t('CLIENTS.CATEGORY.NEW')}</SelectItem>
                  <SelectItem value="potential">{t('CLIENTS.CATEGORY.POTENTIAL')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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
              className="flex-1 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-md"
            >
              <Users className="w-4 h-4 mr-2" strokeWidth={2} />
              {t('CLIENTS.CREATE_CLIENT')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
