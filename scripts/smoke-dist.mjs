// Smoke-test the built package in plain Node.js (no `window` option),
// through both the ESM and CJS entry points, resolved via package exports.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const input = '**bold** [link](https://example.com) <script>alert(1)</script>';

const esm = await import('safe-markdown2html');
const cjs = require('safe-markdown2html');

for (const [name, mod] of [
  ['esm', esm],
  ['cjs', cjs],
]) {
  assert.equal(mod.default, mod.safeMarkdown2Html, `${name}: default export`);
  const html = mod.safeMarkdown2Html(input);
  assert.match(html, /<strong>bold<\/strong>/, `${name}: markdown`);
  assert.match(html, /target="_blank"/, `${name}: link target`);
  assert.doesNotMatch(html, /<script/, `${name}: sanitized`);
  console.log(`${name}: ok`);
}
