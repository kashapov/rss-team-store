import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/rss-team-store/',
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
