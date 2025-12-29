import { useI18n } from '@/shared/context/I18nContext';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  ManagedSelect as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/managed-select';
import { Separator } from '@/shared/ui/separator';

interface ProfileTabContentProps {
  profileData: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    position: string;
    company: string;
    address: string;
    specialization: string;
  };
  handleProfileChange: (field: string, value: string) => void;
}

export function ProfileTabContent({ profileData, handleProfileChange }: ProfileTabContentProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
          {t('USER_PROFILE.PERSONAL_INFO')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="lastName" className="text-xs sm:text-sm text-gray-600">
              {t('USER_PROFILE.LAST_NAME')}
            </Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => handleProfileChange('lastName', e.target.value)}
              className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="firstName" className="text-xs sm:text-sm text-gray-600">
              {t('USER_PROFILE.FIRST_NAME')}
            </Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => handleProfileChange('firstName', e.target.value)}
              className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="middleName" className="text-xs sm:text-sm text-gray-600">
              {t('USER_PROFILE.MIDDLE_NAME')}
            </Label>
            <Input
              id="middleName"
              value={profileData.middleName}
              onChange={(e) => handleProfileChange('middleName', e.target.value)}
              className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-gray-100" />

      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
          {t('USER_PROFILE.CONTACT_INFO')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm text-gray-600">
              {t('USER_PROFILE.EMAIL')}
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="phone" className="text-xs sm:text-sm text-gray-600">
              {t('USER_PROFILE.PHONE')}
            </Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-gray-100" />

      <div>
        <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
          {t('USER_PROFILE.PROFESSIONAL_INFO')}
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="position" className="text-xs sm:text-sm text-gray-600">
                {t('USER_PROFILE.POSITION')}
              </Label>
              <Input
                id="position"
                value={profileData.position}
                onChange={(e) => handleProfileChange('position', e.target.value)}
                className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="specialization" className="text-xs sm:text-sm text-gray-600">
                {t('USER_PROFILE.SPECIALIZATION')}
              </Label>
              <Select
                value={profileData.specialization}
                onValueChange={(value) => handleProfileChange('specialization', value)}
              >
                <SelectTrigger className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus:ring-blue-500 text-sm">
                  <SelectValue placeholder={t('USER_PROFILE.SELECT_SPECIALIZATION')} />
                </SelectTrigger>
                <SelectContent className="rounded-lg sm:rounded-xl">
                  <SelectItem value="lawyer">{t('SPECIALIZATION.LAWYER')}</SelectItem>
                  <SelectItem value="attorney">{t('SPECIALIZATION.ATTORNEY')}</SelectItem>
                  <SelectItem value="legal_assistant">
                    {t('SPECIALIZATION.LEGAL_ASSISTANT')}
                  </SelectItem>
                  <SelectItem value="senior_lawyer">{t('SPECIALIZATION.SENIOR_LAWYER')}</SelectItem>
                  <SelectItem value="junior_lawyer">{t('SPECIALIZATION.JUNIOR_LAWYER')}</SelectItem>
                  <SelectItem value="partner">{t('SPECIALIZATION.PARTNER')}</SelectItem>
                  <SelectItem value="other">{t('SPECIALIZATION.OTHER')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="company" className="text-xs sm:text-sm text-gray-600">
              {t('USER_PROFILE.COMPANY')}
            </Label>
            <Input
              id="company"
              value={profileData.company}
              onChange={(e) => handleProfileChange('company', e.target.value)}
              className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="address" className="text-xs sm:text-sm text-gray-600">
              {t('USER_PROFILE.OFFICE_ADDRESS')}
            </Label>
            <Input
              id="address"
              value={profileData.address}
              onChange={(e) => handleProfileChange('address', e.target.value)}
              className="h-9 sm:h-10 lg:h-11 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
