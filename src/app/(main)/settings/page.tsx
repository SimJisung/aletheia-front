'use client';

import { useState } from 'react';
import { Settings, Palette, UserCircle, Info, Trash2, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, ThemeToggle } from '@/components/ui';
import { ValueImportanceEditor } from '@/components/values';
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
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <Settings className="w-6 h-6" />
          설정
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          앱 설정을 관리하세요
        </p>
      </div>

      {/* 테마 설정 */}
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary-500" />
            테마 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">테마 모드</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Light, Dark 또는 시스템 설정을 따릅니다
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* 가치 중요도 설정 */}
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent-500" />
            가치 중요도 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ValueImportanceEditor />
        </CardContent>
      </Card>

      {/* 사용자 정보 */}
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-secondary-500" />
            사용자 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">사용자 ID</p>
            <p className="font-mono text-sm text-[var(--color-text-secondary)] break-all bg-[var(--color-bg-tertiary)] px-3 py-2 rounded-lg mt-1">
              {userId}
            </p>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            이 ID는 브라우저에 저장되며, 다른 기기에서 접속 시 동일한 ID를 사용해야 데이터를 볼 수 있습니다.
          </p>
        </CardContent>
      </Card>

      {/* 앱 정보 */}
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-accent-500" />
            앱 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b border-[var(--color-border-subtle)]">
            <span className="text-[var(--color-text-muted)]">앱 이름</span>
            <span className="font-medium text-[var(--color-text-primary)]">Aletheia</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--color-text-muted)]">버전</span>
            <span className="font-medium text-[var(--color-text-primary)]">2.0.0</span>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 관리 */}
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-error-500">
            <Trash2 className="w-5 h-5" />
            데이터 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showResetConfirm ? (
            <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
              모든 데이터 초기화
            </Button>
          ) : (
            <div className="space-y-4 p-4 bg-error-50 dark:bg-error-900/20 rounded-xl border border-error-200 dark:border-error-800">
              <p className="text-sm text-error-600 dark:text-error-400">
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
