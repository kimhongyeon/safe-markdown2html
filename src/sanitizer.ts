import type { WindowLike } from 'dompurify';
import type { JSDOM as JSDOMType } from 'jsdom';

import type { SafeMarkdown2HtmlOptions } from './types';

import DOMPurify from 'dompurify';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const loadJsdom = () => require('jsdom') as { JSDOM: typeof JSDOMType };

export function getWindow(options?: SafeMarkdown2HtmlOptions): WindowLike {
  if (options?.window) return options.window as WindowLike;
  if (typeof globalThis.window !== 'undefined')
    return globalThis.window as unknown as WindowLike;
  const { JSDOM } = loadJsdom();
  return new JSDOM('').window as unknown as WindowLike;
}

export function sanitize(html: string, window: WindowLike): string {
  const purify = DOMPurify(window);
  return purify.sanitize(html);
}
