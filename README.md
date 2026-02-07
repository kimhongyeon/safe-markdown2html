# safe-markdown2html

Convert Markdown to **sanitized HTML**. Safe by default — prevents XSS and fixes malformed markup.

[![CI](https://github.com/kimhongyeon/safe-markdown2html/actions/workflows/ci.yml/badge.svg)](https://github.com/kimhongyeon/safe-markdown2html/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/safe-markdown2html.svg)](https://www.npmjs.com/package/safe-markdown2html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **XSS Prevention** — HTML is sanitized via [DOMPurify](https://github.com/cure53/DOMPurify) after conversion
- **Markdown Parsing** — Powered by [marked](https://github.com/markedjs/marked)
- **Safe Links** — All `<a>` tags automatically get `target="_blank"`
- **Bold Syntax Fix** — Handles edge cases where `**bold**` with parentheses fails to parse
- **Malformed URL Correction** — Fixes URLs broken by parentheses (common in Korean text)
- **Strikethrough** — Standard `<del>` tags preserved by default, optional tilde conversion
- **Environment Aware** — Uses native DOM in browser, `jsdom` in Node.js (optional peer dependency)
- **Dual Build** — ESM and CommonJS both supported

## Install

```bash
npm install safe-markdown2html
```

For Node.js (server-side), also install `jsdom`:

```bash
npm install safe-markdown2html jsdom
```

In browser environments, `jsdom` is not needed — the native `window` object is used automatically.

## Usage

```ts
import { safeMarkdown2Html } from 'safe-markdown2html';

const html = safeMarkdown2Html('**Hello** [world](https://example.com)');
// <p><strong>Hello</strong> <a href="https://example.com" target="_blank">world</a></p>
```

Default import is also supported:

```ts
import safeMarkdown2Html from 'safe-markdown2html';
```

## Environment Support

| Environment | DOM Source | `jsdom` Required |
|---|---|---|
| Browser (React, Vue, etc.) | Native `window` | No |
| Node.js / SSR | `jsdom` | Yes |
| Custom | `window` option | No |

In the **browser**, the native `window` object is used automatically — no extra dependencies needed.

In **Node.js**, `jsdom` provides the DOM environment that DOMPurify needs. Install it as a peer dependency:

```bash
npm install jsdom
```

You can also pass a custom `window` object directly via the `window` option for full control.

## Options

All options are optional. Sensible defaults are applied.

```ts
safeMarkdown2Html(markdown, {
  linkTargetBlank: true,       // Add target="_blank" to links (default: true)
  fixMalformedUrls: true,      // Fix URLs broken by parentheses (default: true)
  fixBoldSyntax: true,         // Fix bold syntax with parentheses (default: true)
  convertStrikethrough: false, // Convert <del> to tilde ~ (default: false)
  window: customWindow,        // Custom window object for DOMPurify
});
```

| Option | Type | Default | Description |
|---|---|---|---|
| `linkTargetBlank` | `boolean` | `true` | Add `target="_blank"` to all anchor tags |
| `fixMalformedUrls` | `boolean` | `true` | Fix URLs broken by parentheses + non-ASCII characters |
| `fixBoldSyntax` | `boolean` | `true` | Fix `**bold**` syntax that fails with parentheses |
| `convertStrikethrough` | `boolean` | `false` | Convert `<del>` tags to tilde (`~`) notation |
| `window` | `object` | auto-detect | Window object for DOMPurify (browser: native, server: JSDOM) |

### Examples

#### Disable target="_blank"

```ts
safeMarkdown2Html('[link](https://example.com)', {
  linkTargetBlank: false,
});
```

#### Enable strikethrough conversion

```ts
safeMarkdown2Html('~~deleted text~~', {
  convertStrikethrough: true,
});
// <p>~deleted text~</p>
```

#### Custom window (testing / custom environments)

```ts
import { JSDOM } from 'jsdom';

safeMarkdown2Html('**hello**', {
  window: new JSDOM('').window,
});
```

## API

### `safeMarkdown2Html(markdown: string, options?: SafeMarkdown2HtmlOptions): string`

Converts a Markdown string to sanitized HTML.

**Pipeline:**

1. Preprocess bold syntax (`**text**` → `<strong>`) — if `fixBoldSyntax` enabled
2. Parse Markdown → HTML (via `marked`)
3. Sanitize HTML (via `DOMPurify`)
4. Fix malformed URLs — if `fixMalformedUrls` enabled
5. Add `target="_blank"` to all links — if `linkTargetBlank` enabled
6. Replace `<del>` tags with `~` — if `convertStrikethrough` enabled
7. Fix remaining unconverted bold syntax — if `fixBoldSyntax` enabled

## Development

```bash
npm install
npm test          # Run tests
npm run build     # Build (ESM + CJS + d.ts)
npm run lint      # Lint
npm run typecheck # Type check
```

## License

[MIT](./LICENSE)
