import Redis from 'ioredis'

export const redis = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379')

const CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds

export async function cacheConnected() {
  try {
    await redis.ping()
    return true;
  } catch (error) {
    return false;
  }
}

export async function get(url: string): Promise<Buffer | null> {
  try {
    const cached = await redis.getBuffer(url)
    return cached
  } catch (error) {
    console.error("Error getting cached screenshot for " + url, error)
    return null
  }
}

export async function set(url: string, screenshot: Buffer): Promise<void> {
  await redis.set(url, screenshot, 'EX', CACHE_TTL)
}
