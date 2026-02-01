'use client';

import { useEffect } from 'react';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging/monitoring
    console.error('Main section error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="text-6xl">😓</div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            페이지를 불러올 수 없습니다
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 mt-2">
            일시적인 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-left">
            <p className="text-xs font-mono text-red-700 dark:text-red-300 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            다시 시도
          </button>
          <a
            href="/dashboard"
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-block"
          >
            대시보드로 이동
          </a>
        </div>
      </div>
    </div>
  );
}
