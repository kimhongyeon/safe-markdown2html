import { JSDOM } from 'jsdom';

import { getWindow, sanitize } from './sanitizer';

describe('getWindow', () => {
  test('should use provided window option', () => {
    const customWindow = new JSDOM('').window;
    const result = getWindow({ window: customWindow });

    expect(result).toBe(customWindow);
  });

  test('should fall back to JSDOM in server environment', () => {
    const result = getWindow();

    expect(result).toBeDefined();
  });

  test('should use globalThis.window when available (browser environment)', () => {
    const fakeWindow = new JSDOM('').window;
    const original = globalThis.window;

    // Simulate browser environment
    // @ts-expect-error simulate browser globalThis.window
    globalThis.window = fakeWindow;

    try {
      const result = getWindow();
      expect(result).toBe(fakeWindow);
    } finally {
      if (original === undefined) {
        // @ts-expect-error restore original undefined state
        delete globalThis.window;
      } else {
        globalThis.window = original;
      }
    }
  });
});

describe('sanitize', () => {
  test('should remove script tags', () => {
    const window = new JSDOM('').window;
    const result = sanitize('<script>alert("xss")</script><p>safe</p>', window);

    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>safe</p>');
  });

  test('should keep safe HTML', () => {
    const window = new JSDOM('').window;
    const result = sanitize('<p><strong>bold</strong></p>', window);

    expect(result).toBe('<p><strong>bold</strong></p>');
  });
});
