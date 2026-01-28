import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PROS - Personal Reasoning OS',
  description: '과거의 나를 불러오는 개인 의사결정 지원 시스템',
  keywords: ['의사결정', '자기성찰', '가치관', '저널링'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-screen bg-neutral-50 dark:bg-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
