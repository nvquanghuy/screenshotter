# Screenshot API

Simple API service that takes screenshots of websites.

## Features

- Takes screenshots of any public website
- Returns PNG images at 1000px width
- Built with Node.js, TypeScript, and Fastify
- Uses Playwright for reliable web screenshots

## TODOs

- [ ] Add caching of image
- [ ] Rate limits
- [ ] Concurrent request handling
- [ ] Security (malicious URLs, resource limits)


## Prerequisites

- Node.js v22 LTS
- Yarn package manager
- Redis

## Setup

1. Install dependencies

```bash
yarn install
```

2. Configure `.env`

```
cp .env.sample .env
```

3. Start Redis (if not already running):

```
docker run --name redis -p 6379:6379 -d redis
```

4. Start the development server:

```bash
yarn dev
```

## API Usage

Send a GET request to take a screenshot:

```bash
curl "http://localhost:3000/screenshot?url=https://example.com"
```

The API will return a PNG image of the requested website.

Example using fetch:

```javascript
const response = await fetch('http://localhost:3000/screenshot?url=https://example.com');
const screenshot = await response.blob();
```
