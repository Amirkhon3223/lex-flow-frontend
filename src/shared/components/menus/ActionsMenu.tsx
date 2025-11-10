/**
 * @file ActionsMenu.tsx
 * @description Универсальное dropdown меню с действиями
 *
 * ИСПОЛЬЗОВАНИЕ:
 * - Используется везде где есть MoreHorizontal + DropdownMenu
 * - Заменяет дублирующийся код действий (Открыть, Редактировать, Удалить)
 *
 * ОСОБЕННОСТИ:
 * - Configurable items через массив ActionMenuItem
 * - Поддержка вариантов (default, danger)
 * - Опциональные разделители между пунктами
 * - Кастомизация иконки trigger
 */

import { MoreHorizontal } from 'lucide-react';
import type { ActionsMenuProps } from '@/app/types/shared/shared.interfaces';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export function ActionsMenu({
  items,
  triggerIcon: TriggerIcon = MoreHorizontal,
  triggerClassName = 'rounded-xl',
}: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <TriggerIcon className="w-4 h-4" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        {items.map((item, index) => (
          <div key={index}>
            {item.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className={`cursor-pointer ${item.variant === 'danger' ? 'text-red-600' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
              }}
            >
              <item.icon className="w-4 h-4 mr-2" strokeWidth={2} />
              {item.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
