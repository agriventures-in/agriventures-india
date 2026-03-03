/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window per IP. Suitable for single-instance deployments.
 * For multi-instance / edge, swap to @upstash/ratelimit.
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Clean up stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  const cutoff = now - windowMs
  const keys = Array.from(store.keys())
  for (const key of keys) {
    const entry = store.get(key)!
    entry.timestamps = entry.timestamps.filter((t: number) => t > cutoff)
    if (entry.timestamps.length === 0) {
      store.delete(key)
    }
  }
}

/**
 * Check whether a request from `ip` should be rate-limited.
 * @param ip       – client IP (from x-forwarded-for or x-real-ip)
 * @param maxReqs  – max requests allowed in the window (default 10)
 * @param windowMs – window size in ms (default 60 000 = 1 minute)
 * @returns `{ limited: false }` or `{ limited: true, retryAfterMs }`
 */
export function rateLimit(
  ip: string,
  maxReqs = 10,
  windowMs = 60_000
): { limited: false } | { limited: true; retryAfterMs: number } {
  const now = Date.now()
  cleanup(windowMs)

  const entry = store.get(ip) ?? { timestamps: [] }
  // Purge timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > now - windowMs)

  if (entry.timestamps.length >= maxReqs) {
    const oldest = entry.timestamps[0]
    const retryAfterMs = oldest + windowMs - now
    return { limited: true, retryAfterMs }
  }

  entry.timestamps.push(now)
  store.set(ip, entry)
  return { limited: false }
}

/**
 * Extract the client IP from request headers.
 * Works with Vercel, Cloudflare, and most reverse-proxies.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}
