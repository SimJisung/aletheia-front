'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useAuthStore } from '@/stores';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isInitialized, isAuthenticated, initialize, onboarding } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        // 인증되지 않은 경우 로그인 페이지로
        router.replace('/login');
      } else if (!onboarding.isComplete) {
        // 온보딩이 완료되지 않은 경우
        router.replace('/onboarding');
      }
    }
  }, [isInitialized, isAuthenticated, onboarding.isComplete, router]);

  // 로딩 중이거나 인증되지 않은 경우
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl" role="status" aria-label="로딩 중">
          <span aria-hidden="true">💡</span>
          <span className="sr-only">로딩 중</span>
        </div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
