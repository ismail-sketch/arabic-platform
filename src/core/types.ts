/**
 * Типы ядра. Намеренно без привязки к React/Next — это контракт между
 * логикой и любым интерфейсом.
 */

export type Level = 'beginner' | 'intermediate' | 'advanced';

export type TopicId =
  | 'free'
  | 'cafe'
  | 'market'
  | 'travel'
  | 'work'
  | 'daily'
  // Кабинет преподавателя сможет добавлять свои темы.
  | (string & Record<never, never>);

/** Программа занятия от преподавателя (появится в кабинете). */
export interface TeacherPlan {
  title?: string;
  /** Лексика недели. */
  words?: string[];
  /** Грамматика недели. */
  grammar?: string[];
  /** Как преподаватель исправляет ошибки. */
  rubric?: string;
  /** Свободное описание сценария. */
  scenarioPrompt?: string;
}

export interface SessionConfig {
  level: Level;
  topic: TopicId;
  /** Показывать ли огласовки в арабском тексте. */
  tashkeel: boolean;
  plan?: TeacherPlan;
}

/** Один ход тренажёра в ответ на фразу ученика. */
export interface Turn {
  ar: string;
  ru?: string;
  fix?: string | null;
  ok: boolean;
}

export interface AiMistake {
  category?: string;
  wrong?: string;
  right?: string;
  note?: string;
}

export interface AiSummary {
  advice: string;
  mistakes: AiMistake[];
  words: WordItem[];
}

export interface Mistake {
  text: string;
  count: number;
}

export interface Ask {
  ar: string;
  ru?: string;
}

export interface WordItem {
  ar: string;
  ru?: string;
  why?: string;
}

export type TranscriptEntry =
  | { role: 'user'; text: string }
  | {
      role: 'assistant';
      ar: string;
      ru?: string | null;
      fix?: string | null;
      ok?: boolean;
    };

export interface SessionSummary {
  id: string;
  date: string;
  durationSec: number;
  topic: TopicId;
  level: Level;
  msgs: number;
  mistakes: Mistake[];
  asks: Ask[];
  words: WordItem[];
  advice: string;
  aiDone: boolean;
  transcript: TranscriptEntry[];
  /** Версия промпта, на которой прошло занятие (для A/B методики). */
  promptVersion?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Порт к модели. Локально — прокси к AnyModel, в проде — серверный
 * эндпоинт с авторизацией и биллингом.
 */
export interface ChatClient {
  complete(
    messages: ChatMessage[],
    opts?: { temperature?: number; maxTokens?: number; signal?: AbortSignal },
  ): Promise<string>;
}

/**
 * Порт к хранилищу. Асинхронный сразу, чтобы переезд из localStorage
 * в облако не потребовал переписывать вызовы.
 */
export interface StoragePort {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
}
