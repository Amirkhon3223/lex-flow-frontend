# LexFlow Frontend

> React приложение для SaaS-платформы управления юридической практикой

## Quick Start

```bash
npm install
npm run dev

# Production сборка
npm run build

# Проверка типов
npm run type-check
```

**URLs:**
- App: http://localhost:5173
- API: http://localhost:8080/api/v1

---

## Tech Stack

- **React 19** + TypeScript 5.9 (strict mode, zero `any`)
- **Vite 7** (Rolldown)
- **Zustand** (state management)
- **shadcn/ui** + Tailwind CSS 4
- **React Router 7**
- **Axios** + WebSocket
- **Sentry** (error tracking)
- **Web Vitals** (CLS/FID/LCP/FCP/TTFB/INP → GA4)
- **Playwright** (E2E tests)
- **Storybook 10** (UI component documentation)

---

## Architecture (FSD)

```
src/
├── app/                 # Config, router, services, stores
│   ├── config/         # API config, routes, Sentry
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
├── pages/              # Route wrappers
├── shared/             # Reusable UI (shadcn/ui)
│   ├── ui/            # 58 shadcn components
│   │   └── stories/   # Storybook stories
│   ├── components/    # 37 shared components
│   └── utils/         # Analytics, web-vitals, validation
├── assets/i18n/        # Translations (ru, en, tj)
e2e/                    # Playwright E2E tests
.storybook/             # Storybook config
```

---

## Features

| Feature | Status | Description |
|---------|--------|-------------|
| Auth | ✅ | Login, register, 2FA, password reset |
| Clients | ✅ | CRUD, filters, categories |
| Cases | ✅ | Timeline, tasks, comments |
| Documents | ✅ | Versioning, extraction, diff comparison |
| Calendar | ✅ | Day/week/month, video calls |
| Analytics | ✅ | Charts, reports |
| AI Assistant | ✅ | Chat, document analysis, streaming |
| Billing | ✅ | Plans, payments, methods |
| Team | ✅ | Members, invites (Pro Max) |
| Notifications | ✅ | WebSocket real-time |
| Sentry | ✅ | Error tracking (needs DSN) |
| Web Vitals | ✅ | CLS/FID/LCP/FCP/TTFB/INP monitoring |
| Error Codes | ✅ | Code-based API error matching |

---

## Testing

### Unit Tests (Vitest)
```bash
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # Coverage report
```

### E2E Tests (Playwright)
```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Interactive UI mode
npm run test:e2e:report   # View HTML report
```

17 E2E тестов: авторизация, навигация, редиректы, валидация форм.

### Storybook
```bash
npm run storybook         # Dev server (port 6006)
npm run build-storybook   # Static build
```

6 stories с autodocs: Button, Input, Badge, Card, Switch, Textarea.

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
VITE_GA_MEASUREMENT_ID=G-...
```

---

## Security

- JWT httpOnly cookies (XSS protected)
- CSRF Double Submit Cookie
- TypeScript strict mode (zero `any`)
- Role-based access (owner/admin/member)
- Workspace data isolation
- Structured error codes (code-based matching)

---

## Scripts

```bash
npm run dev               # Development
npm run build             # Production build
npm run preview           # Preview build
npm run type-check        # TypeScript check
npm run lint              # ESLint
npm run lint:fix          # Auto-fix
npm run test              # Vitest (unit)
npm run test:e2e          # Playwright (E2E)
npm run storybook         # Storybook (UI docs)
```

---

## Localization

Languages: **Russian (ru)**, **English (en)**, **Tajik (tj)**

```tsx
const { t } = useI18n();
t('CLIENTS.TITLE')
```

**Important:** Always update ALL THREE language files!

---

## License

MIT License

---

**LexFlow Frontend v1.0.0** | Updated: February 7, 2026
