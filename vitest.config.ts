import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/global-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/dist/',
        '**/*.config.ts',
        '**/coverage/',
        'spec-kit-main/',
        'legacy-docs/',
        '.specify/'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
      '@backend': path.resolve(__dirname, './backend/src')
    }
  }
})
