'use client';

import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { useFormSubmit } from '@/hooks';
import { AuthApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const formId = useId();
  const { login, onboarding } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { execute, isLoading, error: submitError } = useFormSubmit(
    async () => {
      await login({ email, password });
      return true;
    },
    {
      errorMessage: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError('이메일을 입력해주세요');
      return;
    }

    if (!password) {
      setValidationError('비밀번호를 입력해주세요');
      return;
    }

    const result = await execute();
    if (result) {
      if (onboarding.isComplete) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  };

  const error = validationError || submitError;

  return (
    <Card variant="bordered" padding="lg">
      <CardHeader className="text-center">
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} aria-describedby={error ? `${formId}-error` : undefined}>
        <CardContent className="space-y-4">
          {/* 이메일 */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-email`}
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              이메일
            </label>
            <Input
              id={`${formId}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              aria-required="true"
              disabled={isLoading}
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-password`}
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              비밀번호
            </label>
            <Input
              id={`${formId}-password`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              aria-required="true"
              disabled={isLoading}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p id={`${formId}-error`} className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {/* 로그인 버튼 */}
          <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
            로그인
          </Button>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            계정이 없으신가요?{' '}
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              회원가입
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
