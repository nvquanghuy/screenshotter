
import puppeteer from 'puppeteer'
import { normalizeUrl } from '../utils/url'

export class Screenshotter {
  private async getBrowser() {
    return puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: [
        '--no-sandbox',         // Disable Chrome's sandbox (common in Docker/CI)
        '--disable-setuid-sandbox',        
        '--disable-dev-shm-usage',  // Prevent /dev/shm temporary directory issues
        // '--disable-gpu',            // Disable GPU hardware acceleration
        // '--disable-extensions',     // Disable Chrome extensions
      ]
    })
  }

  async capture(url: string): Promise<Buffer> {
    const browser = await this.getBrowser()
    const page = await browser.newPage()
    
    await page.setViewport({
      width: 1000,
      height: 800
    })

    try {
      const normalizedUrl = normalizeUrl(url)
      await page.goto(normalizedUrl, {
        waitUntil: 'networkidle0'
      })

      const screenshot = await page.screenshot({
        type: 'png'
      })

      return Buffer.from(screenshot)
    } finally {
      await browser.close()
    }
  }
}

export const screenshotter = new Screenshotter()
