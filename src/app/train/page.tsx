import Link from 'next/link';

export default function TrainPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <Link href="/" className="text-sm text-muted transition hover:text-accent">
        ← На главную
      </Link>

      <h1 className="mt-6 text-2xl font-semibold">
        Тренажёр разговорного арабского
      </h1>
      <p className="mt-3 leading-relaxed text-muted">
        Голосовой диалог, разбор ошибок и итог занятия. Сюда переезжает текущий
        тренажёр из корня репозитория.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-panel p-5">
        <p className="text-sm leading-relaxed text-muted">
          Пока работает старая версия: в корне репозитория выполните{' '}
          <code className="rounded bg-panel2 px-1.5 py-0.5 text-fg">
            node server.js
          </code>{' '}
          и откройте{' '}
          <span className="text-fg">http://localhost:8787/</span>.
        </p>
      </div>

      <ul className="mt-8 space-y-3 text-sm leading-relaxed text-muted">
        <li>• Распознавание и синтез речи — в браузере (Chrome/Edge).</li>
        <li>• Ответ модели: арабская фраза, перевод, разбор ошибок.</li>
        <li>
          • Смешанный режим: можно спросить по-русски, не теряя арабскую часть.
        </li>
        <li>• Итог занятия: ошибки, трудные фразы, словарь и экспорт в .md.</li>
      </ul>
    </main>
  );
}
