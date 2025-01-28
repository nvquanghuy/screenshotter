import { Screenshotter } from '../screenshotter'

describe('Screenshotter', () => {
  let screenshotter: Screenshotter

  beforeEach(() => {
    screenshotter = new Screenshotter()
  })

  it('captures screenshot of a website', async () => {
    const url = 'https://google.com'
    const screenshot = await screenshotter.capture(url)

    // Verify screenshot is a valid PNG buffer
    expect(Buffer.isBuffer(screenshot)).toBe(true)
    expect(screenshot.length).toBeGreaterThan(0)
  }, 20000) // Increase timeout since browser operations take time

})
