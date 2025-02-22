# Screenshot API

Simple API service that takes screenshots of websites.

## Features

- Takes screenshots of any public website
- Returns PNG images at 1000px width
- Built with Node.js, TypeScript, and Fastify
- Uses Playwright for reliable web screenshots

## TODOs

- [x] Add caching of screenshots based on URL
- [ ] Rate limits
- [ ] Concurrent request handling

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

3. Make sure you have Redis running locally. Either in Docker or not.

```
docker run --name redis -p 6379:6379 -d redis
# or
redis-server

```

4. Start the development server:

```bash
yarn dev
```

5. Visit local app: [http://localhost:3000](http://localhost:3000)


## API Usage

Send a GET request to take a screenshot:

```bash
curl "http://localhost:3000/https://example.com"
```

The API will return a PNG image of the requested website.

Example using fetch:

```javascript
const response = await fetch('http://localhost:3000/https://example.com');
const screenshot = await response.blob();
```

## Deployment

Deploy using Ansible:

```bash
./deploy/deploy_ansible
```