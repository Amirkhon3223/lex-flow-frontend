# LexFlow Frontend

> React приложение для SaaS-платформы управления юридической практикой

## Quick Start

```bash
# Зависимости
npm install

# Запуск dev сервера
npm run dev

# Production сборка
npm run build

# Проверка типов
npm run type-check

# Линтинг
npm run lint
```

**URLs:**
- App: http://localhost:5173
- API: http://localhost:8080/api/v1

---

## Tech Stack

- **React 19** + TypeScript 5.9 (strict mode)
- **Vite 7** (Rolldown)
- **Zustand** (state management)
- **shadcn/ui** + Tailwind CSS 4
- **React Router 7**
- **Axios** + WebSocket
- **Sentry** (error tracking)

---

## Architecture (FSD)

```
src/
├── app/                 # Config, router, services, stores
│   ├── config/         # API config, routes
│   ├── services/       # 18 API services
│   ├── store/          # 14 Zustand stores
│   └── types/          # TypeScript interfaces
├── modules/            # 11 feature modules
│   ├── auth/          # Login, register, 2FA
│   ├── dashboard/     # Stats, widgets
│   ├── clients/       # Client CRUD
│   ├── cases/         # Case management + timeline
│   ├── documents/     # Upload, versioning, comparison
│   ├── calendar/      # Meetings (day/week/month)
│   ├── analytics/     # Charts, reports
│   ├── ai-assistant/  # AI chat, document analysis
│   ├── settings/      # Profile, billing, team, security
│   ├── notifications/ # Real-time notifications
│   └── billing/       # Stripe integration
├── pages/              # Route wrappers (2-line exports)
├── shared/             # Reusable UI (shadcn/ui)
└── assets/i18n/        # Translations (ru, en, tj)
```

---

## Features

| Feature | Status | Description |
|---------|--------|-------------|
| Auth | ✅ | Login, register, 2FA |
| Clients | ✅ | CRUD, filters, categories |
| Cases | ✅ | Timeline, tasks, comments |
| Documents | ✅ | Versioning, extraction, comparison |
| Calendar | ✅ | Day/week/month, video calls |
| Analytics | ✅ | Charts, reports |
| AI Assistant | ✅ | Chat, document analysis |
| Billing | ✅ | Plans, payments, methods |
| Team | ✅ | Members, invites (Pro Max) |
| Notifications | ✅ | WebSocket real-time |

---

## Zustand Stores

| Store | Purpose |
|-------|---------|
| useAuthStore | Auth, user, workspace |
| useClientsStore | Clients CRUD |
| useCasesStore | Cases + timeline/tasks |
| useDocumentsStore | Documents + versions |
| useMeetingsStore | Calendar meetings |
| useBillingStore | Subscription, payments |
| useAIStore | AI chats, tokens |
| useNotificationsStore | Real-time notifications |

---

## Environment (.env)

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_URL=ws://localhost:8080/api/v1/notifications/ws
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_SENTRY_DSN=https://...@sentry.io/...
```

---

## Security

- JWT httpOnly cookies (XSS protected)
- CSRF Double Submit Cookie
- TypeScript strict mode
- Role-based access (owner/admin/member)
- Workspace data isolation

---

## Subscription Plans

| Plan | Price | Clients | Cases | Storage | Users |
|------|-------|---------|-------|---------|-------|
| Basic | $7/mo | 5 | 10 | 500MB | 1 |
| Pro | $20/mo | ∞ | ∞ | 3GB | 1 |
| Pro Max | $80/mo | ∞ | ∞ | 18GB | 8 |

---

## Localization

Languages: **Russian (ru)**, **English (en)**, **Tajik (tj)**

```tsx
const { t } = useI18n();
t('CLIENTS.TITLE')
```

**Important:** Always update ALL THREE language files!

---

## Scripts

```bash
npm run dev           # Development
npm run build         # Production build
npm run preview       # Preview build
npm run type-check    # TypeScript check
npm run lint          # ESLint
npm run lint:fix      # Auto-fix
npm run test          # Vitest
```

---

## License

MIT License

---

**LexFlow Frontend v1.0.0**
