import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/detect-console-log.ts'],
  target: 'node14',
  format: ['cjs'],
  clean: true,
  dts: false,
});
