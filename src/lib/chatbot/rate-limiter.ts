/**
 * Session-based rate limiter
 * Limits: 20 messages per hour per session
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class SessionRateLimiter {
  private sessions: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number = 20;
  private windowMs: number = 60 * 60 * 1000; // 1 hour

  /**
   * Check if request is allowed for this session
   * Returns { allowed: boolean, remaining: number, resetIn: number }
   */
  checkLimit(sessionId: string): {
    allowed: boolean;
    remaining: number;
    resetIn: number;
  } {
    const now = Date.now();
    const entry = this.sessions.get(sessionId);

    // No entry or expired window - allow and create new entry
    if (!entry || now > entry.resetAt) {
      this.sessions.set(sessionId, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetIn: this.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: entry.resetAt - now,
      };
    }

    // Increment count
    entry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetIn: entry.resetAt - now,
    };
  }

  /**
   * Reset limit for a session (useful for testing or admin actions)
   */
  reset(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Clean up expired sessions
   */
  cleanup(): void {
    const now = Date.now();
    for (const [sessionId, entry] of this.sessions.entries()) {
      if (now > entry.resetAt) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Get current stats for a session
   */
  getStats(sessionId: string): { used: number; limit: number; resetAt: number } | null {
    const entry = this.sessions.get(sessionId);
    if (!entry || Date.now() > entry.resetAt) {
      return null;
    }
    return {
      used: entry.count,
      limit: this.maxRequests,
      resetAt: entry.resetAt,
    };
  }
}

// Singleton instance
export const rateLimiter = new SessionRateLimiter();

// Periodic cleanup every 15 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 15 * 60 * 1000);
}

/**
 * Validate query length (max 25 words)
 */
export function validateQueryLength(query: string): {
  valid: boolean;
  wordCount: number;
  maxWords: number;
} {
  const words = query.trim().split(/\s+/).filter(w => w.length > 0);
  const maxWords = 25;

  return {
    valid: words.length <= maxWords,
    wordCount: words.length,
    maxWords,
  };
}
