const puppeteer = require('puppeteer');

async function run() {
  console.log('Starting Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // '--disable-dev-shm-usage'
    ]
  });

  try {
    console.log('Opening new page...');
    const page = await browser.newPage();

    console.log('Navigating to Example...');
    await page.goto('https://example.com');
    console.log('Getting page title...');
    const title = await page.title();
    console.log('Page title:', title);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);