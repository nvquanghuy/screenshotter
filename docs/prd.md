# Screenshotter PRD

## Requirements

Let's build a simple API to take website screenshots

- User pings the API with a website URL 
- API does behind the scene
  - Open URL in browser
  - Take screenshot
  - Return the image
  - Cache the image for limited time

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

## Web server

nginx should be used:
- To map port 80 to NodeJS app
- SSL termination

## API endpoints

### Home endpoint

Should return a simple landing page showing how to use the API.

### Screenshot endpoint

GET /s/https://somewebsite.com/path/to/page

Make sure it handles query string and hash of the URL variable. E.g It should handle `/s/https://site.com?a=1&b=2#cde` by including the entire string after '?'`.

The intention is for end users to just copy the URL and append it at the end of the app's URL.

Example:
https://screenshotter.com/s/https://site.com?a=1&b=2#cde

should capture screenshot of: https://site.com?a=1&b=2#cde


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

A number of deployment options are available.

### Ansible/Puppet

- Use Ansible/Puppet for deployment
- Notes:
  - When runnning deploy locally, make sure ssh agent is on
    - `eval $(ssh-agent)`
    - `ssh-add ~/.ssh/id_rsa`

### Docker

- Docker image
- One for app, one for Redis
- Use Docker Compose for orchestration
- Use GitHub Actions for CI/CD

### Vercel (serverless)

There should be a Vercel project for the app.

