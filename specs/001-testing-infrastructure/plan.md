# Implementation Plan: Testing Infrastructure & TDD Workflow

**Branch**: `001-testing-infrastructure` | **Date**: 2025-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-testing-infrastructure/spec.md`

## Summary

Build comprehensive testing infrastructure for the Creative Mastery Platform to enforce Test-Driven Development (Article VII compliance). The system will support three test layers: unit tests with Vitest for fast feedback on individual functions, API tests with Supertest for backend endpoint verification, and end-to-end tests with Playwright for complete user workflows. All tests will run automatically in GitHub Actions CI pipeline with 80% code coverage enforcement, ensuring NON-NEGOTIABLE constitutional compliance is maintained.

## Technical Context

**Language/Version**: TypeScript 5.0+, Node.js 18+
**Primary Dependencies**:
- Vitest 1.0+ (unit & integration testing)
- Playwright 1.40+ (E2E testing)
- Supertest 6.3+ (API testing)
- @vitest/coverage-v8 (code coverage)
**Storage**: PostgreSQL (test database), In-memory SQLite (unit tests)
**Testing**: Vitest (unit), Supertest (API), Playwright (E2E)
**Target Platform**: Linux (CI), macOS/Windows (dev)
**Project Type**: Web (frontend + backend monorepo)
**Performance Goals**:
- Unit tests: <10s total execution
- API tests: <30s total execution
- E2E tests: <3min total execution
- Full suite: <5min in CI
**Constraints**:
- 80% minimum code coverage (constitutional requirement)
- Tests must be deterministic (no flaky tests)
- Isolated test environments (no cross-contamination)
**Scale/Scope**:
- ~50 unit test files (current codebase)
- ~15 API endpoint test suites
- ~10 E2E user workflow tests

## Constitution Check

*GATE: Must pass before implementation.*

### Article VII: Test-First Development (NON-NEGOTIABLE) ✅
- [ ] TDD workflow enforced (tests → fail → implement → pass)
- [ ] Tests written before implementation
- [ ] All code has corresponding tests
- [ ] Coverage meets 80% minimum threshold

**Status**: This feature DIRECTLY IMPLEMENTS Article VII compliance

### Article VI: Library-First Architecture ⚠️
- [X] Testing libraries are standalone and reusable
- [X] Test utilities can be extracted to shared packages
- [X] Infrastructure supports both monolithic and library-first code

**Status**: PASSING - Test infrastructure is modular

### Article IX: Integration-First Testing ✅
- [X] API tests use real database connections
- [X] Tests use actual services (not mocks except for external APIs)
- [X] Contract-based testing for modules

**Status**: PASSING - Integration tests prioritized

### Article X: Observability & Debugging ✅
- [X] Test reports include stack traces and context
- [X] Coverage reports highlight untested lines
- [X] CI logs provide detailed failure information

**Status**: PASSING - Full observability

## Project Structure

### Documentation (this feature)

```text
specs/001-testing-infrastructure/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Spec quality checklist (PASSED)
└── [contracts/ research.md data-model.md will be created during planning if needed]
```

### Source Code (repository root)

```text
Creator/
├── tests/                           # NEW - All test files
│   ├── unit/                        # Unit tests (Vitest)
│   │   ├── backend/
│   │   │   ├── services/
│   │   │   │   ├── openai.service.test.ts
│   │   │   │   └── anthropic.service.test.ts
│   │   │   ├── controllers/
│   │   │   │   ├── ai.controller.test.ts
│   │   │   │   └── project.controller.test.ts
│   │   │   └── utils/
│   │   │       └── validation.test.ts
│   │   └── frontend/
│   │       ├── components/
│   │       │   ├── Editor.test.tsx
│   │       │   └── CommandPalette.test.tsx
│   │       └── stores/
│   │           └── projectStore.test.ts
│   ├── integration/                 # API tests (Supertest)
│   │   ├── api/
│   │   │   ├── auth.api.test.ts
│   │   │   ├── projects.api.test.ts
│   │   │   ├── ai.api.test.ts
│   │   │   └── export.api.test.ts
│   │   └── setup/
│   │       ├── test-server.ts       # Test server setup
│   │       └── db-setup.ts          # Database test utilities
│   ├── e2e/                         # E2E tests (Playwright)
│   │   ├── specs/
│   │   │   ├── project-creation.spec.ts
│   │   │   ├── ai-generation.spec.ts
│   │   │   ├── content-editing.spec.ts
│   │   │   └── export-workflow.spec.ts
│   │   ├── fixtures/
│   │   │   └── test-data.ts         # Shared test data
│   │   └── utils/
│   │       └── page-objects/        # Page object models
│   ├── fixtures/                    # Shared test data
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   ├── ai-responses.ts          # Mock AI responses
│   │   └── masterworks.ts
│   └── setup/                       # Global test setup
│       ├── vitest.config.ts         # Vitest configuration
│       ├── playwright.config.ts     # Playwright configuration
│       └── global-setup.ts          # Shared setup logic
├── .github/
│   └── workflows/
│       ├── test.yml                 # NEW - CI test workflow
│       └── coverage.yml             # NEW - Coverage reporting
├── vitest.config.ts                 # NEW - Root Vitest config
├── playwright.config.ts             # NEW - Root Playwright config
├── package.json                     # UPDATED - Add test scripts
├── backend/
│   ├── src/                         # Existing code (will add tests)
│   └── package.json                 # UPDATED - Test dependencies
└── frontend/
    ├── src/                         # Existing code (will add tests)
    └── package.json                 # UPDATED - Test dependencies
```

**Structure Decision**: Centralized `tests/` directory at repository root with subdirectories for unit, integration, and E2E tests. This provides clear separation of test types and makes it easy to run specific test suites. Aligns with monorepo structure while preparing for future library extraction.

## Complexity Tracking

> **No constitutional violations requiring justification.**

This implementation follows all constitutional principles:
- Test-First enforced (Article VII)
- Libraries are modular and testable (Article VI)
- Integration testing prioritized (Article IX)
- Full observability (Article X)
- Simplicity maintained - using standard tools without custom abstractions (Article IX)

---

## Phase 0: Research & Tool Selection

### Selected Tools Rationale

#### Vitest (Unit & Integration Testing)
**Why**: Native TypeScript support, Vite-compatible, fastest test runner for our stack
- 5-10x faster than Jest for TypeScript projects
- Built-in coverage with v8
- Watch mode for instant feedback
- Compatible with existing Vite build

#### Playwright (E2E Testing)
**Why**: Most reliable cross-browser testing, excellent debugging tools
- Auto-wait mechanisms reduce flaky tests
- Built-in screenshots/videos on failure
- Codegen for easy test creation
- Parallel execution support

#### Supertest (API Testing)
**Why**: Industry standard for Express API testing, integrates with Vitest
- Fluent API for HTTP assertions
- Works with real Express app instance
- Supports async/await patterns
- Compatible with any test framework

#### GitHub Actions (CI/CD)
**Why**: Already integrated with repository, free for open source
- Native GitHub integration
- Matrix builds for multiple Node versions
- Artifact storage for coverage reports
- PR status checks built-in

### Rejected Alternatives

- **Jest**: Slower than Vitest for TypeScript, configuration overhead
- **Cypress**: Heavier than Playwright, slower execution, less reliable auto-waiting
- **Mocha/Chai**: Requires more configuration than Vitest, slower
- **CircleCI/Travis**: Additional service, GitHub Actions sufficient

---

## Phase 1: Core Implementation

### 1.1 Vitest Setup (Unit Tests)

**Goal**: Fast unit test execution with coverage

**Configuration** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup/global-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/dist/',
        '**/*.config.ts'
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
```

**Package Scripts** (`package.json`):
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### 1.2 Supertest Setup (API Tests)

**Goal**: Test all backend API endpoints with real requests

**Test Server Setup** (`tests/integration/setup/test-server.ts`):
```typescript
import express from 'express'
import { setupRoutes } from '@backend/index'
import { setupTestDatabase } from './db-setup'

export async function createTestServer() {
  const app = express()

  // Setup routes
  setupRoutes(app)

  // Setup test database
  await setupTestDatabase()

  return app
}
```

**Example API Test** (`tests/integration/api/projects.api.test.ts`):
```typescript
import request from 'supertest'
import { createTestServer } from '../setup/test-server'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Projects API', () => {
  let app: Express

  beforeAll(async () => {
    app = await createTestServer()
  })

  it('POST /api/projects - creates new project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({ name: 'Test Project', type: 'ebook' })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Test Project')
  })

  it('GET /api/projects/:id - returns 404 for non-existent', async () => {
    await request(app)
      .get('/api/projects/99999')
      .expect(404)
  })
})
```

### 1.3 Playwright Setup (E2E Tests)

**Goal**: Test complete user workflows through UI

**Configuration** (`playwright.config.ts`):
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

**Example E2E Test** (`tests/e2e/specs/project-creation.spec.ts`):
```typescript
import { test, expect } from '@playwright/test'

test.describe('Project Creation Workflow', () => {
  test('user can create a new ebook project', async ({ page }) => {
    await page.goto('/')

    // Click create project
    await page.click('button:has-text("New Project")')

    // Fill project form
    await page.fill('input[name="name"]', 'My First Ebook')
    await page.selectOption('select[name="type"]', 'ebook')
    await page.click('button:has-text("Create")')

    // Verify redirect to editor
    await expect(page).toHaveURL(/\/editor\/[a-z0-9-]+/)
    await expect(page.locator('h1')).toContainText('My First Ebook')
  })
})
```

### 1.4 GitHub Actions CI Pipeline

**Goal**: Automated testing on every commit

**Workflow** (`.github/workflows/test.yml`):
```yaml
name: Tests

on:
  push:
    branches: [main, 'feature/*', '0*-*']
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Run API tests
        run: npm run test:integration

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true

      - name: Check coverage thresholds
        run: npm run test:coverage -- --run
        env:
          COVERAGE_THRESHOLD: 80

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 1.5 Test Fixtures & Mocks

**Goal**: Reusable test data and AI service mocks

**Fixtures** (`tests/fixtures/projects.ts`):
```typescript
export const testProjects = {
  ebook: {
    id: 'test-ebook-1',
    name: 'Sample Ebook',
    type: 'ebook',
    content: { chapters: [] },
    createdAt: new Date('2025-01-01')
  },
  course: {
    id: 'test-course-1',
    name: 'Sample Course',
    type: 'course',
    content: { modules: [] },
    createdAt: new Date('2025-01-01')
  }
}
```

**AI Mocks** (`tests/fixtures/ai-responses.ts`):
```typescript
export const mockAIResponses = {
  generateOutline: {
    chapters: [
      { title: 'Introduction', summary: 'Overview of the topic' },
      { title: 'Core Concepts', summary: 'Main ideas explained' },
      { title: 'Conclusion', summary: 'Final thoughts' }
    ]
  },
  improveText: {
    original: 'This is a test.',
    improved: 'This is a well-crafted test sentence.'
  }
}

// Mock OpenAI during tests
export function mockOpenAI() {
  vi.mock('@backend/services/openai.service', () => ({
    generateCompletion: vi.fn().mockResolvedValue(mockAIResponses.improveText)
  }))
}
```

---

## Phase 2: Test Coverage for Existing Code

### 2.1 Backend Test Coverage

**Priority Order**:
1. **P1**: Services (OpenAI, Anthropic, Analytics) - core business logic
2. **P1**: Controllers (AI, Projects, Export) - API endpoint handlers
3. **P2**: Routes - HTTP layer
4. **P3**: Utilities & middleware

**Example Service Test** (`tests/unit/backend/services/openai.service.test.ts`):
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OpenAIService } from '@backend/services/openai.service'

describe('OpenAIService', () => {
  let service: OpenAIService

  beforeEach(() => {
    service = new OpenAIService('test-api-key')
  })

  it('generates completion with correct parameters', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ choices: [{ text: 'Generated text' }] })
    })
    global.fetch = mockFetch

    const result = await service.generateCompletion('Test prompt')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('openai.com'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key'
        })
      })
    )
    expect(result).toBe('Generated text')
  })

  it('handles API errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(service.generateCompletion('Test')).rejects.toThrow()
  })
})
```

### 2.2 Frontend Test Coverage

**Priority Order**:
1. **P1**: Complex components (Editor, CommandPalette, AI Tools)
2. **P2**: Stores & state management
3. **P3**: Simple UI components (Button, Card, Modal)

**Example Component Test** (`tests/unit/frontend/components/Editor.test.tsx`):
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Editor } from '@/components/Editor/RichTextEditor'

describe('RichTextEditor', () => {
  it('renders with initial content', () => {
    render(<Editor initialContent="Test content" />)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('triggers onChange when content is edited', async () => {
    const onChange = vi.fn()
    render(<Editor onChange={onChange} />)

    const editor = screen.getByRole('textbox')
    await fireEvent.input(editor, { target: { value: 'New text' } })

    expect(onChange).toHaveBeenCalledWith('New text')
  })
})
```

---

## Phase 3: TDD Workflow Documentation

### 3.1 Developer Documentation

**File**: `docs/TESTING.md` (to be created)

**Contents**:
- TDD workflow overview (Red-Green-Refactor)
- Running tests locally (commands, watch mode)
- Writing unit tests (examples, best practices)
- Writing API tests (Supertest examples)
- Writing E2E tests (Playwright examples)
- Debugging failing tests
- Coverage reports interpretation
- CI/CD pipeline overview

### 3.2 TDD Enforcement

**Pre-commit Hook** (`.husky/pre-commit`):
```bash
#!/bin/sh
npm run test -- --run --changed
```

**PR Template** (`.github/pull_request_template.md`):
```markdown
## Checklist

- [ ] Tests written BEFORE implementation
- [ ] All tests passing locally
- [ ] Coverage at or above 80%
- [ ] Tests fail when implementation is removed (Red phase verified)
```

---

## Phase 4: Performance Optimization

### 4.1 Test Parallelization

- Unit tests: Run in parallel by default (Vitest threads)
- API tests: Run sequentially per file, parallel files
- E2E tests: Run 1 worker in CI, parallel in local dev

### 4.2 Test Database Optimization

**Strategy**: Use transactions for isolation
```typescript
// tests/integration/setup/db-setup.ts
beforeEach(async () => {
  await db.query('BEGIN')
})

afterEach(async () => {
  await db.query('ROLLBACK')
})
```

### 4.3 Coverage Collection Optimization

- Use v8 provider (faster than Istanbul)
- Exclude test files and config from coverage
- Run coverage only in CI, not watch mode

---

## Success Metrics Tracking

### Automated Metrics

- **Coverage**: Tracked via Codecov, visible in PR checks
- **Test Execution Time**: Logged in CI, tracked over time
- **Flaky Test Rate**: GitHub Actions retry count tracking
- **PR Block Rate**: GitHub branch protection enforces 80% coverage

### Manual Metrics

- **Developer Confidence**: Survey after Phase 0 (target: 90%+ confidence)
- **Time to First Test**: Measure onboarding (target: <30 min)
- **TDD Adoption**: Code review checklist compliance (target: 100%)

---

## Dependencies Installation

**Root** (`package.json`):
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "playwright": "^1.40.0",
    "@playwright/test": "^1.40.0",
    "supertest": "^6.3.3",
    "@types/supertest": "^6.0.2",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^23.0.0"
  }
}
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flaky E2E tests | High | Use Playwright auto-wait, retry logic, stable selectors |
| Slow test execution | Medium | Parallelize, optimize database setup, cache dependencies |
| Coverage false positives | Medium | Use integration tests, manual code review |
| Developer resistance to TDD | High | Training, documentation, gradual adoption with pair programming |
| CI pipeline instability | Medium | Use GitHub-hosted runners, add retry logic, monitor uptime |

---

## Next Steps

After this plan is approved:

1. **`/speckit.tasks`**: Generate detailed task breakdown
2. **`/speckit.implement`**: Execute tasks following TDD:
   - Write test infrastructure setup
   - Write tests for infrastructure
   - Implement infrastructure to make tests pass
   - Write tests for existing code
   - Refactor existing code to pass tests

---

**Constitutional Compliance**: ✅ This implementation directly addresses Article VII (Test-First Development), bringing constitutional compliance from 30% to 70%+ upon completion.
