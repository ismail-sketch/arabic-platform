/**
 * Итог занятия: локальная сводка и экспорт в Markdown.
 * Чистые функции — вызываются и в браузере, и на сервере (генератор отчётов).
 */

import { isHelpRequest, shortRu, vocabKey } from './text';
import { levelLabel, topicLabel } from './prompt';
import type {
  Ask,
  Mistake,
  SessionSummary,
  TranscriptEntry,
} from './types';

/** Локальный итог без обращения к модели: ошибки из FIX + русские вопросы. */
export function buildLocalSummary(entries: TranscriptEntry[]): {
  mistakes: Mistake[];
  asks: Ask[];
} {
  const mistakeMap = new Map<string, Mistake>();
  const asks: Ask[] = [];
  const seenAr = new Set<string>();

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.role !== 'assistant') continue;

    if (e.fix && !e.ok) {
      for (const raw of String(e.fix).split(/\r?\n/)) {
        // Модель иногда вставляет в FIX свои же метки — не тащим их в итог.
        if (/^\s*(AR|RU|FIX):/i.test(raw)) continue;
        const t = raw.replace(/^\s*[•\-–—*]\s*/, '').trim();
        if (!t) continue;
        const key = t.toLowerCase().replace(/\s+/g, ' ');
        const cur = mistakeMap.get(key);
        if (cur) cur.count++;
        else mistakeMap.set(key, { text: t, count: 1 });
      }
    }

    const prev = entries[i - 1];
    if (prev && prev.role === 'user' && isHelpRequest(prev.text) && e.ar) {
      const key = vocabKey(e.ar);
      if (!key || seenAr.has(key)) continue;
      seenAr.add(key);
      asks.push({ ar: e.ar, ru: shortRu(e.ru) });
    }
  }

  return { mistakes: [...mistakeMap.values()], asks };
}

export function durationText(sec: number | null | undefined): string {
  const s = Math.max(0, Math.round(sec || 0));
  if (s < 60) return s + ' с';
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return m + ' мин' + (rest ? ' ' + rest + ' с' : '');
}

export function dateText(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Строка с метаданными занятия для шапки итога. */
export function summaryMetaLine(ses: SessionSummary): string {
  return [
    dateText(ses.date),
    durationText(ses.durationSec),
    topicLabel(ses.topic),
    levelLabel(ses.level),
    ses.msgs + ' репл.',
  ].join(' · ');
}

/** Экспорт итога в Markdown (кнопка «Скачать .md», отчёты кабинета). */
export function summaryToMarkdown(ses: SessionSummary): string {
  const L: string[] = [];
  L.push('# Итог занятия — ' + dateText(ses.date));
  L.push('');
  L.push(
    'Тема: ' +
      topicLabel(ses.topic) +
      ' · Уровень: ' +
      levelLabel(ses.level) +
      ' · ' +
      durationText(ses.durationSec) +
      ' · ' +
      ses.msgs +
      ' реплик',
  );

  if (ses.advice) L.push('', '## Совет', '', ses.advice);

  L.push('', '## Ошибки');
  if ((ses.mistakes || []).length) {
    ses.mistakes.forEach((m) =>
      L.push(
        '- ' +
          m.text.replace(/^•\s*/, '') +
          (m.count > 1 ? ' (×' + m.count + ')' : ''),
      ),
    );
  } else {
    L.push('- Ошибок не было.');
  }

  if ((ses.asks || []).length) {
    L.push('', '## О чём переспрашивал');
    ses.asks.forEach((a) => L.push('- **' + a.ar + '** — ' + shortRu(a.ru)));
  }

  if ((ses.words || []).length) {
    L.push('', '## Слова занятия');
    ses.words.forEach((w) =>
      L.push(
        '- **' + w.ar + '** — ' + (w.ru || '') + (w.why ? ' (' + w.why + ')' : ''),
      ),
    );
  }

  if ((ses.transcript || []).length) {
    L.push('', '## Транскрипт', '');
    ses.transcript.forEach((e) => {
      if (e.role === 'user') {
        L.push('**Ты:** ' + e.text);
      } else {
        L.push('**Тренер:** ' + (e.ar || ''));
        if (e.ru) L.push('_Перевод:_ ' + e.ru);
        if (e.fix) L.push('_Разбор:_ ' + String(e.fix).replace(/\n/g, ' '));
      }
      L.push('');
    });
  }

  return L.join('\n');
}
