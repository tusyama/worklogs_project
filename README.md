# Журнал работ на строительном объекте

Внутренний инструмент для прораба: учёт выполненных работ с фильтрацией по дате, справочником видов работ и кэшированием списков в Redis.

## Стек

| Слой | Технологии | Зачем |
|------|------------|--------|
| Frontend | React 18, TypeScript, Vite 6, Redux Toolkit + RTK Query, styled-components 6, react-hook-form + Zod | SPA с серверным состоянием и общей валидацией с API |
| UI | Мини ui-kit: примитивы + composite (`Table.*`, `Form.*`, `Modal.*`) | Переиспользуемые компоненты без дублирования разметки |
| Backend | Bun 1.2 (`Bun.serve` + `routes`), слои controller → service → repository | Нативный HTTP без лишнего фреймворка |
| БД | MongoDB 7, Mongoose 8 | Персистентное хранение, индексы по дате |
| Кэш | Redis 7, модуль `cache` (Facade над ioredis в README) | Справочник видов работ + версионированный кэш списков записей |
| Инфра | docker compose: mongo, redis, backend, frontend (nginx) | Запуск одной командой для проверяющего |

Версии зафиксированы в lockfile / Docker-тегах (без beta/canary).

## Архитектура

- **API:** `GET/POST /api/entries`, `PUT/DELETE /api/entries/:id`, `GET /api/work-types`, `GET /api/health`
- **Кэш:** ключ `entries:ver` инкрементируется при каждой записи; списки кэшируются с TTL 5 мин, справочник — 1 ч
- **Даты:** в API строка `YYYY-MM-DD`, в Mongo — UTC midnight
- **Общие схемы и константы:** `packages/shared` — Zod-схемы, `ENTRY_SORT`, `ENTRY_MODAL_MODE`, `VALIDATION_MESSAGES`, `API_MESSAGES`, `UI_TEXT`, `ENTRY_FORM_FIELD`

## Разработка в Docker (hot-reload)

Репозиторий монтируется в контейнеры; правки в `frontend/`, `backend/`, `packages/shared` подхватываются без пересборки образа.

```bash
cp .env.example .env   # COMPOSE_PROFILES=dev — стек dev по умолчанию
npm run dev:docker     # или: docker compose --profile dev up
```

- UI (Vite HMR): **http://localhost:5173**
- API (`bun --watch`): **http://localhost:3000** (прокси `/api` из Vite → `backend-dev` внутри сети Docker)
- Mongo / Redis: порты `127.0.0.1:27017`, `127.0.0.1:6379` (только localhost; Mongo — SCRAM, см. `.env.example`)

**Безопасность (dev):** учётные данные `worklog/worklog` и Redis без пароля — только для локальной разработки. В production задайте `MONGO_APP_USER`, `MONGO_APP_PASSWORD` и не публикуйте порты БД наружу.

При первом включении auth или смене пароля сбросьте том Mongo: `docker compose down -v` (init-скрипт в `scripts/mongo-init/` создаёт пользователя только на пустом volume).

Первый запуск может занять время (`npm install` / `bun install` в контейнерах). Остановка dev-серверов на хосте, если порты заняты:

```bash
lsof -ti :5173 | xargs kill 2>/dev/null
lsof -ti :3000 | xargs kill 2>/dev/null
```

Изменения в `packages/shared` перезагружают страницу (см. `frontend/vite-watch-shared.ts`). В Docker включён polling (`CHOKIDAR_USEPOLLING`).

## Production в Docker (для проверки задания)

Статическая сборка в nginx, **без** bind-mount — после правок UI нужна пересборка образа.

```bash
npm run docker:prod
# или: docker compose --profile prod up --build
```

Приложение: http://localhost  
API: http://localhost/api/health

Пересборка только frontend: `docker compose --profile prod build frontend && docker compose --profile prod up -d frontend`

Если `docker compose build` падает из‑за не-ASCII символов в пути к проекту, соберите образы по отдельности: `docker compose --profile prod build backend && docker compose --profile prod build frontend`.

## Локальная разработка без Docker для app-слоя (опционально)

Только инфраструктура в Docker, Vite и API на хосте (быстрее на macOS, если не нужен полный стек в контейнере):

```bash
npm install
cd backend && bun install

npm run dev          # mongo+redis в Docker, API :3000, Vite :5173
```

## Тесты

```bash
npm run test         # shared + frontend + backend (Vitest)
npm run test:watch   # frontend в watch-режиме
```

## Демо-данные (25 записей)

Скрипт заполняет MongoDB разнообразными записями журнала (апрель–май 2026, все виды работ из справочника, разные объёмы и исполнители). По умолчанию **удаляет** все существующие записи и вставляет 25 новых.

Требуется запущенные Mongo (и желательно Redis для сброса кэша списков):

```bash
npm run dev:infra    # если mongo/redis ещё не подняты
npm run seed:entries
```

Добавить записи, не очищая коллекцию: `cd backend && … bun run seed:entries -- --keep` (с теми же `MONGODB_URI` / `REDIS_URL`, что в `package.json` для `seed:entries`).

## Проверка по заданию

- [x] Список записей: дата, вид работ, объём с единицей, ФИО
- [x] Фильтр и сортировка по дате
- [x] Добавление с валидацией, сохранение в MongoDB
- [x] Удаление
- [x] Редактирование (bonus)
- [x] Справочник видов работ — выбор из списка (bonus)

## Структура репозитория

```
packages/shared   — Zod-схемы, DTO, константы и UI-тексты
backend/          — Bun API
frontend/         — React SPA + ui-kit
docker-compose.yml
```
