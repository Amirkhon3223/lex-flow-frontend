/**
 * @file AddCaseDialog.tsx
 * @description Диалог для создания нового юридического дела
 */

import { useState, useEffect } from 'react';
import { Briefcase, User, Tag, DollarSign } from 'lucide-react';
import { useCasesStore } from '@/app/store/cases.store';
import { useClientsStore } from '@/app/store/clients.store';
import { useAuthStore } from '@/app/store/auth.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
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
import { Textarea } from '@/shared/ui/textarea';
import { DatePicker } from '@/shared/ui/date-picker';
import { formatDescription } from '@/shared/utils/textFormatting';

interface AddCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (caseData: any) => void;
  caseId?: string;
  preselectedClientId?: string;
}

export function AddCaseDialog({
  open,
  onOpenChange,
  onSubmit,
  caseId,
  preselectedClientId,
}: AddCaseDialogProps) {
  const { t } = useI18n();
  const { clients, fetchClients } = useClientsStore();
  const { createCase, updateCase, fetchCaseById, selectedCase } = useCasesStore();
  const { user } = useAuthStore();

  // Get currency symbol based on user preference
  const getCurrencySymbol = () => {
    const currency = user?.currency || 'USD';
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'RUB':
        return '₽';
      case 'TJS':
        return 'сом.';
      case 'UZS':
        return 'сўм';
      case 'KZT':
        return '₸';
      case 'CAD':
        return 'C$';
      default:
        return '$';
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    client: preselectedClientId || '',
    category: '',
    deadline: '',
    courtDate: '',
    fee: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (open) {
      fetchClients({ limit: 100 });
      if (caseId) {
        fetchCaseById(caseId);
      }
    }
  }, [open, fetchClients, caseId, fetchCaseById]);

  useEffect(() => {
    if (caseId && selectedCase && open) {
      setFormData({
        title: selectedCase.title,
        client: selectedCase.clientId,
        category: selectedCase.category,
        deadline: selectedCase.deadline?.split('T')[0] || '',
        courtDate: selectedCase.courtDate?.split('T')[0] || '',
        fee: selectedCase.fee?.toString() || '',
        description: selectedCase.description || '',
        priority: selectedCase.priority,
      });
    } else if (!caseId && preselectedClientId && open) {
      setFormData((prev) => ({ ...prev, client: preselectedClientId }));
    }
  }, [caseId, selectedCase, open, preselectedClientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const caseData = {
        title: formData.title,
        clientId: formData.client,
        category: formData.category,
        deadline: formData.deadline,
        courtDate: formData.courtDate || undefined,
        fee: parseFloat(formData.fee) || 0,
        description: formatDescription(formData.description),
        priority: formData.priority as any,
      };

      if (caseId) {
        await updateCase(caseId, caseData);
      } else {
        await createCase(caseData);
      }

      onSubmit?.(formData);
      onOpenChange(false);

      if (!caseId) {
        setFormData({
          title: '',
          client: '',
          category: '',
          deadline: '',
          courtDate: '',
          fee: '',
          description: '',
          priority: 'medium',
        });
      }
    } catch (error) {
      console.error('Failed to save case:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-background/95 backdrop-blur-2xl border-border/50 flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            </div>
            {caseId ? t('CASES.EDIT_DIALOG.TITLE') : t('CASES.NEW_CASE')}
          </DialogTitle>
          <DialogDescription className="sr-only">{t('CASES.SUBTITLE')}</DialogDescription>
        </DialogHeader>

        <form
          id="case-form"
          onSubmit={handleSubmit}
          className="space-y-6 mt-4 flex-1 pr-2 px-5 overflow-y-auto"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-foreground">
              {t('CASES.FIELDS.TITLE')} *
            </Label>
            <Input
              id="title"
              placeholder={t('CASES.TITLE_PLACEHOLDER')}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-12 rounded-xl border-input focus-visible:ring-blue-500"
              required
            />
          </div>

          {}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm text-foreground">
                {t('CASES.FIELDS.CLIENT')} *
              </Label>
              <Select
                value={formData.client}
                onValueChange={(value) => setFormData({ ...formData, client: value })}
                disabled={!!preselectedClientId && !caseId}
                required
              >
                <SelectTrigger className="h-12 rounded-xl border-input">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                  <SelectValue placeholder={t('CASES.SELECT_CLIENT')} />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.companyName || `${client.firstName} ${client.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-foreground">
                {t('CASES.FIELDS.CATEGORY')} *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="h-12 rounded-xl border-input">
                  <Tag className="w-4 h-4 mr-2 text-muted-foreground" strokeWidth={2} />
                  <SelectValue placeholder={t('CASES.SELECT_CATEGORY')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="labor">{t('CASES.CATEGORIES.LABOR')}</SelectItem>
                  <SelectItem value="civil">{t('CASES.CATEGORIES.CIVIL')}</SelectItem>
                  <SelectItem value="family">{t('CASES.CATEGORIES.FAMILY')}</SelectItem>
                  <SelectItem value="inheritance">{t('CASES.CATEGORIES.INHERITANCE')}</SelectItem>
                  <SelectItem value="contract">{t('CASES.CATEGORIES.CONTRACT')}</SelectItem>
                  <SelectItem value="corporate">{t('CASES.CATEGORIES.CORPORATE')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm text-foreground">
                {t('CASES.FIELDS.DEADLINE')}
              </Label>
              <DatePicker
                value={formData.deadline}
                onChange={(date) => setFormData({ ...formData, deadline: date })}
                placeholder={t('CASES.SELECT_DEADLINE')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courtDate" className="text-sm text-foreground">
                {t('CASES.FIELDS.COURT_DATE')}
              </Label>
              <DatePicker
                value={formData.courtDate}
                onChange={(date) => setFormData({ ...formData, courtDate: date })}
                placeholder={t('CASES.SELECT_COURT_DATE')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fee" className="text-sm text-foreground">
                {t('CASES.FIELDS.FEE')} ({getCurrencySymbol()})
              </Label>
              <div className="relative">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  id="fee"
                  type="number"
                  placeholder="150000"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="h-12 pl-12 rounded-xl border-input focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm text-foreground">
              {t('CASES.FIELDS.PRIORITY')}
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="h-12 rounded-xl border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('CASES.PRIORITY.LOW')}</SelectItem>
                <SelectItem value="medium">{t('CASES.PRIORITY.MEDIUM')}</SelectItem>
                <SelectItem value="high">{t('CASES.PRIORITY.HIGH')}</SelectItem>
                <SelectItem value="urgent">{t('CASES.PRIORITY.URGENT')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-foreground">
              {t('CASES.FIELDS.DESCRIPTION')}
            </Label>
            <Textarea
              id="description"
              placeholder={t('CASES.DESCRIPTION_PLACEHOLDER')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[120px] rounded-xl border-input focus-visible:ring-blue-500 resize-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-3 pt-4 border-t border-border flex-shrink-0">
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
            form="case-form"
            className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
          >
            <Briefcase className="w-4 h-4 mr-2" strokeWidth={2} />
            {caseId ? t('CASES.EDIT_DIALOG.SAVE') : t('CASES.CREATE_CASE')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
