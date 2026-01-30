'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { useAuthStore } from '@/stores';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, resetOnboarding } = useAuthStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    logout();
    router.push('/login');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          <span aria-hidden="true">⚙️</span> 설정
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          앱 설정을 관리하세요
        </p>
      </div>

      {/* 사용자 정보 */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle>사용자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-neutral-500">이름</p>
            <p className="font-medium text-neutral-700 dark:text-neutral-300">
              {user?.username || '사용자'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">이메일</p>
            <p className="font-medium text-neutral-700 dark:text-neutral-300">
              {user?.email || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">사용자 ID</p>
            <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 break-all">
              {user?.id}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 앱 정보 */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle>앱 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">앱 이름</span>
            <span className="font-medium">PROS - Personal Reasoning OS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">버전</span>
            <span className="font-medium">0.1.0</span>
          </div>
        </CardContent>
      </Card>

      {/* 계정 관리 */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle>계정 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
            로그아웃
          </Button>
        </CardContent>
      </Card>

      {/* 데이터 관리 */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="text-red-600">데이터 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showResetConfirm ? (
            <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
              계정 삭제 및 로그아웃
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-600">
                정말로 로그아웃하시겠습니까? 로컬 데이터가 삭제됩니다.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>
                  취소
                </Button>
                <Button variant="danger" onClick={handleReset}>
                  확인
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
