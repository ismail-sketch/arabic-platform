import Link from 'next/link';

const features = [
  {
    title: 'Голосовой тренажёр',
    text: 'Говорите в микрофон — тренажёр отвечает голосом, переводит и разбирает ошибки по категориям.',
  },
  {
    title: 'Кабинет преподавателя',
    text: 'Программа занятия, домашние задания из вашего материала и автопроверка по вашей методике.',
  },
  {
    title: 'Арабский по-настоящему',
    text: 'Фусха, огласовки вкл/выкл, смешанный режим AR+RU и словарь, собранный из ваших занятий.',
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16">
      <header className="max-w-3xl">
        <p className="font-arabic text-2xl text-accent" dir="rtl">
          مدرّب
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Платформа для арабского: тренажёр для ученика и кабинет для
          преподавателя
        </h1>
        <p className="mt-5 leading-relaxed text-muted">
          Литературный арабский (фусха). Ученик говорит — тренажёр слушает,
          отвечает голосом и разбирает ошибки. Преподаватель задаёт программу,
          получает домашние задания и проверку.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/trainer.html"
            className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-[#06281f] transition hover:brightness-110"
          >
            Открыть тренажёр
          </a>
          <Link
            href="/teacher"
            className="rounded-lg border border-line bg-panel px-5 py-2.5 font-semibold transition hover:border-accent"
          >
            Кабинет преподавателя
          </Link>
        </div>
      </header>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-line bg-panel p-5">
            <h2 className="text-base font-semibold text-accent">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
        Arabic Platform · тренажёр + кабинет преподавателя
      </footer>
    </main>
  );
}
