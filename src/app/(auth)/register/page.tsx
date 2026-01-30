'use client';

import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { useFormSubmit } from '@/hooks';

export default function RegisterPage() {
  const router = useRouter();
  const formId = useId();
  const { register } = useAuthStore();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { execute, isLoading, error: submitError } = useFormSubmit(
    async () => {
      await register({ email, username, password });
      return true;
    },
    {
      errorMessage: '회원가입에 실패했습니다. 다시 시도해주세요.',
    }
  );

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setValidationError('이메일을 입력해주세요');
      return false;
    }

    if (!email.includes('@')) {
      setValidationError('올바른 이메일 형식을 입력해주세요');
      return false;
    }

    if (!username.trim()) {
      setValidationError('사용자 이름을 입력해주세요');
      return false;
    }

    if (username.length < 2) {
      setValidationError('사용자 이름은 2자 이상이어야 합니다');
      return false;
    }

    if (!password) {
      setValidationError('비밀번호를 입력해주세요');
      return false;
    }

    if (password.length < 8) {
      setValidationError('비밀번호는 8자 이상이어야 합니다');
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError('비밀번호가 일치하지 않습니다');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!validateForm()) {
      return;
    }

    const result = await execute();
    if (result) {
      router.push('/onboarding');
    }
  };

  const error = validationError || submitError;

  return (
    <Card variant="bordered" padding="lg">
      <CardHeader className="text-center">
        <CardTitle>회원가입</CardTitle>
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

          {/* 사용자 이름 */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-username`}
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              사용자 이름
            </label>
            <Input
              id={`${formId}-username`}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="홍길동"
              autoComplete="username"
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
              placeholder="8자 이상 입력하세요"
              autoComplete="new-password"
              aria-required="true"
              disabled={isLoading}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-confirm-password`}
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              비밀번호 확인
            </label>
            <Input
              id={`${formId}-confirm-password`}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
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

          {/* 회원가입 버튼 */}
          <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
            회원가입
          </Button>

          {/* 로그인 링크 */}
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              로그인
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
