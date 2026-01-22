import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Upload, LogOut, Trash2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { usersService } from '@/app/services/users/users.service';
import { useAuthStore } from '@/app/store/auth.store';
import { AvatarCropperModal } from '@/modules/user-profile/ui/AvatarCropperModal';
import { useI18n } from '@/shared/context/I18nContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { StorageIndicator } from '@/shared/components/StorageIndicator';

export function ProfileSidebar({
  profileData,
  stats,
  onLogout,
}: {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    specialization: string;
    avatarUrl?: string;
  };
  stats: Array<{ label: string; value: string; icon: typeof Briefcase; color: string }>;
  onLogout: () => void;
}) {
  const { t } = useI18n();
  const { user, updateUserData } = useAuthStore();

  const getSpecializationLabel = (spec?: string) => {
    if (!spec) return t('USER_PROFILE.NO_SPECIALIZATION');

    const specializationMap: Record<string, string> = {
      lawyer: t('SPECIALIZATION.LAWYER'),
      attorney: t('SPECIALIZATION.ATTORNEY'),
      legal_assistant: t('SPECIALIZATION.LEGAL_ASSISTANT'),
      senior_lawyer: t('SPECIALIZATION.SENIOR_LAWYER'),
      junior_lawyer: t('SPECIALIZATION.JUNIOR_LAWYER'),
      partner: t('SPECIALIZATION.PARTNER'),
      other: t('SPECIALIZATION.OTHER'),
    };

    return specializationMap[spec] || spec;
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    setAvatarPreview(croppedImageUrl);
    setSelectedImage(null);

    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      const uploadResponse = await usersService.uploadAvatar(file);
      updateUserData({ avatar: uploadResponse.avatarUrl });
      setAvatarPreview(uploadResponse.avatarUrl);
      toast.success(t('USER_PROFILE.AVATAR_UPDATED'));
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Avatar upload error:', error);
      setAvatarPreview(null);
    }
  };

  const handleCropperClose = () => {
    setCropperOpen(false);
    setSelectedImage(null);
  };

  const handleDeleteAccount = async () => {
    if (!confirm(t('USER_PROFILE.DELETE_ACCOUNT_CONFIRM'))) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement proper password and confirmation dialog
      await usersService.deleteAccount('', '');
      toast.success(t('USER_PROFILE.ACCOUNT_DELETED'));
      onLogout();
    } catch (error) {
      toast.error(t('COMMON.ERRORS.GENERIC'));
      console.error('Delete account error:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentAvatarUrl = avatarPreview || user?.avatar || profileData.avatarUrl || null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <div className="text-center">
          <div className="relative inline-block mb-3 sm:mb-4">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-border">
              {currentAvatarUrl && (
                <AvatarImage
                  src={currentAvatarUrl}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl sm:text-3xl">
                {profileData.firstName?.[0] || user?.name?.[0] || '?'}
                {profileData.lastName?.[0] || user?.name?.split(' ')?.[1]?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              size="icon"
              onClick={handleAvatarUpload}
              className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
            </Button>
          </div>

          <h3 className="text-lg sm:text-xl tracking-tight mb-1">
            {profileData.firstName && profileData.lastName
              ? `${profileData.firstName} ${profileData.lastName}`
              : user?.name || t('USER_PROFILE.NO_NAME')}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
            {getSpecializationLabel(profileData.specialization || user?.specialization)}
          </p>
          {user?.role && (
            <Badge className="bg-purple-100 text-purple-700 border-0 mb-3 sm:mb-4 text-xs sm:text-sm">
              {user.role}
            </Badge>
          )}

          <Separator className="my-3 sm:my-4 bg-border" />

          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
              <span className="truncate">{profileData.email}</span>
            </div>
            {(profileData.phone || user?.phone) && (
              <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
                <span>{profileData.phone || user?.phone}</span>
              </div>
            )}
            {(user?.city || user?.country) && (
              <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
                <span>
                  {[user?.city, user?.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Storage Indicator */}
          <StorageIndicator />
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">
            {t('USER_PROFILE.STATISTICS')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} strokeWidth={2} />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className={`text-base sm:text-lg tracking-tight ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg tracking-tight mb-2">{t('USER_PROFILE.SESSION')}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            {t('USER_PROFILE.SESSION_DESCRIPTION')}
          </p>
          <Button
            onClick={onLogout}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-10"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
            {t('USER_PROFILE.LOGOUT')}
          </Button>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-lg shadow-red-500/20 text-white">
        <div>
          <h3 className="text-base sm:text-lg tracking-tight mb-2">
            {t('USER_PROFILE.DELETE_ACCOUNT')}
          </h3>
          <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">
            {t('USER_PROFILE.DELETE_ACCOUNT_WARNING')}
          </p>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-10"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
            {loading ? t('COMMON.LOADING') : t('USER_PROFILE.DELETE_ACCOUNT_BUTTON')}
          </Button>
        </div>
      </Card>

      {selectedImage && (
        <AvatarCropperModal
          isOpen={cropperOpen}
          onClose={handleCropperClose}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
