'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores';

export default function HomePage() {
  const router = useRouter();
  const { initializeUser, isInitialized, onboarding } = useUserStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initialization calls
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeUser();
    }
  }, [initializeUser]);

  useEffect(() => {
    if (isInitialized) {
      if (onboarding.isComplete) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isInitialized, onboarding.isComplete, router]);

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
