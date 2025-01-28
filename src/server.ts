require('dotenv').config()
import Fastify from 'fastify'
import { Type } from '@sinclair/typebox'
import { normalizeUrl } from './utils/url'
import { redis, getCachedScreenshot, cacheScreenshot } from './services/redis'
import { screenshotter } from './services/screenshotter'


const server = Fastify({
  logger: true
})

// Modified screenshot capture logic with caching
async function handleScreenshot(url: string, reply: any) {
  console.log(url);
  server.log.info(`Capturing screenshot of ${url}`)
  try {
    const cached = await getCachedScreenshot(url)
    if (cached) {
      reply.header('Content-Type', 'image/png')
      return reply.send(cached)
    }

    const screenshot = await screenshotter.capture(url)
    await cacheScreenshot(url, screenshot)
    
    reply.header('Content-Type', 'image/png')
    reply.send(screenshot)
  } catch (error) {
    reply.code(500).send({
      error: 'Failed to capture screenshot',
      details: error
    })
  }
}

server.get('/s/*', async (request, reply) => {
  const url = request.url.substring(3);
  await handleScreenshot(normalizeUrl(url), reply)
})

// Root endpoint with usage instructions
server.get('/', async (request, reply) => {
  reply.type('text/html').send(`
    <html>
      <head>
        <title>Screenshotter</title>
        <style>
          body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
          code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Screenshotter</h1>
        <p>This API provides webpage screenshots in PNG format (1000px wide)</p>
        
        <h2>Endpoints:</h2>
        
        <code>GET /s/https://example.com</code>
        
        <h2>Examples:</h2>
        <ul>
          <li><a href="/s/https://github.com">Take screenshot of GitHub</a></li>
          <li><a href="/s/https://www.youtube.com/watch?v=dQw4w9WgXcQ">Youtube</a></li>
        </ul>
        
        <p>Note: URLs without http(s) prefix will be automatically normalized</p>
      </body>
    </html>
  `)
})

server.get('/i', async (request, reply) => {
  try {
    await redis.ping()
    reply.type('application/json').send({
      status: 'healthy',
      redis: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    reply.code(503)
    reply.type('application/json').send({
      status: 'unhealthy',
      redis: 'disconnected',
      timestamp: new Date().toISOString()
    })
  }
})

const PORT = parseInt(process.env.PORT || '3000')
const HOST = '0.0.0.0'

// Start server
const start = async () => {
  try {
    await server.listen({ 
      port: PORT,
      host: HOST
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start();

