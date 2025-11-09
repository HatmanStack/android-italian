import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  isExpired,
  getCacheKey,
  saveCacheToStorage,
  loadCacheFromStorage,
  clearExpiredCache,
  CACHE_TTL_MS,
} from '../../src/utils/cache';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('cache utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isExpired', () => {
    it('should detect expired cache', () => {
      const pastTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      expect(isExpired(pastTimestamp, CACHE_TTL_MS)).toBe(true);
    });

    it('should detect valid cache', () => {
      const recentTimestamp = Date.now() - (1 * 60 * 60 * 1000); // 1 hour ago
      expect(isExpired(recentTimestamp, CACHE_TTL_MS)).toBe(false);
    });

    it('should handle edge case at expiry boundary', () => {
      const expiryTimestamp = Date.now() - CACHE_TTL_MS - 1; // Just expired
      expect(isExpired(expiryTimestamp, CACHE_TTL_MS)).toBe(true);
    });

    it('should detect valid cache just before expiry', () => {
      const almostExpiredTimestamp = Date.now() - CACHE_TTL_MS + 1000; // 1 second before expiry
      expect(isExpired(almostExpiredTimestamp, CACHE_TTL_MS)).toBe(false);
    });
  });

  describe('getCacheKey', () => {
    it('should generate cache key with prefix and id', () => {
      const key = getCacheKey('place-details', 'test-id-123');
      expect(key).toBe('place-details-test-id-123');
    });

    it('should handle empty prefix', () => {
      const key = getCacheKey('', 'test-id');
      expect(key).toBe('-test-id');
    });

    it('should handle empty id', () => {
      const key = getCacheKey('prefix', '');
      expect(key).toBe('prefix-');
    });
  });

  describe('saveCacheToStorage and loadCacheFromStorage', () => {
    it('should save and load data successfully', async () => {
      const testData = { name: 'Test Restaurant', address: '123 Main St' };
      const expiresAt = Date.now() + CACHE_TTL_MS;

      // Save
      await saveCacheToStorage('test-key', testData, expiresAt);

      // Verify setItem was called with correct structure
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        expect.stringContaining('"data"')
      );

      // Mock getItem to return what we just saved
      const cachedData = {
        data: testData,
        timestamp: Date.now(),
        expiresAt,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cachedData));

      // Load
      const loaded = await loadCacheFromStorage('test-key');
      expect(loaded).toEqual(testData);
    });

    it('should return null for missing cache', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const loaded = await loadCacheFromStorage('missing-key');
      expect(loaded).toBeNull();
    });

    it('should return null for expired cache and clear it', async () => {
      const testData = { name: 'Test Restaurant' };
      const expiredData = {
        data: testData,
        timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        expiresAt: Date.now() - (1 * 60 * 60 * 1000), // Expired 1 hour ago
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(expiredData));

      const loaded = await loadCacheFromStorage('expired-key');
      expect(loaded).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('expired-key');
    });

    it('should handle JSON parse errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json{');

      const loaded = await loadCacheFromStorage('bad-key');
      expect(loaded).toBeNull();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const loaded = await loadCacheFromStorage('error-key');
      expect(loaded).toBeNull();
    });
  });

  describe('clearExpiredCache', () => {
    it('should remove cache entry', async () => {
      await clearExpiredCache('test-key');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle removal errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Remove error'));

      // Should not throw
      await expect(clearExpiredCache('error-key')).resolves.not.toThrow();
    });
  });
});
