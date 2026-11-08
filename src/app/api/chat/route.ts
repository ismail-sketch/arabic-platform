/**
 * Прокси к модели. Клиент не знает, куда ходят запросы и какая модель
 * используется, — это позволяет позже добавить авторизацию и биллинг,
 * не меняя фронтенд.
 */

import { NextResponse } from 'next/server';
import { chatComplete, llmConfigured } from '@/lib/llm';

export async function POST(request: Request) {
  if (!llmConfigured()) {
    return NextResponse.json(
      {
        error:
          'Не задан ANYMODEL_KEY. Создайте web/.env (см. web/.env.example) и перезапустите сервер.',
      },
      { status: 500 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  if (!Array.isArray(body.messages)) {
    return NextResponse.json(
      { error: 'Поле messages обязательно и должно быть массивом' },
      { status: 400 },
    );
  }

  try {
    const upstream = await chatComplete({
      messages: body.messages,
      temperature:
        typeof body.temperature === 'number' ? body.temperature : undefined,
      maxTokens:
        typeof body.max_tokens === 'number' ? body.max_tokens : undefined,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: 'Не удалось связаться с AnyModel: ' + message },
      { status: 502 },
    );
  }
}
