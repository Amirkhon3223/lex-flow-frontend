/**
 * @file VariableSelector.tsx
 * @description Component to select and insert template variables
 */

import { useState, useEffect, memo } from 'react';
import { Plus, User, Briefcase, UserCircle, Settings, ChevronRight, Search } from 'lucide-react';
import { useTemplatesStore } from '@/app/store/templates.store';
import type { TemplateVariable, VariableSelectorProps } from '@/app/types/templates/templates.types';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const defaultVariables: Record<string, TemplateVariable[]> = {
  client: [
    { key: 'client.fullName', label: 'Full Name', group: 'client', type: 'text', required: true },
    { key: 'client.firstName', label: 'First Name', group: 'client', type: 'text' },
    { key: 'client.lastName', label: 'Last Name', group: 'client', type: 'text' },
    { key: 'client.middleName', label: 'Middle Name', group: 'client', type: 'text' },
    { key: 'client.companyName', label: 'Company Name', group: 'client', type: 'text' },
    { key: 'client.email', label: 'Email', group: 'client', type: 'text' },
    { key: 'client.phone', label: 'Phone', group: 'client', type: 'text' },
    { key: 'client.address', label: 'Address', group: 'client', type: 'text' },
    { key: 'client.inn', label: 'INN', group: 'client', type: 'text' },
    { key: 'client.kpp', label: 'KPP', group: 'client', type: 'text' },
    { key: 'client.type', label: 'Client Type', group: 'client', type: 'text' },
  ],
  case: [
    { key: 'case.title', label: 'Case Title', group: 'case', type: 'text', required: true },
    { key: 'case.number', label: 'Case Number', group: 'case', type: 'text' },
    { key: 'case.category', label: 'Category', group: 'case', type: 'text' },
    { key: 'case.status', label: 'Status', group: 'case', type: 'text' },
    { key: 'case.description', label: 'Description', group: 'case', type: 'text' },
    { key: 'case.deadline', label: 'Deadline', group: 'case', type: 'date' },
    { key: 'case.courtDate', label: 'Court Date', group: 'case', type: 'date' },
    { key: 'case.fee', label: 'Fee', group: 'case', type: 'number' },
  ],
  user: [
    { key: 'user.fullName', label: 'Full Name', group: 'user', type: 'text', required: true },
    { key: 'user.firstName', label: 'First Name', group: 'user', type: 'text' },
    { key: 'user.lastName', label: 'Last Name', group: 'user', type: 'text' },
    { key: 'user.email', label: 'Email', group: 'user', type: 'text' },
    { key: 'user.phone', label: 'Phone', group: 'user', type: 'text' },
    { key: 'user.position', label: 'Position', group: 'user', type: 'text' },
    { key: 'user.company', label: 'Company', group: 'user', type: 'text' },
  ],
  custom: [
    { key: 'date.today', label: 'Today Date', group: 'custom', type: 'date' },
    { key: 'date.formatted', label: 'Formatted Date', group: 'custom', type: 'date' },
    { key: 'document.number', label: 'Document Number', group: 'custom', type: 'text' },
    { key: 'custom.text', label: 'Custom Text', group: 'custom', type: 'text' },
  ],
};

const groupIcons = {
  client: User,
  case: Briefcase,
  user: UserCircle,
  custom: Settings,
};

export const VariableSelector = memo(function VariableSelector({
  onSelect,
  className,
}: VariableSelectorProps) {
  const { t } = useI18n();
  const { availableVariables, fetchAvailableVariables } = useTemplatesStore();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('client');

  useEffect(() => {
    if (open && !availableVariables) {
      fetchAvailableVariables().catch(() => {});
    }
  }, [open, availableVariables, fetchAvailableVariables]);

  const variables = availableVariables || defaultVariables;

  const handleSelect = (variable: TemplateVariable) => {
    onSelect(`{{${variable.key}}}`);
    setOpen(false);
    setSearchQuery('');
  };

  const filterVariables = (vars: TemplateVariable[]) => {
    if (!searchQuery.trim()) return vars;
    const query = searchQuery.toLowerCase();
    return vars.filter(
      (v) =>
        v.key.toLowerCase().includes(query) ||
        v.label.toLowerCase().includes(query) ||
        v.description?.toLowerCase().includes(query)
    );
  };

  const getGroupLabel = (group: string) => {
    const labels: Record<string, string> = {
      client: t('TEMPLATES.VARIABLE_GROUPS.CLIENT'),
      case: t('TEMPLATES.VARIABLE_GROUPS.CASE'),
      user: t('TEMPLATES.VARIABLE_GROUPS.USER'),
      custom: t('TEMPLATES.VARIABLE_GROUPS.CUSTOM'),
    };
    return labels[group] || group;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`rounded-lg gap-1.5 ${className}`}
        >
          <Plus className="w-4 h-4" />
          {t('TEMPLATES.INSERT_VARIABLE')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('TEMPLATES.SEARCH_VARIABLES')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-lg"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-none border-b border-border">
            {Object.keys(variables).map((group) => {
              const Icon = groupIcons[group as keyof typeof groupIcons];
              return (
                <TabsTrigger
                  key={group}
                  value={group}
                  className="flex-1 gap-1.5 text-xs py-1.5 data-[state=active]:bg-background"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {getGroupLabel(group)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(variables).map(([group, vars]) => (
            <TabsContent key={group} value={group} className="mt-0">
              <ScrollArea className="h-64">
                <div className="p-2">
                  {filterVariables(vars as TemplateVariable[]).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t('TEMPLATES.NO_VARIABLES_FOUND')}
                    </p>
                  ) : (
                    filterVariables(vars as TemplateVariable[]).map((variable) => (
                      <button
                        key={variable.key}
                        type="button"
                        onClick={() => handleSelect(variable)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-blue-600 dark:text-blue-400">
                              {`{{${variable.key}}}`}
                            </code>
                            {variable.required && (
                              <span className="text-[10px] text-red-500 font-medium">*</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {variable.label}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
});

VariableSelector.displayName = 'VariableSelector';
