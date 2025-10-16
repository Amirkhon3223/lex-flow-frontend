# LexFlow

React приложение с Angular-подобной структурой.

## Структура проекта

```
src/
├── app/
│   ├── config/              # Конфигурация
│   ├── guards/              # Route guards
│   ├── hooks/               # Кастомные хуки
│   ├── interceptors/        # Axios interceptors
│   ├── types/               # TypeScript типы
│   ├── services/            # API сервисы (как в Angular!)
│   ├── store/               # Zustand stores
│   └── router.tsx           # React Router конфигурация
│
├── modules/                 # Модули (как в Angular!)
│   ├── clients/
│   ├── cases/
│   └── ...
│
├── shared/                  # Общие компоненты и утилиты
│   ├── components/
│   ├── utils/
│   └── constants/
│
└── pages/                   # Auth страницы
```

## ESLint правила

- ❌ **Запрещено использование `any`**
- ✅ **Обязательные точки с запятой**
- ✅ **Trailing commas** только где есть продолжение
- ✅ **Сортировка импортов отключена**

## Запуск

```bash
npm install
npm run dev
```

## Конфигурация

Создайте `.env` файл на основе `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```
