'use client';

import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api/client';

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseAsyncOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseAsyncReturn<T, Args extends unknown[]> extends AsyncState<T> {
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for handling async operations with consistent error handling
 * @param asyncFn - The async function to execute
 * @param options - Optional callbacks and messages
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T, Args> {
  const { onSuccess, onError, errorMessage } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({ data: null, error: null, isLoading: true });

      try {
        const result = await asyncFn(...args);
        setState({ data: result, error: null, isLoading: false });
        onSuccess?.();
        return result;
      } catch (err) {
        let message = errorMessage || '오류가 발생했습니다. 다시 시도해주세요.';

        if (err instanceof ApiError) {
          // Handle specific API errors
          if (err.status === 401) {
            message = '인증이 필요합니다. 다시 로그인해주세요.';
          } else if (err.status === 404) {
            message = '요청한 정보를 찾을 수 없습니다.';
          } else if (err.status === 500) {
            message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else if (err.data && typeof err.data === 'object' && 'message' in err.data) {
            message = (err.data as { message: string }).message;
          }
        }

        console.error('Async operation failed:', err);
        setState({ data: null, error: message, isLoading: false });
        onError?.(err);
        return null;
      }
    },
    [asyncFn, onSuccess, onError, errorMessage]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Custom hook for form submissions with async operations
 */
export function useFormSubmit<T, Args extends unknown[] = []>(
  submitFn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T, Args> {
  return useAsync(submitFn, options);
}
