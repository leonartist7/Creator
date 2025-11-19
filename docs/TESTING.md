# Testing Guide

## Overview

This project follows **Test-Driven Development (TDD)** as mandated by Article VII of our Constitution. All code must be tested before implementation, and we maintain a minimum of 80% code coverage across the codebase.

## Testing Stack

- **Unit & Integration Tests**: [Vitest](https://vitest.dev/) v4.0.10
- **E2E Tests**: [Playwright](https://playwright.dev/) v1.56.1
- **API Tests**: [Supertest](https://github.com/ladjs/supertest) v7.1.4
- **Coverage**: V8 coverage provider with 80% minimum threshold

## Project Structure

```
tests/
├── unit/                        # Unit tests (fast, isolated)
│   ├── infrastructure/          # Testing infrastructure tests
│   ├── services/                # Backend service tests
│   ├── controllers/             # Backend controller tests
│   └── components/              # Frontend component tests
├── integration/                 # Integration tests (real dependencies)
│   ├── api/                     # API endpoint tests
│   └── setup/                   # Test server and setup
├── e2e/                         # End-to-end tests (full workflows)
│   └── specs/                   # E2E test specifications
├── fixtures/                    # Shared test data
│   ├── users.ts                 # Mock user data
│   ├── projects.ts              # Mock project data
│   └── ai-responses.ts          # Mock AI responses
└── setup/                       # Global test configuration
    └── global-setup.ts          # Vitest global setup
```

## Running Tests

### All Tests
```bash
npm test                   # Run all unit tests once
npm run test:watch         # Run unit tests in watch mode
npm run test:coverage      # Run with coverage report
npm run test:ui            # Open Vitest UI
```

### Integration Tests
```bash
npm run test:integration   # Run API integration tests
```

### E2E Tests
```bash
npm run test:e2e          # Run Playwright E2E tests
npm run test:e2e:ui       # Open Playwright UI
```

### Run Specific Tests
```bash
# Run specific test file
npm test -- path/to/test.test.ts

# Run tests matching pattern
npm test -- --grep "AI Controller"

# Run in watch mode for specific file
npm run test:watch -- path/to/test.test.ts
```

## Test-Driven Development (TDD) Workflow

### The Red-Green-Refactor Cycle

Following Article VII of the Constitution, **ALL feature development MUST follow TDD**:

#### 1. RED Phase - Write Failing Tests
```typescript
// Example: tests/unit/services/new-feature.test.ts
describe('NewFeature', () => {
  it('should transform input correctly', () => {
    const result = transformInput('test')
    expect(result).toBe('TRANSFORMED: test')
  })
})
```

Run tests and verify they FAIL:
```bash
npm test -- new-feature.test.ts
# Expected: ✗ FAIL - function not implemented
```

#### 2. GREEN Phase - Make Tests Pass
```typescript
// backend/src/services/new-feature.ts
export function transformInput(input: string): string {
  return `TRANSFORMED: ${input}`
}
```

Run tests and verify they PASS:
```bash
npm test -- new-feature.test.ts
# Expected: ✓ PASS - all tests green
```

#### 3. REFACTOR Phase - Improve Code Quality
```typescript
// backend/src/services/new-feature.ts
export function transformInput(input: string): string {
  if (!input) throw new Error('Input required')
  return `TRANSFORMED: ${input.trim()}`
}
```

Run tests and verify they still PASS:
```bash
npm test -- new-feature.test.ts
# Expected: ✓ PASS - all tests still green
```

### TDD Principles

1. **Never write production code without a failing test first**
2. **Write the minimum test to make it fail**
3. **Write the minimum code to make the test pass**
4. **Refactor while keeping tests green**
5. **Commit after each successful cycle**

## Writing Good Tests

### Unit Tests

**Characteristics**:
- Fast (< 1ms per test)
- Isolated (no external dependencies)
- Deterministic (same input = same output)
- Test single units of functionality

**Example**:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { calculateDiscount } from '../../../backend/src/services/pricing'

describe('Pricing Service', () => {
  describe('calculateDiscount', () => {
    it('should apply 10% discount for basic tier', () => {
      const result = calculateDiscount(100, 'basic')
      expect(result).toBe(90)
    })

    it('should apply 20% discount for premium tier', () => {
      const result = calculateDiscount(100, 'premium')
      expect(result).toBe(80)
    })

    it('should throw error for invalid tier', () => {
      expect(() => calculateDiscount(100, 'invalid'))
        .toThrow('Invalid tier')
    })
  })
})
```

### Integration Tests

**Characteristics**:
- Test multiple units working together
- May use real databases/services (test instances)
- Slower than unit tests
- Verify integration points

**Example**:
```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../setup/test-server'
import { Express } from 'express'

describe('Projects API Integration', () => {
  let app: Express

  beforeAll(async () => {
    app = await createTestServer()
  })

  it('should create and retrieve project', async () => {
    // Create project
    const createResponse = await request(app)
      .post('/api/projects')
      .send({ name: 'Test Project', type: 'ebook' })
      .expect(201)

    const projectId = createResponse.body.id

    // Retrieve project
    const getResponse = await request(app)
      .get(`/api/projects/${projectId}`)
      .expect(200)

    expect(getResponse.body.name).toBe('Test Project')
  })
})
```

### E2E Tests

**Characteristics**:
- Test complete user workflows
- Run in real browser (Chromium/Firefox/Safari)
- Slowest tests (seconds per test)
- Verify entire system works together

**Example**:
```typescript
import { test, expect } from '@playwright/test'

test('complete project creation workflow', async ({ page }) => {
  // Navigate to app
  await page.goto('/')

  // Click "New Project"
  await page.click('button:has-text("New Project")')

  // Fill form
  await page.fill('input[name="projectName"]', 'My Ebook')
  await page.click('button[data-type="ebook"]')

  // Submit
  await page.click('button[type="submit"]')

  // Verify navigation
  await expect(page).toHaveURL(/\/projects\/[a-zA-Z0-9-]+/)

  // Verify project created
  await expect(page.locator('h1')).toContainText('My Ebook')
})
```

## Mocking and Fixtures

### Using Vitest Mocks

```typescript
import { vi } from 'vitest'

// Mock entire module
vi.mock('../services/openai', () => ({
  generateText: vi.fn().mockResolvedValue({ content: 'Generated text' })
}))

// Mock specific function
const mockFn = vi.fn()
mockFn.mockReturnValue('mocked result')

// Verify mock calls
expect(mockFn).toHaveBeenCalledWith('expected', 'arguments')
expect(mockFn).toHaveBeenCalledTimes(1)
```

### Using Test Fixtures

```typescript
import { testUsers } from '../../fixtures/users'
import { testProjects } from '../../fixtures/projects'

it('should work with test data', () => {
  const user = testUsers.admin
  const project = testProjects.ebook

  // Use fixtures in tests
  expect(user.email).toBe('admin@test.com')
})
```

### Creating New Fixtures

```typescript
// tests/fixtures/courses.ts
export const testCourses = {
  beginner: {
    id: 'course-1',
    title: 'Beginner Course',
    level: 'beginner',
    modules: 10,
    duration: 8
  },
  advanced: {
    id: 'course-2',
    title: 'Advanced Course',
    level: 'advanced',
    modules: 20,
    duration: 16
  }
}
```

## Code Coverage

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

### Coverage Thresholds

From `vitest.config.ts`:
```typescript
coverage: {
  thresholds: {
    lines: 80,        // 80% of lines must be tested
    functions: 80,    // 80% of functions must be tested
    branches: 80,     // 80% of branches must be tested
    statements: 80    // 80% of statements must be tested
  }
}
```

### Excluded from Coverage

- `node_modules/`
- `tests/`
- `**/*.test.ts` and `**/*.spec.ts`
- `**/dist/`
- `**/*.config.ts`
- `spec-kit-main/` and `legacy-docs/`
- `.specify/`

### Improving Coverage

1. **Identify uncovered code**:
   ```bash
   npm run test:coverage
   # Look for red/yellow highlighted code in HTML report
   ```

2. **Write tests for uncovered areas**:
   ```typescript
   // Previously untested edge case
   it('should handle empty input', () => {
     expect(() => processInput('')).toThrow('Input required')
   })
   ```

3. **Verify coverage improved**:
   ```bash
   npm run test:coverage
   # Check new coverage percentage
   ```

## CI/CD Integration

### GitHub Actions Workflow

Located at `.github/workflows/test.yml`, runs on:
- Every push to `main`, `feature/*`, `0*-*` branches
- Every pull request to `main`

**Jobs**:
1. Install dependencies
2. Run unit tests
3. Run unit tests with coverage
4. Install Playwright browsers
5. Run E2E tests
6. Upload test reports

### Required Checks

All tests must pass before:
- Merging pull requests
- Deploying to production
- Releasing new versions

### Viewing CI Results

1. Go to repository → Actions tab
2. Click on latest workflow run
3. View test results and coverage reports
4. Download artifacts for detailed reports

## Best Practices

### DO ✅

- **Write tests first** (Red-Green-Refactor)
- **Test behavior, not implementation**
- **Use descriptive test names**
- **One assertion per test** (when possible)
- **Keep tests fast and isolated**
- **Mock external dependencies**
- **Test edge cases and error conditions**
- **Commit after each Green phase**

### DON'T ❌

- **Don't skip tests** (use `.skip` only temporarily)
- **Don't test implementation details**
- **Don't share state between tests**
- **Don't use random data** (use fixtures)
- **Don't ignore failing tests**
- **Don't mock what you don't own**
- **Don't write tests after code** (violates TDD)
- **Don't commit failing tests**

## Test Organization

### Naming Conventions

```
tests/
├── unit/
│   └── services/
│       └── ai.service.test.ts       # ✅ Uses .test.ts suffix
├── integration/
│   └── api/
│       └── projects.api.test.ts     # ✅ Descriptive naming
└── e2e/
    └── specs/
        └── user-workflow.spec.ts    # ✅ Uses .spec.ts for E2E
```

### Test Structure (AAA Pattern)

```typescript
it('should do something', () => {
  // ARRANGE - Set up test data
  const input = 'test data'
  const expected = 'expected result'

  // ACT - Perform the action
  const result = functionUnderTest(input)

  // ASSERT - Verify the result
  expect(result).toBe(expected)
})
```

### Group Related Tests

```typescript
describe('User Authentication', () => {
  describe('login', () => {
    it('should return token for valid credentials', () => {})
    it('should throw error for invalid credentials', () => {})
    it('should throw error for missing fields', () => {})
  })

  describe('logout', () => {
    it('should invalidate token', () => {})
    it('should clear session data', () => {})
  })
})
```

## Troubleshooting

### Tests Timing Out

```typescript
// Increase timeout for slow tests
it('should handle long operation', async () => {
  // test code
}, 10000) // 10 second timeout
```

### Mock Not Working

```typescript
// Ensure mock is defined BEFORE import
vi.mock('../module', () => ({ mockImplementation }))
import { functionToTest } from '../module' // Must come after vi.mock
```

### E2E Tests Failing Locally

```bash
# Ensure browsers are installed
npx playwright install chromium

# Run in headed mode to see what's happening
npm run test:e2e -- --headed

# Enable debug mode
DEBUG=pw:api npm run test:e2e
```

### Coverage Not Updating

```bash
# Clear coverage cache
rm -rf coverage/

# Regenerate coverage
npm run test:coverage
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [TDD by Example (Kent Beck)](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Project Constitution](../.specify/memory/constitution.md) - Article VII: Test-First Development

## Getting Help

1. Check this documentation first
2. Review existing tests for examples
3. Check the [Project Constitution](../.specify/memory/constitution.md)
4. Ask team for code review
5. Create an issue if tests are broken

---

**Remember**: Tests are not optional. They are the foundation of quality software and mandated by our Constitution. Happy testing! 🎯
