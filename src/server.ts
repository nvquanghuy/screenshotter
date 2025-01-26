import Fastify from 'fastify'
import puppeteer from 'puppeteer'
import { Type } from '@sinclair/typebox'
import { normalizeUrl } from './utils/url'
import { getCachedScreenshot, cacheScreenshot } from './services/redis'

const server = Fastify({
  logger: true
})

// Query schema for /s?url= endpoint
const QuerySchema = Type.Object({
  url: Type.String({ format: 'uri' })
})

// Params schema for /s/:url endpoint
const ParamsSchema = Type.Object({
  '*': Type.String()
})

// Shared screenshot capture logic
async function captureScreenshot(url: string) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.setViewport({
    width: 1000,
    height: 800
  })

  try {
    const normalizedUrl = normalizeUrl(url)
    await page.goto(normalizedUrl, {
      waitUntil: 'networkidle0'
    })

    const screenshot = await page.screenshot({
      type: 'png'
    })

    // Convert Uint8Array to Buffer
    return Buffer.from(screenshot)
  } finally {
    await browser.close()
  }
}

// Modified screenshot capture logic with caching
async function handleScreenshot(url: string, reply: any) {
  try {
    const normalizedUrl = normalizeUrl(url)
    
    // Check cache first
    const cached = await getCachedScreenshot(normalizedUrl)
    if (cached) {
      reply.header('Content-Type', 'image/png')
      return reply.send(cached)
    }

    // If not cached, generate new screenshot
    const screenshot = await captureScreenshot(normalizedUrl)
    
    // Cache the new screenshot
    await cacheScreenshot(normalizedUrl, screenshot)
    
    reply.header('Content-Type', 'image/png')
    reply.send(screenshot)
  } catch (error) {
    reply.code(500).send({ error: 'Failed to capture screenshot' })
  }
}
// Route 1: /s?url=
server.get('/s', {
  schema: {
    querystring: QuerySchema
  }
}, async (request, reply) => {
  const { url } = request.query as { url: string }
  await handleScreenshot(url, reply)
})

// Route 2: /s/:url
server.get('/s/*', {
  schema: {
    params: ParamsSchema
  }
}, async (request, reply) => {
  const { '*': url } = request.params as { '*': string }
  await handleScreenshot(url, reply)
})

// Start server
const start = async () => {
  try {
    await server.listen({ port: 3000 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()