import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Phone, Users, AlarmClock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { Textarea } from '@/shared/ui/textarea';

interface AddMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMeetingDialog({ open, onOpenChange }: AddMeetingDialogProps) {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    type: 'in_person',
    time: '',
    duration: '60',
    location: '',
    notes: '',
    reminder: '30',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Meeting created:', { ...formData, date });
    onOpenChange(false);

    setDate(undefined);
    setFormData({
      title: '',
      type: 'in_person',
      time: '',
      duration: '60',
      location: '',
      notes: '',
      reminder: '30',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white border-0 shadow-2xl rounded-3xl p-0">
        <DialogHeader className="px-8 pt-8 pb-6">
          <DialogTitle className="text-2xl tracking-tight">Новая встреча</DialogTitle>
          <DialogDescription className="text-gray-500">
            Запланируйте встречу с клиентом
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-gray-600">
                Название встречи
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                placeholder="Консультация по делу"
                required
              />
            </div>

            {}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm text-gray-600">
                Тип встречи
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="in_person">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" strokeWidth={2} />
                      <span>Личная встреча</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" strokeWidth={2} />
                      <span>Видеозвонок</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" strokeWidth={2} />
                      <span>Телефонный звонок</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-100" />

            {}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  Дата
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 w-full justify-start text-left rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      {date ? format(date, 'PPP', { locale: ru }) : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  Время
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                  required
                />
              </div>
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm text-gray-600">
                  Длительность
                </Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleChange('duration', value)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="15">15 минут</SelectItem>
                    <SelectItem value="30">30 минут</SelectItem>
                    <SelectItem value="45">45 минут</SelectItem>
                    <SelectItem value="60">1 час</SelectItem>
                    <SelectItem value="90">1.5 часа</SelectItem>
                    <SelectItem value="120">2 часа</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder" className="text-sm text-gray-600 flex items-center gap-2">
                  <AlarmClock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  Напоминание
                </Label>
                <Select
                  value={formData.reminder}
                  onValueChange={(value) => handleChange('reminder', value)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="0">Не напоминать</SelectItem>
                    <SelectItem value="15">За 15 минут</SelectItem>
                    <SelectItem value="30">За 30 минут</SelectItem>
                    <SelectItem value="60">За 1 час</SelectItem>
                    <SelectItem value="1440">За 1 день</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {}
            {(formData.type === 'in_person' || formData.type === 'video') && (
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  {formData.type === 'video' ? 'Ссылка' : 'Место встречи'}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                  placeholder={
                    formData.type === 'video'
                      ? 'https://meet.google.com/...'
                      : 'Офис, кабинет 305'
                  }
                />
              </div>
            )}

            {}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm text-gray-600">
                Заметки
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="min-h-[80px] rounded-xl border-gray-200 focus-visible:ring-blue-500 resize-none"
                placeholder="Дополнительная информация о встрече..."
              />
            </div>
          </div>

          {}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
            >
              Создать встречу
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
