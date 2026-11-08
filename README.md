# web — платформа арабского языка

Next.js-приложение платформы: лендинг, тренажёр и кабинет преподавателя.
Старый ванильный тренажёр продолжает жить в корне репозитория (`index.html`,
`server.js`) и это приложение не затрагивает.

## Запуск

```bash
cd web
npm install
cp .env.example .env      # вписать ANYMODEL_KEY
npm run dev               # http://localhost:3000
```

## Структура

```
src/
  app/
    page.tsx              лендинг
    teacher/              кабинет преподавателя (пока заглушка)
    api/chat/route.ts     серверный прокси к AnyModel
  public/
    trainer.html          статическая копия старого тренажёра (/trainer.html)
  core/                   арабское ядро: чистые функции без DOM и сети
    text.ts               огласовки, нормализация, bidi-разбивка, ключи словаря
    reply.ts              разбор ответа модели
    prompt.ts             сборка промптов и таблицы уровней/тем
    session.ts            итог занятия и экспорт в Markdown
    types.ts              типы и порты (ChatClient, StoragePort)
  lib/llm.ts              серверный клиент к AnyModel
  instrumentation.ts      форс IPv4 при старте (обход "fetch failed" на Windows)
```

`src/core` не импортирует ничего из `app/` — его можно использовать в
серверных задачах (генератор отчётов, домашка) и в будущем кабинете.

## Переменные окружения

| Переменная      | По умолчанию              | Описание                    |
|-----------------|---------------------------|-----------------------------|
| `ANYMODEL_KEY`  | —                         | ключ AnyModel (обязателен)  |
| `ANYMODEL_BASE` | `https://anymodel.org/v1` | базовый URL API             |
| `MODEL`         | `gc/gemini-2.5-flash`     | модель для диалога          |

Ключ читается только на сервере и в браузер не попадает.

## Тренажёр

Текущая версия тренажёра живёт в `public/trainer.html` и открывается по адресу
`http://localhost:3000/trainer.html` (а `/train` перенаправляет туда).
Он использует тот же `/api/chat`, поэтому отдельный сервер на 8787 не нужен.

Обновить копию после правок в старом проекте:

```bash
npm run sync:trainer
# или с явным путём:
npm run sync:trainer -- "D:\путь\к\arabic-speaker\index.html"
```

`src/core` при этом не обновляется — это отдельная реализация для кабинета.

## Деплой на VPS

В `next.config.ts` включён `output: "standalone"`:

```bash
npm run build
# запуск: node .next/standalone/server.js
```

Собирать лучше на машине с 2+ ГБ RAM — `next build` на 1 ГБ падает по OOM.
