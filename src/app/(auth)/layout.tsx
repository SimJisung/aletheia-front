'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize, onboarding } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      // 이미 로그인된 경우 리다이렉트
      if (onboarding.isComplete) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isInitialized, isAuthenticated, onboarding.isComplete, router]);

  // 로딩 중이거나 이미 인증된 경우
  if (!isInitialized || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center animate-pulse" role="status" aria-label="로딩 중">
          <div className="text-6xl mb-4" aria-hidden="true">💡</div>
          <p className="text-xl font-medium text-primary-600">PROS</p>
          <span className="sr-only">페이지를 로딩하고 있습니다</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800 px-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2" aria-hidden="true">💡</div>
          <h1 className="text-2xl font-bold text-primary-600">PROS</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Personal Reasoning OS
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
