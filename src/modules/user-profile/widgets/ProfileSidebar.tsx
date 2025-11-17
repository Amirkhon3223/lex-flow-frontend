import { Mail, Phone, MapPin, Upload, LogOut, Trash2, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

export function ProfileSidebar({ profileData, stats, onLogout }: {
  profileData: { firstName: string; lastName: string; email: string; phone: string; position: string };
  stats: Array<{ label: string; value: string; icon: typeof Briefcase; color: string }>;
  onLogout: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card >
        <div className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24 ring-4 ring-gray-100">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
            >
              <Upload className="w-4 h-4" strokeWidth={2} />
            </Button>
          </div>

          <h3 className="text-xl tracking-tight mb-1">
            {profileData.lastName} {profileData.firstName}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{profileData.position}</p>
          <Badge className="bg-purple-100 text-purple-700 border-0 mb-4">
            Pro аккаунт
          </Badge>

          <Separator className="my-4 bg-gray-100" />

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" strokeWidth={2} />
              <span className="truncate">{profileData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" strokeWidth={2} />
              <span>{profileData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" strokeWidth={2} />
              <span>Москва, Россия</span>
            </div>
          </div>
        </div>
      </Card>

      <Card >
        <div className="p-6">
          <h3 className="text-lg tracking-tight mb-4">Статистика</h3>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
                  </div>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className={`text-lg tracking-tight ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card >
        <div className="p-6">
          <h3 className="text-lg tracking-tight mb-2">Сессия</h3>
          <p className="text-sm text-gray-500 mb-4">
            Выйти из аккаунта на этом устройстве
          </p>
          <Button
            onClick={onLogout}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" strokeWidth={2} />
            Выйти из аккаунта
          </Button>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-lg shadow-red-500/20 text-white">
        <div className="p-6">
          <h3 className="text-lg tracking-tight mb-2">Удаление аккаунта</h3>
          <p className="text-sm opacity-90 mb-4">
            Это действие необратимо. Все ваши данные будут удалены.
          </p>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
            Удалить аккаунт
          </Button>
        </div>
      </Card>
    </div>
  );
}
