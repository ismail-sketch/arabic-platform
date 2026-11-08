/**
 * Чистые функции для арабского текста.
 *
 * Здесь нет DOM, localStorage и сети — модуль одинаково работает в браузере
 * и в Node. Это то самое «ядро», которое переиспользуют тренажёр и кабинет
 * преподавателя.
 */

/** Диапазоны арабских символов (основной блок, расширения, презентационные формы). */
export const AR_CHAR =
  /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

/** Один «прогон» текста: арабский отрезок либо всё остальное. */
export const AR_RUN_RE =
  /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF][\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s،؟.…!]*|[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g;

/** Огласовки (харакаты) и коранические знаки. */
export const HARAKAT_RE = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;

/**
 * «Битые» символы (U+FFFD), управляющие коды и невидимые bidi-марки,
 * которые ломают отображение смешанных русско-арабских строк.
 */
export const BAD_CHARS_RE =
  /[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F\u202A-\u202E\u2066-\u2069]/g;

/** Персидские/урду-варианты букв → арабские (фусха), татвиль убираем. */
const ARABIC_FIXES: ReadonlyArray<readonly [RegExp, string]> = [
  [/\u06A9/g, '\u0643'], // ک → ك
  [/\u06CC/g, '\u064A'], // ی → ي
  [/\u06D2|\u06D3/g, '\u064A'], // ے ۓ → ي
  [/\u06C1|\u06BE|\u06D5/g, '\u0647'], // ہ ھ ە → ه
  [/\u0640/g, ''], // татвиль
];

/** Убирает битые символы и невидимые bidi-марки. */
export function cleanText(s: string | null | undefined): string {
  return s == null ? '' : String(s).replace(BAD_CHARS_RE, '');
}

/** Чинит персидские буквы и убирает татвиль. */
export function normalizeArabic(s: string | null | undefined): string {
  if (!s) return '';
  let out = String(s);
  for (const [re, to] of ARABIC_FIXES) out = out.replace(re, to);
  return out;
}

/** Убирает огласовки. */
export function stripHarakat(s: string | null | undefined): string {
  return s ? String(s).replace(HARAKAT_RE, '') : '';
}

/** Есть ли в строке арабские символы. */
export function isArabic(text: string | null | undefined): boolean {
  return AR_CHAR.test(cleanText(text));
}

/** Есть ли латиница или кириллица. */
export function hasLatinOrCyrillic(text: string | null | undefined): boolean {
  return /[A-Za-zА-Яа-яЁё]/.test(String(text ?? ''));
}

export interface BidiRun {
  text: string;
  dir: 'rtl' | 'ltr';
}

/**
 * Режет смешанную строку на куски с направлением текста.
 * Чистая часть рендера: UI-слой сам решает, как их рисовать.
 */
export function splitBidiRuns(text: string | null | undefined): BidiRun[] {
  const t = cleanText(text);
  if (!t) return [];
  if (!AR_CHAR.test(t)) return [{ text: t, dir: 'ltr' }];
  const runs = t.match(AR_RUN_RE) ?? [t];
  return runs.map((run) => ({
    text: run,
    dir: AR_CHAR.test(run) ? 'rtl' : 'ltr',
  }));
}

/**
 * Ключ для словаря: без огласовок, с нормализацией персидских букв,
 * татвиля и алифных вариантов (أ إ آ ٱ → ا).
 *
 * TODO: унифицировать ة/ه и ى/ي — сейчас «مدرسة» и «مدرسه» дают разные ключи.
 */
export function vocabKey(ar: string | null | undefined): string {
  return normalizeArabic(stripHarakat(ar))
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[^\u0600-\u06FF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Русский вопрос ученика (просьба о помощи), а не попытка сказать по-арабски. */
export function isHelpRequest(text: string | null | undefined): boolean {
  return /[А-Яа-яЁё]/.test(String(text ?? ''));
}

/** Первое предложение русского перевода — для компактных списков. */
export function shortRu(ru: string | null | undefined): string {
  const s = String(ru ?? '')
    .replace(/^перевод:\s*/i, '')
    .trim();
  const m = s.match(/^[^.!?]+[.!?]?/);
  return (m ? m[0] : s).trim();
}
