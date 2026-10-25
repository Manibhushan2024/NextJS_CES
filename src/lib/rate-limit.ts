// Per-process protection only. Use a shared store before running multiple instances.
const store = new Map<string, { count: number; resetTime: number }>()
function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}
const REQUESTS = positiveInteger(process.env.RATE_LIMIT_REQUESTS, 5)
const WINDOW_MS = positiveInteger(process.env.RATE_LIMIT_WINDOW_MS, 3600000)

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  for (const [key, record] of store) {
    if (record.resetTime <= now) store.delete(key)
  }
  const record = store.get(ip)
  if (!record) {
    if (store.size >= 10000) return false
    store.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return true
  }
  if (record.count >= REQUESTS) return false
  record.count++
  return true
}
export function getRateLimitInfo(ip: string) {
  const record = store.get(ip)
  return {
    remaining: Math.max(0, REQUESTS - (record?.count || 0)),
    resetTime: record?.resetTime || Date.now() + WINDOW_MS,
  }
}
