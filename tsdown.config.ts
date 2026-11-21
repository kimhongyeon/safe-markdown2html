import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // Same ESM file serves Node.js and browsers, so no Node-only shims at top level.
  platform: 'neutral',
  target: 'es2022',
  tsconfig: './tsconfig.build.json',
  dts: true,
  sourcemap: true,
  clean: true,
  // import.meta.url (used to resolve jsdom) needs a shim in the CJS build.
  shims: true,
  outputOptions: {
    exports: 'named',
  },
});
