import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync, useFormSubmit } from '../useAsync';
import { ApiError } from '@/lib/api/client';

describe('useAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has correct initial state', () => {
    const asyncFn = vi.fn();
    const { result } = renderHook(() => useAsync(asyncFn));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('sets isLoading to true when executing', async () => {
    const asyncFn = vi.fn(() => new Promise<string>((resolve) => setTimeout(() => resolve('data'), 100)));
    const { result } = renderHook(() => useAsync(asyncFn));

    act(() => {
      result.current.execute();
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns data on success', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success data');
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('success data');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('calls onSuccess callback on success', async () => {
    const asyncFn = vi.fn().mockResolvedValue('data');
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useAsync(asyncFn, { onSuccess }));

    await act(async () => {
      await result.current.execute();
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('sets error on failure', async () => {
    const asyncFn = vi.fn().mockRejectedValue(new Error('failed'));
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('오류가 발생했습니다. 다시 시도해주세요.');
    expect(result.current.isLoading).toBe(false);
  });

  it('uses custom error message', async () => {
    const asyncFn = vi.fn().mockRejectedValue(new Error('failed'));
    const { result } = renderHook(() => useAsync(asyncFn, { errorMessage: 'Custom error' }));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('Custom error');
  });

  it('calls onError callback on failure', async () => {
    const error = new Error('failed');
    const asyncFn = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();
    const { result } = renderHook(() => useAsync(asyncFn, { onError }));

    await act(async () => {
      await result.current.execute();
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('handles ApiError 401', async () => {
    const asyncFn = vi.fn().mockRejectedValue(new ApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('인증이 필요합니다. 다시 로그인해주세요.');
  });

  it('handles ApiError 404', async () => {
    const asyncFn = vi.fn().mockRejectedValue(new ApiError(404, 'Not Found'));
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('요청한 정보를 찾을 수 없습니다.');
  });

  it('handles ApiError 500', async () => {
    const asyncFn = vi.fn().mockRejectedValue(new ApiError(500, 'Internal Server Error'));
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  });

  it('handles ApiError with message in data', async () => {
    const asyncFn = vi.fn().mockRejectedValue(new ApiError(400, 'Bad Request', { message: 'Custom API message' }));
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('Custom API message');
  });

  it('passes arguments to async function', async () => {
    const asyncFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute('arg1', 'arg2');
    });

    expect(asyncFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('resets state', async () => {
    const asyncFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('data');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useFormSubmit', () => {
  it('works the same as useAsync', async () => {
    const submitFn = vi.fn().mockResolvedValue('submitted');
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useFormSubmit(submitFn, { onSuccess }));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('submitted');
    expect(onSuccess).toHaveBeenCalled();
  });
});
