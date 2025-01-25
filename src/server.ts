import Fastify from 'fastify'
import puppeteer from 'puppeteer'
import { Type } from '@sinclair/typebox'


const server = Fastify({
  logger: true
})

// Query schema
const QuerySchema = Type.Object({
  url: Type.String({ format: 'uri' })
})

server.get('/screenshot', {
  schema: {
    querystring: QuerySchema
  }
}, async (request, reply) => {
  const { url } = request.query as { url: string }

  // Launch browser
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Set viewport width
  await page.setViewport({
    width: 1000,
    height: 800
  })

  try {
    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'networkidle0'
    })

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png'
    })

    // Set response headers
    reply.header('Content-Type', 'image/png')
    reply.send(screenshot)

  } catch (error) {
    reply.code(500).send({ error: 'Failed to capture screenshot' })
  } finally {
    await browser.close()
  }
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
