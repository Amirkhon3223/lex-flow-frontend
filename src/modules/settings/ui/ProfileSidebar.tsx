import {
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Users,
    CheckCircle,
    Calendar,
    AlertCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

interface ProfileStats {
    activeCases: number;
    clients: number;
    completedCases: number;
    daysInSystem: number;
}

interface ProfileSidebarProps {
    name: string;
    position: string;
    email: string;
    phone: string;
    location: string;
    stats: ProfileStats;
}

export function ProfileSidebar({ name, position, email, phone, location, stats }: ProfileSidebarProps) {
    return (
        <Card>
            <CardContent className="p-6">
                {}
                <div className="text-center">
                    <Avatar className="mx-auto h-24 w-24">
                        <AvatarFallback className="bg-blue-600 text-2xl text-white">
                            АП
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-xl font-bold text-gray-900">{name}</h2>
                    <p className="text-sm text-gray-600">{position}</p>
                    <Badge className="mt-2 bg-purple-600">Pro аккаунт</Badge>
                </div>

                {}
                <div className="mt-6 space-y-3 border-t pt-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {location}
                    </div>
                </div>

                {}
                <div className="mt-6 space-y-3 border-t pt-6">
                    <h3 className="font-semibold text-gray-900">Статистика</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600">
                                <Briefcase className="h-4 w-4 text-blue-600" />
                                Активных дел
                            </span>
                            <span className="font-medium text-blue-600">{stats.activeCases}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600">
                                <Users className="h-4 w-4 text-purple-600" />
                                Клиентов
                            </span>
                            <span className="font-medium text-purple-600">{stats.clients}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Завершено дел
                            </span>
                            <span className="font-medium text-green-600">{stats.completedCases}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4 text-orange-600" />
                                Дней в системе
                            </span>
                            <span className="font-medium text-orange-600">{stats.daysInSystem}</span>
                        </div>
                    </div>
                </div>

                {}
                <div className="mt-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                    <h3 className="flex items-center gap-2 font-semibold text-red-900">
                        <AlertCircle className="h-4 w-4" />
                        Удаление аккаунта
                    </h3>
                    <p className="mt-1 text-xs text-red-700">
                        Это действие необратимо. Все ваши данные будут удалены.
                    </p>
                    <Button variant="destructive" size="sm" className="mt-3 w-full">
                        Удалить аккаунт
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
