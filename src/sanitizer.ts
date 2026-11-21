import type { WindowLike } from 'dompurify';
import type { JSDOM as JSDOMType } from 'jsdom';

import type { SafeMarkdown2HtmlOptions } from './types';

import DOMPurify from 'dompurify';

type NodeModule = typeof import('node:module');

/**
 * Load jsdom lazily without a static `require` or `node:module` import,
 * so the same build works in Node.js ESM, CJS, and browser bundles.
 */
const loadJsdom = (): { JSDOM: typeof JSDOMType } => {
  const nodeModule = globalThis.process?.getBuiltinModule?.('node:module') as
    NodeModule | undefined;
  if (!nodeModule) {
    throw new Error(
      'safe-markdown2html: no DOM window available. Pass the `window` option or run in Node.js with `jsdom` installed.',
    );
  }
  return nodeModule.createRequire(import.meta.url)('jsdom');
};

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
