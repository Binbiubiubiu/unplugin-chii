// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    threads: false,
    maxThreads: 1,
    // minThreads: 0,
    // isolate: false,
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
