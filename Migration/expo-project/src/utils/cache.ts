import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cache TTL constants
 */
export const CACHE_TTL_HOURS = 24;
export const CACHE_TTL_MS = CACHE_TTL_HOURS * 60 * 60 * 1000;

/**
 * Cached data structure with TTL
 */
interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Check if a cache entry is expired based on timestamp and TTL
 */
export function isExpired(timestamp: number, ttl: number): boolean {
  const now = Date.now();
  return now > timestamp + ttl;
}

/**
 * Generate a cache key for AsyncStorage
 */
export function getCacheKey(prefix: string, id: string): string {
  return `${prefix}-${id}`;
}

/**
 * Save data to AsyncStorage with TTL
 */
export async function saveCacheToStorage<T>(
  key: string,
  data: T,
  expiresAt: number
): Promise<void> {
  try {
    const cachedData: CachedData<T> = {
      data,
      timestamp: Date.now(),
      expiresAt,
    };
    const jsonValue = JSON.stringify(cachedData);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Failed to save cache for key ${key}:`, error);
    // Gracefully handle storage errors - don't throw
  }
}

/**
 * Load data from AsyncStorage, return null if missing or expired
 */
export async function loadCacheFromStorage<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      return null;
    }

    const cachedData: CachedData<T> = JSON.parse(jsonValue);
    const now = Date.now();

    // Check if expired
    if (now > cachedData.expiresAt) {
      // Clear expired cache
      await clearExpiredCache(key);
      return null;
    }

    return cachedData.data;
  } catch (error) {
    console.error(`Failed to load cache for key ${key}:`, error);
    // Return null on error (parse error, storage error, etc.)
    return null;
  }
}

/**
 * Remove expired cache entry from AsyncStorage
 */
export async function clearExpiredCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to clear cache for key ${key}:`, error);
    // Gracefully handle removal errors
  }
}
