import Redis from 'ioredis'

export const redis = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379')

const CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds

export async function getCachedScreenshot(url: string): Promise<Buffer | null> {
  const cached = await redis.getBuffer(url)
  return cached
}

export async function cacheScreenshot(url: string, screenshot: Buffer): Promise<void> {
  await redis.set(url, screenshot, 'EX', CACHE_TTL)
}
