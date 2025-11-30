import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ["lcov", "text", "html"],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/style/**/*'],
    },
  },
});
