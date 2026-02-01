'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui';
import { useUserStore } from '@/stores';
import { apiClient } from '@/lib/api';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUserStore();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const isNewUser = searchParams.get('isNewUser') === 'true';
    const errorCode = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorCode) {
      // OAuth 에러 처리
      const errorMessages: Record<string, string> = {
        authentication_failed: '인증에 실패했습니다',
        email_required: '이메일 정보를 가져올 수 없습니다',
        account_deactivated: '비활성화된 계정입니다',
        user_not_found: '사용자를 찾을 수 없습니다',
        unsupported_provider: '지원하지 않는 로그인 방식입니다',
        server_error: '서버 오류가 발생했습니다',
      };
      setError(errorMessages[errorCode] || errorDescription || '로그인에 실패했습니다');
      return;
    }

    if (token) {
      // JWT 형식 검증 (header.payload.signature)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        setError('유효하지 않은 인증 토큰입니다');
        return;
      }

      // JWT에서 사용자 정보 추출 (안전한 디코딩)
      try {
        // Base64 URL 디코딩 (JWT는 base64url 인코딩 사용)
        const base64Payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = atob(base64Payload);
        const payload = JSON.parse(decodedPayload);

        // 필수 필드 검증
        if (!payload.sub || typeof payload.sub !== 'string') {
          setError('토큰에 사용자 정보가 없습니다');
          return;
        }
        if (!payload.email || typeof payload.email !== 'string') {
          setError('토큰에 이메일 정보가 없습니다');
          return;
        }

        // 토큰 만료 검증 (exp 필드가 있는 경우)
        if (payload.exp && typeof payload.exp === 'number') {
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp < now) {
            setError('만료된 인증 토큰입니다. 다시 로그인해주세요.');
            return;
          }
        }

        // 토큰 저장
        apiClient.setToken(token);

        const user = {
          id: payload.sub,
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          createdAt: new Date().toISOString(),
        };

        login({ token, user });

        // 신규 사용자면 온보딩, 아니면 대시보드
        if (isNewUser) {
          router.replace('/onboarding');
        } else {
          router.replace('/dashboard');
        }
      } catch (err) {
        console.error('Token parsing error:', err);
        setError('토큰 처리 중 오류가 발생했습니다. 다시 로그인해주세요.');
      }
    } else {
      setError('인증 정보가 없습니다');
    }
  }, [searchParams, login, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
        <Card variant="elevated" padding="lg" className="max-w-md w-full">
          <CardContent className="text-center space-y-4">
            <div className="text-5xl">😥</div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              로그인 실패
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {error}
            </p>
            <button
              onClick={() => router.push('/login')}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              로그인 페이지로 돌아가기
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <Card variant="elevated" padding="lg" className="max-w-md w-full">
        <CardContent className="text-center space-y-4">
          <div className="text-5xl animate-pulse">💡</div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            로그인 처리 중...
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            잠시만 기다려주세요
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <Card variant="elevated" padding="lg" className="max-w-md w-full">
        <CardContent className="text-center space-y-4">
          <div className="text-5xl animate-pulse">💡</div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            로그인 처리 중...
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            잠시만 기다려주세요
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
