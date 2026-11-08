<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# web/ — платформа арабского языка

Next.js-приложение. Старый тренажёр (`../index.html`, `../server.js`) не трогать:
основная разработка идёт там, а сюда изменения приезжают через `git pull`.

## Правила

- `src/core` — чистые функции: без DOM, `localStorage`, `fetch` и импортов из `app/`.
  Всё, что арабское (нормализация, разбор ответа, промпты, итоги), живёт там.
- Модель вызывается только через `src/app/api/chat/route.ts`; ключ — только в `.env`.
- Промпт собирается в `src/core/prompt.ts`; версия фиксируется в `PROMPT_VERSION`
  и должна попадать в запись занятия (`SessionSummary.promptVersion`).
- UI-тексты на русском, арабский — только арабскими буквами, без латиницы.
- Ответ модели сейчас в формате `AR:/RU:/FIX:` (`parseReply`). Переход на строгий
  JSON — отдельный шаг, старый парсер остаётся fallback.

## Что дальше (по приоритету)

1. Тренажёр: перенести голосовой диалог из корневого `index.html` в `/train`
   (`PushToTalk` как класс вне React + `useSyncExternalStore`).
2. Авторизация и БД (Postgres + Drizzle), роли «ученик» / «преподаватель».
3. Кабинет: ученики, задания, автопроверка по рубрике преподавателя.
4. Оплата (ЮKassa, самозанятость) — после проверки спроса.
