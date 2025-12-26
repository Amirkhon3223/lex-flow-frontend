import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/store/auth.store';
import { useTeamStore } from '@/app/store/team.store';
import { TeamMemberItem } from '@/modules/settings/components/TeamMemberItem';
import { InviteTeamMemberDialog } from '@/shared/components/InviteTeamMemberDialog';
import { useI18n } from '@/shared/context/I18nContext';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function TeamTabContent() {
  const { t } = useI18n();
  const { workspace, role } = useAuthStore();
  const { members, invites, availableSlots, maxMembers, fetchMembers, fetchInvites, inviteMember } =
    useTeamStore();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch team data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchMembers(), fetchInvites()]);
      } catch (error) {
        console.error('Failed to fetch team data:', error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  // Team management только на Pro Max плане
  const hasProMaxPlan = workspace?.planId === 'pro_max';
  // Управление командой доступно owner и admin
  const canManageTeam = (role === 'owner' || role === 'admin') && hasProMaxPlan;

  const handleInvite = () => {
    if (availableSlots <= 0) {
      toast.error(t('SETTINGS.TEAM.NO_SLOTS'));
      return;
    }
    setIsInviteDialogOpen(true);
  };

  const handleInviteSubmit = async (data: { email: string; role: string }) => {
    setLoading(true);
    try {
      await inviteMember({ email: data.email, role: data.role as any });
      toast.success(t('SETTINGS.TEAM.INVITE_SENT'));
      setIsInviteDialogOpen(false);
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Invite error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSettings = (memberId: string) => {
    console.log('Настройки члена команды:', memberId);
  };

  const getRoleTranslation = (role: string) => {
    switch (role) {
      case 'owner':
        return t('SETTINGS.TEAM.ROLES.OWNER');
      case 'admin':
        return t('SETTINGS.TEAM.ROLES.ADMIN');
      case 'lawyer':
        return t('SETTINGS.TEAM.ROLES.LAWYER');
      case 'assistant':
        return t('SETTINGS.TEAM.ROLES.ASSISTANT');
      default:
        return role;
    }
  };

  if (!canManageTeam) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('SETTINGS.TEAM.UPGRADE_REQUIRED')}</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <InviteTeamMemberDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteSubmit}
      />

      <div className="space-y-4 sm:space-y-6">
        <Card>
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 md:mb-6">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl tracking-tight">
                  {t('SETTINGS.TEAM.MEMBERS')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {members.length} / {maxMembers} {t('SETTINGS.TEAM.SLOTS_USED')} •{' '}
                  {availableSlots} {t('SETTINGS.TEAM.AVAILABLE')}
                </p>
              </div>
              <Button
                onClick={handleInvite}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4"
                disabled={availableSlots <= 0 || loading}
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" strokeWidth={2} />
                <span className="hidden sm:inline">{t('SETTINGS.TEAM.INVITE_MEMBER')}</span>
              </Button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {members.length > 0 ? (
                members.map((member) => (
                  <TeamMemberItem
                    key={member.id}
                    member={{
                      name: `${member.firstName} ${member.lastName}`,
                      email: member.email,
                      role: member.role as any,
                      status: getRoleTranslation(member.role),
                    }}
                    onSettings={() => handleMemberSettings(member.id)}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('SETTINGS.TEAM.NO_MEMBERS')}
                </p>
              )}
            </div>

            {invites.length > 0 && (
              <>
                <div className="mt-6 mb-3">
                  <h4 className="text-sm font-medium">{t('SETTINGS.TEAM.PENDING_INVITES')}</h4>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between gap-2 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-muted/50 border border-dashed"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-medium">{invite.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {getRoleTranslation(invite.role)} • {t('SETTINGS.TEAM.INVITED')}{' '}
                          {new Date(invite.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {t('SETTINGS.TEAM.PENDING')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
