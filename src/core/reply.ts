/**
 * Разбор ответа модели. Пока — формат с метками AR:/RU:/FIX:.
 *
 * Следующий шаг (см. план в корневом AGENTS.md): перейти на строгий JSON
 * и оставить эту функцию как fallback.
 */

import { cleanText, normalizeArabic, stripHarakat, vocabKey } from './text';
import type { AiMistake, AiSummary, Turn } from './types';

/** Достаёт JSON из ответа модели, даже если он завёрнут в ```json. */
export function extractJson<T = unknown>(raw: string): T {
  const txt = String(raw ?? '');
  const fence = txt.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence ? fence[1] : txt;
  const a = body.indexOf('{');
  const b = body.lastIndexOf('}');
  if (a < 0 || b <= a) {
    throw new Error('Модель вернула ответ не в формате JSON');
  }
  return JSON.parse(body.slice(a, b + 1)) as T;
}

export interface ParseReplyOptions {
  tashkeel: boolean;
}

/** Разбирает ответ диалога на арабскую фразу, перевод и разбор ошибок. */
export function parseReply(reply: string, opts: ParseReplyOptions): Turn {
  const raw = cleanText(reply);

  let ar =
    (raw.match(/AR:\s*([\s\S]*?)(?:RU:|FIX:|$)/) || [])[1]?.trim() || raw;
  const ru = (raw.match(/RU:\s*([\s\S]*?)(?:FIX:|$)/) || [])[1]?.trim();
  let fix = (raw.match(/FIX:\s*([\s\S]*)/) || [])[1]?.trim() || '';

  ar = normalizeArabic(ar);
  fix = normalizeArabic(fix);

  // Страховка: если огласовки выключены, убираем харакаты даже если модель их добавила.
  if (!opts.tashkeel) {
    ar = stripHarakat(ar);
    fix = stripHarakat(fix);
  }

  const ok = /^отлично/i.test(fix);
  return { ar, ru: ru || undefined, fix: fix || null, ok };
}

/** Разбор строгого JSON-ответа методиста (кнопка «Улучшить разбор ИИ»). */
export function parseAiSummary(raw: string): AiSummary {
  const j = extractJson<Record<string, unknown>>(raw);
  const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

  const mistakes = arr(j.mistakes)
    .map((item) => {
      const m = (item ?? {}) as Record<string, unknown>;
      return {
        category: cleanText(String(m.category ?? '')).trim(),
        wrong: normalizeArabic(cleanText(String(m.wrong ?? '')).trim()),
        right: normalizeArabic(cleanText(String(m.right ?? '')).trim()),
        note: cleanText(String(m.note ?? '')).trim(),
      } satisfies AiMistake;
    })
    .filter((m) => m.wrong || m.right);

  const words = arr(j.words)
    .map((item) => {
      const w = (item ?? {}) as Record<string, unknown>;
      return {
        ar: normalizeArabic(cleanText(String(w.ar ?? '')).trim()),
        ru: cleanText(String(w.ru ?? '')).trim(),
        why: cleanText(String(w.why ?? '')).trim(),
      };
    })
    .filter((w) => w.ar);

  return {
    advice: typeof j.advice === 'string' ? cleanText(j.advice).trim() : '',
    mistakes,
    words,
  };
}

/** Ключ для дедупликации ошибок: сравниваем пару «неверно → верно». */
export function mistakeKey(text: string): string {
  const m = String(text).match(/«([^»]+)»\s*→\s*«([^»]+)»/);
  if (m) return vocabKey(m[1]) + '→' + vocabKey(m[2]);
  return String(text)
    .toLowerCase()
    .replace(/^•\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Человекочитаемая строка ошибки из структурированного разбора. */
export function mistakeText(m: AiMistake): string {
  const cat = m.category ? m.category + ': ' : '';
  const pair = (
    (m.wrong ? '«' + m.wrong + '» ' : '') + (m.right ? '→ «' + m.right + '»' : '')
  ).trim();
  return '• ' + cat + pair + (m.note ? ' — ' + m.note : '');
}
