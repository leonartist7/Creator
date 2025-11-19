import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup/global-setup.ts'],
    include: ['tests/integration/**/*.test.ts'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    },
    testTimeout: 30000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
      '@backend': path.resolve(__dirname, './backend/src')
    }
  }
})
