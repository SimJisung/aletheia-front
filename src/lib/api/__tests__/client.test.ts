import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiError, generateUserId } from '../client';

describe('ApiClient', () => {
  const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch.mockReset();
    apiClient.clearUserId();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('setUserId / getUserId', () => {
    it('should set and get user ID', () => {
      apiClient.setUserId('test-user-123');
      expect(apiClient.getUserId()).toBe('test-user-123');
    });

    it('should store user ID in localStorage', () => {
      apiClient.setUserId('test-user-456');
      expect(localStorage.setItem).toHaveBeenCalledWith('pros-user-id', 'test-user-456');
    });

    it('should return null when no user ID is set', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(apiClient.getUserId()).toBeNull();
    });
  });

  describe('clearUserId', () => {
    it('should clear user ID', () => {
      apiClient.setUserId('test-user');
      apiClient.clearUserId();
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(apiClient.getUserId()).toBeNull();
    });

    it('should remove user ID from localStorage', () => {
      apiClient.clearUserId();
      expect(localStorage.removeItem).toHaveBeenCalledWith('pros-user-id');
    });
  });

  describe('request', () => {
    it('should throw ApiError when user ID is not set', async () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      await expect(apiClient.get('/test')).rejects.toThrow(ApiError);
      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 401,
        statusText: 'User ID not set',
      });
    });

    it('should make GET request with proper headers', async () => {
      apiClient.setUserId('test-user');
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
            'X-User-Id': 'test-user',
          }),
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should make GET request with query params', async () => {
      apiClient.setUserId('test-user');
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
      apiClient.setUserId('test-user');
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
      apiClient.setUserId('test-user');
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
      apiClient.setUserId('test-user');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await apiClient.delete('/test/123');

      expect(result).toBeUndefined();
    });

    it('should throw ApiError on non-ok response', async () => {
      apiClient.setUserId('test-user');
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
      apiClient.setUserId('test-user');
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(apiClient.get('/test')).rejects.toThrow(ApiError);
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

describe('generateUserId', () => {
  it('should generate a UUID', () => {
    const userId = generateUserId();
    expect(userId).toBe('test-uuid-1234-5678-9abc-def012345678');
  });
});
