import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
})

const CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds

export async function getCachedScreenshot(url: string): Promise<Buffer | null> {
  const cached = await redis.getBuffer(url)
  return cached
}

export async function cacheScreenshot(url: string, screenshot: Buffer): Promise<void> {
  await redis.set(url, screenshot, 'EX', CACHE_TTL)
}
