# Screenshot API

Simple API service that takes screenshots of websites.

## Features

- Takes screenshots of any public website
- Returns PNG images at 1000px width
- Built with Node.js, TypeScript, and Fastify
- Uses Playwright for reliable web screenshots

## Prerequisites

- Node.js v22 LTS
- Yarn package manager

## Setup

1. Install dependencies:
```bash
yarn install

2. Start the development server:
```bash
yarn dev

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

## Development

Build the project:
```bash
yarn build
```

Run tests:
```bash
yarn test
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

