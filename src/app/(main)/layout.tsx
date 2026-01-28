'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useUserStore } from '@/stores';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isInitialized, initializeUser, onboarding } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    if (isInitialized && !onboarding.isComplete) {
      router.push('/onboarding');
    }
  }, [isInitialized, onboarding.isComplete, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl">💡</div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
