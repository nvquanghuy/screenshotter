import { normalizeUrl } from '../utils'

describe('URL Utilities', () => {
  test('normalizeUrl adds https:// to URLs without protocol', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com')
  })

  test('normalizeUrl keeps existing http:// protocol', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com')
  })

  test('normalizeUrl keeps existing https:// protocol', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com')
  })

  test('normalizeUrl handles URLs with paths', () => {
    expect(normalizeUrl('example.com/path/to/page'))
      .toBe('https://example.com/path/to/page')
  })
})
