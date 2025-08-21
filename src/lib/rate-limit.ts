// Simple in-memory rate limiter per IP and route key
// Note: Suitable for single-instance dev/prod. For distributed setups, replace with Redis.

export type RateLimitOptions = {
  limit: number // max requests
  windowMs: number // time window in ms
  key?: string // optional route key to separate buckets
}

const buckets = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: Request): string {
  try {
    const headers = (req as any).headers as Headers
    const xff = headers.get('x-forwarded-for')
    if (xff) return xff.split(',')[0].trim()
    const realIp = headers.get('x-real-ip')
    if (realIp) return realIp
  } catch {}
  // Fallback: not reliable but deterministic per process
  return 'unknown'
}

export function rateLimit(req: Request, opts: RateLimitOptions) {
  const ip = getClientIp(req)
  const key = `${opts.key || 'default'}:${ip}`
  const now = Date.now()

  // Opportunistically clean up a few expired buckets to limit growth
  // This runs cheaply on calls and avoids a separate timer.
  let cleaned = 0
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) {
      buckets.delete(k)
      if (++cleaned >= 5) break // cap per-call cleanup
    }
  }

  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { allowed: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs }
  }

  if (bucket.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt }
  }

  bucket.count += 1
  return { allowed: true, remaining: opts.limit - bucket.count, resetAt: bucket.resetAt }
}
