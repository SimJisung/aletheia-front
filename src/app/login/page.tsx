'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { LoginForm, SocialLoginButtons } from '@/components/auth';
import { useUserStore } from '@/stores';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initializeAuth } = useUserStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);

  // 초기화 중이거나 이미 인증된 경우 로딩 표시
  if (!isInitialized || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4">💡</div>
          <p className="text-xl font-medium text-primary-600">PROS</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="elevated" padding="lg">
          <CardContent className="space-y-6">
            {/* 헤더 */}
            <div className="text-center">
              <div className="text-5xl mb-3">💡</div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                PROS
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Personal Reasoning OS
              </p>
            </div>

            {/* 로그인 폼 */}
            <LoginForm />

            {/* 구분선 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500">
                  또는
                </span>
              </div>
            </div>

            {/* 소셜 로그인 */}
            <SocialLoginButtons />

            {/* 회원가입 링크 */}
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              계정이 없으신가요?{' '}
              <Link
                href="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                회원가입
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
