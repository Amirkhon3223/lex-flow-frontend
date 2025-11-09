# ПРАВИЛА КОДИРОВАНИЯ ДЛЯ LEX-FLOW

## ⛔ КРИТИЧЕСКИЕ ЗАПРЕТЫ

### 1. НИКАКИХ ИНТЕРФЕЙСОВ В КОМПОНЕНТАХ
**ЗАПРЕЩЕНО:**
```typescript
// ❌ НЕ ДЕЛАЙ ТАК!
interface MyComponentProps {
  value: string;
}

export function MyComponent({ value }: MyComponentProps) {
  // ...
}
```

**ПРАВИЛЬНО:**
```typescript
// ✅ ДЕЛАЙ ТАК!
import type { MyComponentProps } from '@/app/types/module-name/module-name.interfaces';

export function MyComponent({ value }: MyComponentProps) {
  // ...
}
```

**РАСПОЛОЖЕНИЕ ТИПОВ:**
- Все интерфейсы и типы должны быть в `src/app/types/`
- Структура: `src/app/types/{module-name}/{module-name}.interfaces.ts`
- Примеры:
  - `src/app/types/clients/clients.interfaces.ts`
  - `src/app/types/cases/cases.interfaces.ts`
  - `src/app/types/documents/documents.interfaces.ts`

### 2. НИКАКИХ `any` ТИПОВ
**ЗАПРЕЩЕНО:**
```typescript
// ❌ НЕ ДЕЛАЙ ТАК!
function handleData(data: any) { }
const items: any[] = [];
```

**ПРАВИЛЬНО:**
```typescript
// ✅ ДЕЛАЙ ТАК!
import type { ClientInterface } from '@/app/types/clients/clients.interfaces';

function handleData(data: ClientInterface) { }
const items: ClientInterface[] = [];
```

### 3. ИСПОЛЬЗОВАНИЕ КОМПОНЕНТОВ
**Всегда проверяй существующие компоненты перед созданием нового!**

**Существующие переиспользуемые компоненты:**
- `CaseCard` - для отображения карточек дел
- `SearchBar` - для поиска (есть в каждом модуле: cases, clients, documents, calendar)
- `FilterTabs` - для быстрой фильтрации по статусам
- `CaseFilters` - полная фильтрация дел (поиск + селекты)

**ЗАПРЕЩЕНО дублировать код!**

## 📁 СТРУКТУРА ПРОЕКТА

### Модули (`src/modules/`)
```
src/modules/{module-name}/
├── index.tsx              # Главная страница модуля
├── components/            # Компоненты модуля
├── pages/                 # Страницы модуля
├── ui/                    # UI компоненты модуля
└── hooks/                 # Хуки модуля
```

### Типы (`src/app/types/`)
```
src/app/types/{module-name}/
├── {module-name}.interfaces.ts  # Все интерфейсы модуля
└── {module-name}.enums.ts       # Все enums модуля
```

## 🎨 СТИЛИЗАЦИЯ

### Скролл
- Глобальный скролл настроен в `src/index.css`
- Тонкий (6px), синий градиент, без стрелочек
- Для модалок: скролл только на контенте, заголовок и кнопки фиксированы

### Модалки
**Структура:**
```typescript
<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0">
  <DialogHeader className="px-8 pt-8 pb-6 flex-shrink-0">
    {/* Заголовок */}
  </DialogHeader>

  <form className="flex flex-col flex-1 overflow-hidden">
    <div className="space-y-6 px-8 overflow-y-auto flex-1">
      {/* Контент со скроллом */}
    </div>

    <div className="flex items-center gap-3 px-8 py-6 border-t border-gray-100 flex-shrink-0 bg-white">
      {/* Кнопки */}
    </div>
  </form>
</DialogContent>
```

## 🔧 ИМПОРТЫ

### Порядок импортов:
1. React / библиотеки
2. Иконки (lucide-react)
3. Навигация (react-router-dom)
4. Конфиги (@/app/config/...)
5. Типы (@/app/types/...)
6. Компоненты модулей (@/modules/...)
7. Shared компоненты (@/shared/...)

### Примеры:
```typescript
import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes.config';
import type { ClientInterface } from '@/app/types/clients/clients.interfaces';
import { ClientTypeEnum } from '@/app/types/clients/clients.enums';
import { CaseCard } from '@/modules/cases/ui/CaseCard';
import { Button } from '@/shared/ui/button';
```

## 📝 ИМЕНОВАНИЕ

### Компоненты:
- PascalCase: `ClientCard`, `CaseFilters`
- Файлы: `ClientCard.tsx`, `CaseFilters.tsx`

### Интерфейсы:
- Суффикс `Interface`: `ClientInterface`, `CaseCardInterface`
- Props суффикс `Props`: `ClientCardProps`, `CaseFiltersProps`

### Enums:
- Суффикс `Enum`: `ClientTypeEnum`, `CaseStatusEnum`
- Значения: UPPER_SNAKE_CASE: `IN_PROGRESS`, `COMPLETED`

## ✅ ЧЕКЛИСТ ПЕРЕД КОММИТОМ

- [ ] Нет интерфейсов в компонентах
- [ ] Нет `any` типов
- [ ] Все типы импортированы из `@/app/types/`
- [ ] Проверил существующие компоненты перед созданием нового
- [ ] Использовал переиспользуемые компоненты где возможно
- [ ] Импорты упорядочены правильно
- [ ] Нет дублирования кода

## 🚫 ПРИМЕРЫ ОШИБОК

### Ошибка 1: Интерфейс в компоненте
```typescript
// ❌ НЕПРАВИЛЬНО
interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
```

```typescript
// ✅ ПРАВИЛЬНО
import type { AddClientDialogProps } from '@/app/types/clients/clients.interfaces';

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
```

### Ошибка 2: any типы
```typescript
// ❌ НЕПРАВИЛЬНО
const [clientType, setClientType] = useState<any>('individual');
onValueChange={(v) => setClientType(v as any)}
```

```typescript
// ✅ ПРАВИЛЬНО
import { ClientTypeEnum } from '@/app/types/clients/clients.enums';

const [clientType, setClientType] = useState<ClientTypeEnum>(ClientTypeEnum.INDIVIDUAL);
onValueChange={(v) => setClientType(v as ClientTypeEnum)}
```

### Ошибка 3: Дублирование кода
```typescript
// ❌ НЕПРАВИЛЬНО - дублирование JSX для отображения кейса
<div className="case-card">
  <h4>{caseItem.title}</h4>
  <Badge>{caseItem.status}</Badge>
  {/* ... много кода */}
</div>
```

```typescript
// ✅ ПРАВИЛЬНО - использование компонента
import { CaseCard } from '@/modules/cases/ui/CaseCard';

<CaseCard caseItem={caseItem} />
```

---

**ВАЖНО:** Эти правила обязательны для соблюдения во ВСЕМ проекте!
