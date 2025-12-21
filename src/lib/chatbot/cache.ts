/**
 * In-memory cache for chatbot responses
 * Cache expires after specified TTL to ensure fresh data
 */

interface CacheEntry {
  value: string;
  expiresAt: number;
}

class InMemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL: number = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Get cached value if it exists and hasn't expired
   */
  get(key: string): string | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set cache value with optional TTL (in milliseconds)
   */
  set(key: string, value: string, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired entries (periodic cleanup)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const chatCache = new InMemoryCache();

// Periodic cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    chatCache.cleanup();
  }, 10 * 60 * 1000);
}

/**
 * Generate cache key from normalized query
 */
export function generateCacheKey(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}
