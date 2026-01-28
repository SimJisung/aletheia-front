'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { useUserStore } from '@/stores';

export default function SettingsPage() {
  const { userId, clearUser, resetOnboarding } = useUserStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    clearUser();
    resetOnboarding();
    window.location.href = '/';
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          ⚙️ 설정
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
            <p className="text-sm text-neutral-500">사용자 ID</p>
            <p className="font-mono text-sm text-neutral-700 dark:text-neutral-300 break-all">
              {userId}
            </p>
          </div>
          <p className="text-xs text-neutral-400">
            이 ID는 브라우저에 저장되며, 다른 기기에서 접속 시 동일한 ID를 사용해야 데이터를 볼 수 있습니다.
          </p>
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

      {/* 데이터 관리 */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="text-red-600">데이터 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showResetConfirm ? (
            <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
              모든 데이터 초기화
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-600">
                정말로 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>
                  취소
                </Button>
                <Button variant="danger" onClick={handleReset}>
                  초기화 확인
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
