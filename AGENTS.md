<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# arabic-platform — платформа арабского языка

Next.js-приложение в отдельном репозитории. Старый тренажёр живёт в репозитории
`arabic-speaker` и подключается сюда статической копией.

## Тренажёр

- `public/trainer.html` — копия старого `index.html`. Вручную не редактировать.
- Обновление: `npm run sync:trainer` (путь можно передать аргументом).
- `/train` редиректит на `/trainer.html`.
- `src/core` — отдельная реализация для платформы; статическая копия её не использует.

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

1. Авторизация и БД (Postgres + Drizzle), роли «ученик» / «преподаватель».
2. Кабинет: ученики, задания, автопроверка по рубрике преподавателя.
3. Оплата (ЮKassa, самозанятость) — после проверки спроса.
4. Позже: перевести тренажёр на React-компоненты и связать с программой
   преподавателя (сейчас он подключён статической копией).
