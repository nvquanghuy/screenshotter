
## Requirements

Let's build a simple API to take website screenshots

- User pings the API with a website URL 
- API does behind the scene
  - Open URL in browser
  - Take screenshot
  - Return the image

## Technical Stack

Please make it as simple as possible:
- NodeJS with Typescript
- Yarn for package manager
- Use Node v22 LTS
- Use Fastify as backend framework
- Puppeteer/Playwright for screenshots

## API Endpoints

Endpoint: 
GET /screenshot?url=https://somewebsite.com/path/to/page

Response: The screenshot image

The screenshot image should:
- Be a PNG
- Be 1000px wide
- Don't need to capture scroll
- Don't need to capture viewport
- Don't need to capture full page