'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { authApi, ApiError } from '@/lib/api';
import { useUserStore } from '@/stores';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const { login } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return false;
    }
    if (!email.trim()) {
      setError('이메일을 입력해주세요');
      return false;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요');
      return false;
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다');
      return false;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      login(response);

      if (onSuccess) {
        onSuccess();
      } else {
        // 신규 가입 → 온보딩으로 이동
        router.push('/onboarding');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 409:
            setError('이미 사용 중인 이메일입니다');
            break;
          case 400:
            setError('입력 정보를 확인해주세요');
            break;
          default:
            setError('회원가입에 실패했습니다. 다시 시도해주세요');
        }
      } else {
        setError('네트워크 오류가 발생했습니다');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          이름
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          autoComplete="name"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          autoComplete="email"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8자 이상 입력하세요"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-neutral-500">최소 8자 이상</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          비밀번호 확인
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호를 다시 입력하세요"
          autoComplete="new-password"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
      >
        회원가입
      </Button>
    </form>
  );
}
