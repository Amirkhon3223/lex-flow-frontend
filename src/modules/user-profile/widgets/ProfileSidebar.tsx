import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Upload, LogOut, Trash2, Briefcase } from 'lucide-react';
import { AvatarCropperModal } from '@/modules/user-profile/ui/AvatarCropperModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

export function ProfileSidebar({ profileData, stats, onLogout }: {
  profileData: { firstName: string; lastName: string; email: string; phone: string; position: string; avatarUrl?: string };
  stats: Array<{ label: string; value: string; icon: typeof Briefcase; color: string }>;
  onLogout: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Выбран файл:', file.name, file.type, file.size);
      // Создаем превью для обрезки
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // Сбрасываем input чтобы можно было выбрать тот же файл повторно
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setAvatarPreview(croppedImageUrl);
    setSelectedImage(null);
    // TODO: Загрузка обрезанного файла на сервер
  };

  const handleCropperClose = () => {
    setCropperOpen(false);
    setSelectedImage(null);
  };

  // Определяем URL аватарки: превью > из бекенда > null (показать инициалы)
  const currentAvatarUrl = avatarPreview || profileData.avatarUrl || null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <div className="text-center">
          <div className="relative inline-block mb-3 sm:mb-4">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-gray-100">
              {currentAvatarUrl && (
                <AvatarImage
                  src={currentAvatarUrl}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl sm:text-3xl">
                {profileData.firstName[0]}{profileData.lastName[0]}
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
            {profileData.lastName} {profileData.firstName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-2">{profileData.position}</p>
          <Badge className="bg-purple-100 text-purple-700 border-0 mb-3 sm:mb-4 text-xs sm:text-sm">
            Pro аккаунт
          </Badge>

          <Separator className="my-3 sm:my-4 bg-gray-100" />

          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-600 justify-center sm:justify-start">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
              <span className="truncate">{profileData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 justify-center sm:justify-start">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
              <span>{profileData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 justify-center sm:justify-start">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2} />
              <span>Москва, Россия</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg tracking-tight mb-3 sm:mb-4">Статистика</h3>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} strokeWidth={2} />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className={`text-base sm:text-lg tracking-tight ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-base sm:text-lg tracking-tight mb-2">Сессия</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            Выйти из аккаунта на этом устройстве
          </p>
          <Button
            onClick={onLogout}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-10"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
            Выйти из аккаунта
          </Button>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-lg shadow-red-500/20 text-white">
        <div>
          <h3 className="text-base sm:text-lg tracking-tight mb-2">Удаление аккаунта</h3>
          <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">
            Это действие необратимо. Все ваши данные будут удалены.
          </p>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-10"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={2} />
            Удалить аккаунт
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
