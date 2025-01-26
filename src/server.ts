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

// Root endpoint with usage instructions
server.get('/', async (request, reply) => {
  reply.type('text/html').send(`
    <html>
      <head>
        <title>Screenshot API Usage</title>
        <style>
          body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
          code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Screenshot API Usage</h1>
        <p>This API provides webpage screenshots in PNG format (1000px wide)</p>
        
        <h2>Endpoints:</h2>
        <h3>1. Using Query Parameter</h3>
        <code>GET /s?url=https://example.com</code>
        
        <h3>2. Using URL Path</h3>
        <code>GET /s/https://example.com</code>
        
        <h2>Examples:</h2>
        <ul>
          <li><a href="/s?url=https://google.com">Take screenshot of Google</a></li>
          <li><a href="/s/https://github.com">Take screenshot of GitHub</a></li>
        </ul>
        
        <p>Note: URLs without http(s) prefix will be automatically normalized</p>
      </body>
    </html>
  `)
})

start()
