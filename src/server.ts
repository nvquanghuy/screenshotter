require('dotenv').config()
import Fastify from 'fastify'
import { Type } from '@sinclair/typebox'
import { normalizeUrl } from './utils'
import { redis, get as cacheGet, set as cacheSet } from './image_cache'
import { screenshotter } from './screenshotter'


const server = Fastify({
  logger: true
})

// Modified screenshot capture logic with caching
async function handleScreenshot(url: string, reply: any) {
  console.log(url);
  server.log.info(`Capturing screenshot of ${url}`)
  try {
    const cached = await cacheGet(url)
    if (cached) {
      reply.header('Content-Type', 'image/png')
      return reply.send(cached)
    }

    const screenshot = await screenshotter.capture(url)
    await cacheSet(url, screenshot)
    
    reply.header('Content-Type', 'image/png')
    reply.send(screenshot)
  } catch (error) {
    reply.code(500).send({
      error: 'Failed to capture screenshot',
      details: error
    })
  }
}

import { templateHome } from './template_home'

// Root endpoint with usage instructions
server.get('/', async (request, reply) => {
  reply.type('text/html').send(templateHome)
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


server.get('/*', async (request, reply) => {
  const url = request.url.substring(1);
  await handleScreenshot(normalizeUrl(url), reply)
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

