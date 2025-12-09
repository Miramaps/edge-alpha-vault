import { query } from '../database/connection';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};

/**
 * Checks if identifier (IP or Discord user ID) has exceeded rate limit
 * Returns true if allowed, false if blocked
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);
  
  // Clean up old entries
  await query(
    'DELETE FROM rate_limits WHERE window_start < $1',
    [windowStart]
  );
  
  // Check if currently blocked
  const blockedCheck = await query(
    'SELECT blocked_until FROM rate_limits WHERE identifier = $1 AND endpoint = $2 AND blocked_until > NOW()',
    [identifier, endpoint]
  );
  
  if (blockedCheck.rows.length > 0) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: blockedCheck.rows[0].blocked_until,
    };
  }
  
  // Get current attempts in window
  const current = await query(
    `SELECT attempts, window_start 
     FROM rate_limits 
     WHERE identifier = $1 AND endpoint = $2 AND window_start > $3`,
    [identifier, endpoint, windowStart]
  );
  
  let attempts = 0;
  let existingWindowStart = windowStart;
  
  if (current.rows.length > 0) {
    attempts = current.rows[0].attempts;
    existingWindowStart = current.rows[0].window_start;
  }
  
  if (attempts >= config.maxRequests) {
    // Block for the remainder of the window
    const blockUntil = new Date(existingWindowStart.getTime() + config.windowMs);
    await query(
      `UPDATE rate_limits 
       SET attempts = attempts + 1, blocked_until = $1 
       WHERE identifier = $2 AND endpoint = $3`,
      [blockUntil, identifier, endpoint]
    );
    
    return {
      allowed: false,
      remaining: 0,
      resetAt: blockUntil,
    };
  }
  
  // Increment or create rate limit entry
  if (current.rows.length > 0) {
    await query(
      'UPDATE rate_limits SET attempts = attempts + 1 WHERE identifier = $1 AND endpoint = $2',
      [identifier, endpoint]
    );
  } else {
    await query(
      'INSERT INTO rate_limits (identifier, endpoint, attempts, window_start) VALUES ($1, $2, 1, NOW())',
      [identifier, endpoint]
    );
  }
  
  return {
    allowed: true,
    remaining: config.maxRequests - attempts - 1,
    resetAt: new Date(existingWindowStart.getTime() + config.windowMs),
  };
}

/**
 * Express middleware for rate limiting
 */
export function rateLimitMiddleware(endpoint: string) {
  return async (req: any, res: any, next: any) => {
    // Use IP address or Discord user ID if available
    const identifier = req.headers['x-discord-user-id'] || req.ip || 'unknown';
    
    const result = await checkRateLimit(identifier, endpoint);
    
    if (!result.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        resetAt: result.resetAt,
      });
    }
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', DEFAULT_CONFIG.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', Math.floor(result.resetAt.getTime() / 1000));
    
    next();
  };
}

