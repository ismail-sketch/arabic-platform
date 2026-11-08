/**
 * Копирует текущий тренажёр из старого проекта в public/trainer.html.
 *
 * Источник можно переопределить:
 *   npm run sync:trainer -- "D:\путь\к\index.html"
 * или переменной окружения TRAINER_SRC.
 */
import { copyFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const source =
  process.argv[2] ??
  process.env.TRAINER_SRC ??
  resolve(
    root,
    '../Мои проекты ии/Идеи для личной автоматизации/arabic-speaker/index.html',
  );

const dest = resolve(root, 'public/trainer.html');

try {
  await stat(source);
} catch {
  console.error(`Не найден файл тренажёра: ${source}`);
  console.error('Укажите путь: npm run sync:trainer -- "D:\\путь\\index.html"');
  process.exit(1);
}

await copyFile(source, dest);
console.log(`public/trainer.html ← ${source}`);
