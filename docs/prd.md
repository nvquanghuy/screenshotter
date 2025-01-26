
## Requirements

Let's build a simple API to take website screenshots

- User pings the API with a website URL 
- API does behind the scene
  - Open URL in browser
  - Take screenshot
  - Return the image

## Technical stack

When picking technology, consider make it as simple as possible to the requirements. Don't over-engineer unless necessary.

Recommended stack:
- NodeJS with Typescript
- Yarn for package manager
- Node v22 LTS
- Fastify as backend framework
- Puppeteer/Playwright for screenshots

There should be proper unit tests.
Code should be maintainable, readable and testable.

## API endpoints

Endpoint: Should support 2 endpoints

- The formal one: GET /s?url=https://somewebsite.com/path/to/page
- Shortcut one: GET /s/https://somewebsite.com/path/to/page

Response: The screenshot image

Should work well even when URL doesn't have prefix http(s).

The screenshot image should:
- Be a PNG
- Be 1000px wide
- Don't need to capture scroll
- Don't need to capture viewport
- Don't need to capture full page

## Image storage and caching

Mechanism:
- Once generated, the image should be stored somewhere.
- If the same URL is requested again, the image should be retrieved from storage instead of generating it again.
- The image should have a TTL (time to live) and should be removed from storage once expired.

Technical:
- Use Redis for storing the image.
- Use Redis TTL for image expiration.

## Deployment

Currently it's stateless. Data is ephermeral.

How should we do deployment?
- Serverless
  - Either AWS or GCP
  - Use database service separately
- Docker
