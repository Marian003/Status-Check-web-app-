# Status Check

Вебзастосунок для **відстеження дедлайнів і комітментів**. Будується на базі
календаря: задача — це не виконання дії, а **контроль виконання її іншою
людиною**. Відповідальний за перевірку (checker) контролює, чи виконав свій
комітмент відповідальний виконавець (executor) до дедлайну.

## Технологічний стек

- **Next.js 16 (App Router) + TypeScript** (strict mode)
- **PostgreSQL + Prisma ORM** (спільна база даних)
- **Auth.js (NextAuth v5)** — credentials (email + пароль), bcrypt-хешування,
  JWT-сесії, захист роутів через `middleware.ts`
- **Tailwind CSS v4 + shadcn/ui**
- **Zod** — валідація (одні й ті самі схеми на клієнті й сервері)
- Робота з даними — через **Server Actions** + тонкий service-шар
- **date-fns** — дата/час

## Передумови

- Node.js 18+ (рекомендовано 20/22/24)
- Docker (для PostgreSQL) — або власний інстанс Postgres

## Запуск локально

```bash
# 1. Залежності
npm install

# 2. Змінні оточення — створіть .env із прикладу
#    (.env у git не комітиться; AUTH_SECRET із прикладу підходить для розробки)
cp .env.example .env

# 3. Підняти PostgreSQL (контейнер слухає на хості :5433 -> :5432)
docker compose up -d

# 4. Створити схему в БД
npm run db:push

# 5. Заповнити демо-даними
npm run db:seed

# 6. Запустити застосунок
npm run dev
```

Відкрийте <http://localhost:3000>.

> **Порт БД:** `docker-compose.yml` мапить хостовий порт **5433** на контейнерний
> 5432 (порт 5432 на хості часто вже зайнятий). `DATABASE_URL` у `.env` уже
> налаштований на `localhost:5433`.

### Тестові акаунти

Усі демо-користувачі мають пароль **`password123`**:

| Email                | Ім'я            |
| -------------------- | --------------- |
| `olena@example.com`  | Олена Коваленко |
| `ivan@example.com`   | Іван Петренко   |
| `maria@example.com`  | Марія Шевченко  |
| `andriy@example.com` | Андрій Бондар   |

Або зареєструйте власний акаунт на `/register`.

## NPM-скрипти

| Скрипт              | Призначення                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Запуск у режимі розробки          |
| `npm run build`     | Продакшн-збірка                   |
| `npm run start`     | Запуск продакшн-збірки            |
| `npm run lint`      | ESLint                            |
| `npm run typecheck` | `tsc --noEmit`                    |
| `npm run test`      | Vitest (юніт-тести)               |
| `npm run test:watch`| Vitest у watch-режимі             |
| `npm run test:coverage` | Vitest із покриттям           |
| `npm run db:push`   | Синхронізувати схему Prisma з БД  |
| `npm run db:seed`   | Заповнити БД демо-даними           |
| `npm run db:studio` | Prisma Studio                     |

## Тестування

Юніт-тести на **Vitest** покривають основну бізнес-логіку (чисті функції) — 54
тести, 100% покриття `lib`-логіки:

- `getEffectiveStatus` — правило derived EXPIRED (усі переходи + межові випадки);
- `buildDeadline` + утиліти дат і календарної сітки;
- Zod-схеми (`commitment` + `auth`) — валідні й невалідні дані, нормалізація email;
- `partitionCommitments` — фільтри (проєкт/перевіряючий) і розподіл календар/backlog.

```bash
npm run test            # 54 тести
npm run test:coverage   # звіт покриття
```

## Модель даних

- **User**: `id`, `email` (unique), `name`, `passwordHash`, `createdAt`.
- **Project**: `id`, `name` (unique).
- **Commitment**: `id`, `authorId`, `title`, `description`, `createdAt`,
  `projectId`, `executorId`, `checkerId`, `deadline` (nullable), `isAllDay`,
  `status`.

### Статуси

`TO_CHECK`, `EXPIRED`, `DONE`, `NOT_ACTUAL`, `IDEAS_BACKLOG`.

Усі п'ять статусів можна **встановити вручну**. Додатково **EXPIRED
обчислюється автоматично**: якщо збережений статус = `TO_CHECK`, а `deadline`
у минулому, комітмент відображається як EXPIRED ("дедлайн минув, комітмент не
закрили й не перенесли"). Єдине джерело правди — `getEffectiveStatus()` у
[`src/lib/status.ts`](src/lib/status.ts); ним користуються всі місця
відображення й фільтрації.

## Структура проєкту

```
src/
  app/
    (auth)/login, (auth)/register      # сторінки авторизації
    (app)/layout.tsx                   # захищений layout (сесія + хедер)
    (app)/calendar/page.tsx            # головний екран (server component)
    api/auth/[...nextauth]/route.ts    # хендлери Auth.js
    layout.tsx, page.tsx, globals.css
  components/
    auth/        LoginForm, RegisterForm
    calendar/    CalendarView, CalendarGrid, CalendarDayCell, CalendarHeader, MonthNav
    commitments/ CommitmentCard, CommitmentForm, CommitmentDialog, StatusBadge,
                 StatusSelect, DeleteCommitmentButton, BacklogPanel, fields/*
    filters/     FilterBar, FilterSelect, ProjectFilter, CheckerFilter
    layout/      AppHeader, SignOutButton
    ui/          # shadcn/ui примітиви
  lib/
    db.ts                       # Prisma singleton
    auth.ts, auth.config.ts     # конфіг Auth.js (+ edge-safe для middleware)
    validations/                # Zod-схеми (commitment, auth)
    status.ts                   # мапа статусів + getEffectiveStatus
    date.ts                     # утиліти дат/форматування
    utils.ts                    # cn()
  server/
    services/    commitments, projects, users  # доступ до даних
    actions/     commitments, projects, auth    # Server Actions (валідація + auth)
  hooks/useFilters.ts
  types/index.ts                 # єдине джерело типів (Prisma + include)
middleware.ts                    # захист роутів
prisma/schema.prisma, prisma/seed.ts
docker-compose.yml
```

## Відповідність ТЗ (де що реалізовано)

- **Авторизація (реєстрація/вхід/вихід, middleware)** — `src/lib/auth*.ts`,
  `middleware.ts`, `src/server/actions/auth.ts`, `components/auth/*`,
  `components/layout/SignOutButton.tsx`.
- **Спільна база / календар** — `server/services/commitments.ts` (читає всі
  комітменти), `app/(app)/calendar/page.tsx`.
- **Календар (місяць, гортання, «сьогодні»)** — `components/calendar/*`.
- **Додавання з календаря (клік по дню → форма з прев'ю дати)** —
  `CalendarDayCell` → `CommitmentDialog` (показує обрану дату).
- **Редагування / зміна статусу / видалення** — `CommitmentForm`,
  `StatusSelect` (швидка зміна, окремий контрол), `DeleteCommitmentButton`
  (з підтвердженням).
- **Backlog / без дедлайну** — `hooks/useFilters.ts` (розділення) +
  `BacklogPanel`.
- **Фільтри (проєкт, відповідальний за перевірку)** — `components/filters/*`,
  `hooks/useFilters.ts`.
- **Картка** (title, бейдж статусу з derived EXPIRED, проєкт, виконавець/
  перевіряючий, час) — `CommitmentCard` + `StatusBadge`.

## Прийняті припущення

- **Один часовий пояс.** Дедлайни інтерпретуються як локальний час; групування
  по днях використовує локальні компоненти дати. Для локального запуску це
  коректно.
- **Спільна дошка.** Будь-який авторизований користувач може створювати,
  редагувати, змінювати статус і видаляти будь-який комітмент (обмежень за
  власником немає — відповідно до ідеї «спільний календар»). Поле «Автор» у
  формі за замовчуванням — поточний користувач, але його можна змінити.
- **Сесії — JWT** (credentials-провайдер Auth.js не використовує адаптер БД).
- `AUTH_SECRET` у `.env` — лише для розробки; для продакшну згенеруйте новий
  (`npx auth secret`).
