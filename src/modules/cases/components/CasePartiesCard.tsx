import { useState } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { useCasesStore } from '@/app/store/cases.store';
import type { CasePartyInterface, CreateCasePartyInterface } from '@/app/types/cases/cases.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface CasePartiesCardProps {
  caseId: string;
  parties: CasePartyInterface[];
  loading?: boolean;
}

const ROLE_OPTIONS = [
  'opposing_party',
  'opposing_counsel',
  'witness',
  'judge',
  'co_counsel',
  'expert',
  'third_party',
] as const;

function getRoleBadgeClasses(role: string): string {
  switch (role) {
    case 'opposing_party':
    case 'opposing_counsel':
      return 'bg-destructive/15 text-destructive border-destructive/20';
    case 'judge':
      return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'co_counsel':
      return 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20';
    case 'third_party':
      return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    case 'witness':
    case 'expert':
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

function getRoleI18nKey(role: string): string {
  return `PARTIES.ROLE_${role.toUpperCase()}`;
}

export function CasePartiesCard({ caseId, parties, loading }: CasePartiesCardProps) {
  const { t } = useI18n();
  const { addParty, removeParty } = useCasesStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setRole('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!name.trim() || !role) return;

    setSubmitting(true);
    try {
      const data: CreateCasePartyInterface = {
        name: name.trim(),
        role,
        ...(companyName.trim() && { companyName: companyName.trim() }),
        ...(email.trim() && { email: email.trim() }),
        ...(phone.trim() && { phone: phone.trim() }),
        ...(notes.trim() && { notes: notes.trim() }),
      };
      await addParty(caseId, data);
      resetForm();
      setIsDialogOpen(false);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (partyId: string) => {
    try {
      await removeParty(caseId, partyId);
    } catch {
    }
  };

  return (
    <>
      <Card>
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
              {t('PARTIES.TITLE')}
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              {t('PARTIES.ADD')}
            </Button>
          </div>

          <div className="space-y-2">
            {loading && parties.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {t('COMMON.LOADING')}
              </div>
            ) : parties.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {t('PARTIES.EMPTY')}
              </div>
            ) : (
              parties.map((party) => (
                <div
                  key={party.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-muted/50 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {party.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${getRoleBadgeClasses(party.role)}`}
                      >
                        {t(getRoleI18nKey(party.role))}
                      </Badge>
                    </div>
                    {(party.email || party.phone || party.companyName) && (
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                        {party.companyName && <span>{party.companyName}</span>}
                        {party.companyName && (party.email || party.phone) && (
                          <span className="mx-1">&middot;</span>
                        )}
                        {party.email && <span>{party.email}</span>}
                        {party.email && party.phone && (
                          <span className="mx-1">&middot;</span>
                        )}
                        {party.phone && <span>{party.phone}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(party.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('PARTIES.ADD')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>{t('PARTIES.FIELDS.NAME')}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('PARTIES.FIELDS.ROLE')}</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(getRoleI18nKey(r))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('PARTIES.FIELDS.COMPANY')}</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t('PARTIES.FIELDS.EMAIL')}</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{t('PARTIES.FIELDS.PHONE')}</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>{t('PARTIES.FIELDS.NOTES')}</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !name.trim() || !role}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {t('PARTIES.SAVE')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
