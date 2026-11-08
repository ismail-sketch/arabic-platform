import Link from 'next/link';

const steps: Array<[string, string]> = [
  [
    '1. Ученики',
    'Добавьте ученика ссылкой-приглашением — он попадёт в вашу группу и получит доступ к тренажёру.',
  ],
  [
    '2. Задания',
    'Соберите домашку из фото страницы учебника: текст, глоссарий, упражнения и аудио.',
  ],
  [
    '3. Автопроверка',
    'Ученик сдаёт текст или голос — ИИ проверяет по вашей рубрике, вам остаётся подтвердить.',
  ],
];

export default function TeacherPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <Link href="/" className="text-sm text-muted transition hover:text-accent">
        ← На главную
      </Link>

      <span className="mt-6 inline-block rounded-full border border-warn px-3 py-1 text-xs text-warn">
        в разработке
      </span>
      <h1 className="mt-4 text-2xl font-semibold">Кабинет преподавателя</h1>
      <p className="mt-3 leading-relaxed text-muted">
        Место, где преподаватель экономит часы на подготовке и проверке. Пока —
        скелет: без авторизации и базы данных.
      </p>

      <ol className="mt-8 space-y-4">
        {steps.map(([title, text]) => (
          <li key={title} className="rounded-2xl border border-line bg-panel p-5">
            <h2 className="font-semibold text-accent">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-xs leading-relaxed text-muted">
        MVP: ученики → задания → проверка. Оплату и подписку подключаем после
        того, как кабинет понадобится реальным преподавателям.
      </p>
    </main>
  );
}
