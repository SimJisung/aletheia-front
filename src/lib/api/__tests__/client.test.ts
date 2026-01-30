import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiError } from '../client';

describe('ApiClient', () => {
  const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch.mockReset();
    apiClient.clearToken();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('setToken / getToken', () => {
    it('should set and get token', () => {
      apiClient.setToken('test-token-123');
      expect(apiClient.getToken()).toBe('test-token-123');
    });

    it('should store token in localStorage', () => {
      apiClient.setToken('test-token-456');
      expect(localStorage.setItem).toHaveBeenCalledWith('pros-auth-token', 'test-token-456');
    });

    it('should return null when no token is set', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(apiClient.getToken()).toBeNull();
    });
  });

  describe('clearToken', () => {
    it('should clear token', () => {
      apiClient.setToken('test-token');
      apiClient.clearToken();
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(apiClient.getToken()).toBeNull();
    });

    it('should remove token from localStorage', () => {
      apiClient.clearToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith('pros-auth-token');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token is set', () => {
      apiClient.setToken('test-token');
      expect(apiClient.isAuthenticated()).toBe(true);
    });

    it('should return false when no token is set', () => {
      apiClient.clearToken();
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(apiClient.isAuthenticated()).toBe(false);
    });
  });

  describe('request', () => {
    it('should throw ApiError when not authenticated', async () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      await expect(apiClient.get('/test')).rejects.toThrow(ApiError);
      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 401,
        statusText: 'Not authenticated',
      });
    });

    it('should make GET request with proper headers', async () => {
      apiClient.setToken('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'test' }),
      });

      const result = await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should make GET request with query params', async () => {
      apiClient.setToken('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'test' }),
      });

      await apiClient.get('/test', { limit: 10, offset: 0 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/limit=10/),
        expect.anything()
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/offset=0/),
        expect.anything()
      );
    });

    it('should make POST request with body', async () => {
      apiClient.setToken('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: '123' }),
      });

      const result = await apiClient.post('/test', { name: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        })
      );
      expect(result).toEqual({ id: '123' });
    });

    it('should make DELETE request', async () => {
      apiClient.setToken('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await apiClient.delete('/test/123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test/123'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should handle 204 No Content response', async () => {
      apiClient.setToken('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await apiClient.delete('/test/123');

      expect(result).toBeUndefined();
    });

    it('should throw ApiError on non-ok response', async () => {
      apiClient.setToken('test-token');
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Resource not found' }),
      });

      const promise = apiClient.get('/test/notfound');
      await expect(promise).rejects.toThrow(ApiError);

      const promise2 = apiClient.get('/test/notfound');
      await expect(promise2).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should handle error response without JSON body', async () => {
      apiClient.setToken('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(apiClient.get('/test')).rejects.toThrow(ApiError);
    });

    it('should call onUnauthorized callback on 401 error', async () => {
      const onUnauthorized = vi.fn();
      apiClient.setToken('expired-token');
      apiClient.setOnUnauthorized(onUnauthorized);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ message: 'Token expired' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow(ApiError);
      expect(onUnauthorized).toHaveBeenCalled();
    });
  });
});

describe('ApiError', () => {
  it('should create error with proper properties', () => {
    const error = new ApiError(400, 'Bad Request', { field: 'name', message: 'required' });

    expect(error.status).toBe(400);
    expect(error.statusText).toBe('Bad Request');
    expect(error.data).toEqual({ field: 'name', message: 'required' });
    expect(error.message).toBe('API Error: 400 Bad Request');
    expect(error.name).toBe('ApiError');
  });
});
