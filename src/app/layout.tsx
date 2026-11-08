import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'مدرّب — платформа для арабского языка',
  description:
    'Голосовой тренажёр литературного арабского и кабинет преподавателя: диалог, разбор ошибок, домашние задания и автопроверка.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
