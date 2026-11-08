/**
 * Серверный клиент к AnyModel (OpenAI-совместимый API).
 * Ключ живёт только в .env и никогда не попадает в браузер.
 */

const BASE = process.env.ANYMODEL_BASE || 'https://anymodel.org/v1';
const KEY = process.env.ANYMODEL_KEY || '';
export const LLM_MODEL = process.env.MODEL || 'gc/gemini-2.5-flash';

export function llmConfigured(): boolean {
  return Boolean(KEY);
}

export interface LlmRequest {
  messages: unknown[];
  temperature?: number;
  maxTokens?: number;
}

/**
 * Один запрос к модели с коротким повтором на сетевых ошибках.
 * Возвращает «сырой» ответ — разбор делает вызывающий код.
 */
export async function chatComplete(req: LlmRequest): Promise<{
  status: number;
  body: string;
}> {
  const payload = {
    model: LLM_MODEL,
    messages: req.messages,
    temperature: req.temperature ?? 0.5,
    max_tokens: req.maxTokens ?? 700,
  };
  const body = JSON.stringify(payload);

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${KEY}`,
        },
        body,
        signal: AbortSignal.timeout(30_000),
      });
      return { status: res.status, body: await res.text() };
    } catch (e) {
      lastError = e;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 400));
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(message);
}
