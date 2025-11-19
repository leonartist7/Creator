# Tasks: Testing Infrastructure & TDD Workflow

**Input**: Design documents from `/specs/001-testing-infrastructure/`
**Prerequisites**: plan.md ✅, spec.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6 from spec.md)
- All file paths are absolute from repository root

---

## Phase 1: Setup & Infrastructure (Shared Foundation)

**Purpose**: Install testing framework dependencies and create directory structure

**⚠️ CRITICAL**: This phase must complete before any user story implementation

- [ ] T001 Install Vitest and coverage dependencies (`npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 jsdom`)
- [ ] T002 [P] Install Playwright and testing library (`npm install --save-dev playwright @playwright/test @testing-library/react @testing-library/user-event`)
- [ ] T003 [P] Install Supertest for API testing (`npm install --save-dev supertest @types/supertest`)
- [ ] T004 Create test directory structure (`tests/{unit,integration,e2e,fixtures,setup}/`)
- [ ] T005 [P] Create subdirectories (`tests/unit/{backend,frontend}/`, `tests/integration/api/`, `tests/e2e/specs/`)

**Checkpoint**: Dependencies installed, directories created - configuration can begin

---

## Phase 2: Foundational Configuration

**Purpose**: Core testing infrastructure configuration files

**⚠️ CRITICAL**: No tests can be written until this phase is complete

- [ ] T006 Create root Vitest config (`vitest.config.ts`) with coverage thresholds (80%), path aliases, and test environment settings
- [ ] T007 [P] Create Playwright config (`playwright.config.ts`) with browser settings, base URL, screenshot/video on failure
- [ ] T008 [P] Add test scripts to root `package.json` (test, test:watch, test:coverage, test:integration, test:e2e)
- [ ] T009 Create global test setup file (`tests/setup/global-setup.ts`) for shared initialization logic
- [ ] T010 [P] Create test fixtures for users (`tests/fixtures/users.ts`) with sample user data
- [ ] T011 [P] Create test fixtures for projects (`tests/fixtures/projects.ts`) with sample project data
- [ ] T012 [P] Create test fixtures for AI responses (`tests/fixtures/ai-responses.ts`) with mock AI outputs
- [ ] T013 Create test server setup (`tests/integration/setup/test-server.ts`) for API testing with Supertest
- [ ] T014 Create database setup utilities (`tests/integration/setup/db-setup.ts`) for test database management

**Checkpoint**: Foundation complete - user story tests can now be written

---

## Phase 3: User Story 1 - Developer Writes Tests Before Code (Priority: P1) 🎯

**Goal**: Enable TDD workflow with immediate test feedback

**Independent Test**: Developer can create a test file, write failing tests, implement code, see tests pass

### Tests for User Story 1 (Infrastructure Tests)

> **NOTE: These test the testing infrastructure itself - meta-testing**

- [ ] T015 [P] [US1] Test that Vitest runs and reports results (`tests/unit/infrastructure/vitest.test.ts`)
- [ ] T016 [P] [US1] Test that coverage reporting works (`tests/unit/infrastructure/coverage.test.ts`)
- [ ] T017 [US1] Test that test fixtures load correctly (`tests/unit/infrastructure/fixtures.test.ts`)

### Implementation for User Story 1

- [ ] T018 [US1] Configure Vitest watch mode for instant feedback on file save
- [ ] T019 [US1] Add test file templates to `.specify/templates/` for easy test creation
- [ ] T020 [US1] Create developer documentation (`docs/TESTING.md`) with TDD workflow (Red-Green-Refactor), examples, and commands
- [ ] T021 [US1] Verify tests can be run with `npm run test` and watch mode with `npm run test:watch`

**Checkpoint**: Developers can write tests and see immediate feedback ✅

---

## Phase 4: User Story 2 - Coverage Measurement (Priority: P1) 🎯

**Goal**: Accurate code coverage reporting with 80% threshold enforcement

**Independent Test**: Run coverage command, see percentage, identify untested lines

### Tests for User Story 2

> **NOTE: Write these FIRST, ensure they FAIL before implementation**

- [ ] T022 [P] [US2] Test that coverage thresholds are enforced (`tests/unit/infrastructure/coverage-threshold.test.ts`)
- [ ] T023 [P] [US2] Test that coverage report highlights untested lines (manual verification task)

### Implementation for User Story 2

- [ ] T024 [US2] Configure coverage thresholds in `vitest.config.ts` (lines: 80%, functions: 80%, branches: 80%, statements: 80%)
- [ ] T025 [US2] Configure coverage reporters (text, json, html, lcov) for multiple output formats
- [ ] T026 [US2] Configure coverage exclusions (node_modules, tests/, dist/, *.config.ts)
- [ ] T027 [US2] Add coverage reporting to package.json scripts (`test:coverage`)
- [ ] T028 [US2] Verify coverage reports generate in `coverage/` directory with HTML visualization

**Checkpoint**: Coverage measurement functional with 80% threshold ✅

---

## Phase 5: User Story 3 - API Endpoint Testing (Priority: P1) 🎯

**Goal**: All backend API endpoints tested with real requests using Supertest

**Independent Test**: Run API tests, verify they test actual Express routes with real database

### Tests for User Story 3 (API Tests for Existing Endpoints)

> **NOTE: Write these FIRST for existing endpoints - they WILL FAIL initially (Red phase)**

#### Auth Endpoints

- [ ] T029 [P] [US3] Test POST `/api/auth/register` - creates user account (`tests/integration/api/auth.api.test.ts`)
- [ ] T030 [P] [US3] Test POST `/api/auth/login` - returns JWT token (`tests/integration/api/auth.api.test.ts`)
- [ ] T031 [P] [US3] Test GET `/api/auth/me` - returns current user (`tests/integration/api/auth.api.test.ts`)

#### Project Endpoints

- [ ] T032 [P] [US3] Test GET `/api/projects` - lists all projects (`tests/integration/api/projects.api.test.ts`)
- [ ] T033 [P] [US3] Test POST `/api/projects` - creates new project (`tests/integration/api/projects.api.test.ts`)
- [ ] T034 [P] [US3] Test GET `/api/projects/:id` - returns single project (`tests/integration/api/projects.api.test.ts`)
- [ ] T035 [P] [US3] Test PUT `/api/projects/:id` - updates project (`tests/integration/api/projects.api.test.ts`)
- [ ] T036 [P] [US3] Test DELETE `/api/projects/:id` - deletes project (`tests/integration/api/projects.api.test.ts`)

#### AI Endpoints

- [ ] T037 [P] [US3] Test POST `/api/ai/generate-outline` - returns AI-generated outline (`tests/integration/api/ai.api.test.ts`)
- [ ] T038 [P] [US3] Test POST `/api/ai/improve-text` - returns improved text (`tests/integration/api/ai.api.test.ts`)
- [ ] T039 [P] [US3] Test POST `/api/ai/generate-ideas` - returns product ideas (`tests/integration/api/ai.api.test.ts`)

#### Export Endpoints

- [ ] T040 [P] [US3] Test POST `/api/export` - generates export file (`tests/integration/api/export.api.test.ts`)

### Implementation for User Story 3

- [ ] T041 [US3] Implement test server factory (`tests/integration/setup/test-server.ts`) that creates Express app for testing
- [ ] T042 [US3] Implement database setup/teardown (`tests/integration/setup/db-setup.ts`) with transaction isolation
- [ ] T043 [US3] Add test data seeding for API tests (users, auth tokens, projects)
- [ ] T044 [US3] Configure API test suite to run with `npm run test:integration`
- [ ] T045 [US3] Fix any failing API tests by correcting endpoint implementations (Green phase)

**Checkpoint**: All API endpoints have passing tests ✅

---

## Phase 6: User Story 4 - E2E User Workflow Testing (Priority: P2) 🎯

**Goal**: Complete user workflows tested through UI with Playwright

**Independent Test**: Run E2E tests, watch browser automate user actions, verify workflows complete

### Tests for User Story 4 (E2E Tests for User Workflows)

> **NOTE: Write these FIRST - they WILL FAIL initially (Red phase)**

#### Project Management Workflows

- [ ] T046 [P] [US4] E2E test: Create new ebook project workflow (`tests/e2e/specs/project-creation.spec.ts`)
- [ ] T047 [P] [US4] E2E test: Edit project and save changes workflow (`tests/e2e/specs/project-editing.spec.ts`)
- [ ] T048 [P] [US4] E2E test: Delete project workflow (`tests/e2e/specs/project-deletion.spec.ts`)

#### AI Generation Workflows

- [ ] T049 [P] [US4] E2E test: Generate outline with AI workflow (`tests/e2e/specs/ai-generation.spec.ts`)
- [ ] T050 [P] [US4] E2E test: Improve text with AI workflow (`tests/e2e/specs/ai-generation.spec.ts`)
- [ ] T051 [P] [US4] E2E test: Generate ideas with AI workflow (`tests/e2e/specs/ai-generation.spec.ts`)

#### Content Editing Workflows

- [ ] T052 [P] [US4] E2E test: Edit content in rich text editor workflow (`tests/e2e/specs/content-editing.spec.ts`)
- [ ] T053 [P] [US4] E2E test: Use command palette for actions workflow (`tests/e2e/specs/content-editing.spec.ts`)

#### Export Workflows

- [ ] T054 [P] [US4] E2E test: Export project to PDF workflow (`tests/e2e/specs/export-workflow.spec.ts`)
- [ ] T055 [P] [US4] E2E test: Export project to DOCX workflow (`tests/e2e/specs/export-workflow.spec.ts`)

### Implementation for User Story 4

- [ ] T056 [US4] Create page object models for reusable page interactions (`tests/e2e/utils/page-objects/`)
- [ ] T057 [US4] Implement AI mocking for E2E tests (use fixtures instead of real AI API calls)
- [ ] T058 [US4] Configure Playwright to start dev server automatically before tests
- [ ] T059 [US4] Add screenshot/video capture on test failure
- [ ] T060 [US4] Configure E2E test suite to run with `npm run test:e2e`
- [ ] T061 [US4] Fix any failing E2E tests by correcting UI/workflow issues (Green phase)

**Checkpoint**: All user workflows have passing E2E tests ✅

---

## Phase 7: User Story 5 - CI/CD Pipeline (Priority: P2) 🎯

**Goal**: Automated testing on every commit via GitHub Actions

**Independent Test**: Create PR with failing test, verify CI blocks merge

### Tests for User Story 5

> **NOTE: CI configuration itself doesn't have tests - this is infrastructure**

- [ ] T062 [US5] Manual test: Create test PR with intentionally failing test, verify CI blocks merge
- [ ] T063 [US5] Manual test: Fix test, verify CI passes and allows merge

### Implementation for User Story 5

- [ ] T064 [US5] Create GitHub Actions workflow file (`.github/workflows/test.yml`)
- [ ] T065 [US5] Configure workflow to run on push to all branches and pull requests
- [ ] T066 [US5] Add matrix build for Node.js 18.x and 20.x
- [ ] T067 [US5] Add workflow steps: checkout, setup Node, install deps, run unit tests
- [ ] T068 [US5] Add workflow step: run API tests with test database
- [ ] T069 [US5] Add workflow step: install Playwright browsers and run E2E tests
- [ ] T070 [US5] Add workflow step: upload coverage report to Codecov (optional: requires Codecov account)
- [ ] T071 [US5] Add workflow step: check coverage thresholds and fail if below 80%
- [ ] T072 [US5] Add workflow step: upload Playwright test report as artifact
- [ ] T073 [US5] Configure branch protection rules on GitHub to require passing tests
- [ ] T074 [US5] Verify CI pipeline runs on next commit and reports status correctly

**Checkpoint**: CI/CD pipeline enforces test requirements automatically ✅

---

## Phase 8: User Story 6 - Test Data Fixtures & Isolation (Priority: P3) 🎯

**Goal**: Reusable test data and perfect test isolation

**Independent Test**: Run tests in parallel, verify no cross-contamination

### Tests for User Story 6

> **NOTE: Write these FIRST - they WILL FAIL if isolation is broken**

- [ ] T075 [P] [US6] Test that parallel tests don't affect each other's data (`tests/unit/infrastructure/isolation.test.ts`)
- [ ] T076 [P] [US6] Test that fixtures provide consistent data across test runs (`tests/unit/infrastructure/fixtures-consistency.test.ts`)

### Implementation for User Story 6

- [ ] T077 [US6] Implement transaction-based test isolation for database tests (BEGIN before each, ROLLBACK after each)
- [ ] T078 [US6] Create comprehensive test fixtures for all entities (users, projects, masterworks, AI responses)
- [ ] T079 [US6] Add fixture loading utilities (`tests/fixtures/loader.ts`) for easy test data access
- [ ] T080 [US6] Configure Vitest to run tests in parallel by default (threadpool)
- [ ] T081 [US6] Verify parallel test execution with `npm run test -- --reporter=verbose` (check for race conditions)

**Checkpoint**: Test isolation perfect, fixtures reusable ✅

---

## Phase 9: Test Coverage for Existing Code (Write Tests for Production Code)

**Purpose**: Achieve 80% code coverage for all existing features

**⚠️ CRITICAL TDD WORKFLOW**: For each file, write tests FIRST (Red), then fix/refactor code (Green)

### Backend Unit Tests

#### Services (P1 - Core Business Logic)

- [ ] T082 [P] Unit test: `backend/src/services/openai.service.ts` (`tests/unit/backend/services/openai.service.test.ts`)
- [ ] T083 [P] Unit test: `backend/src/services/anthropic.service.ts` (`tests/unit/backend/services/anthropic.service.test.ts`)

#### Controllers (P1 - API Handlers)

- [ ] T084 [P] Unit test: `backend/src/controllers/ai.controller.ts` (`tests/unit/backend/controllers/ai.controller.test.ts`)
- [ ] T085 [P] Unit test: `backend/src/controllers/project.controller.ts` (`tests/unit/backend/controllers/project.controller.test.ts`)
- [ ] T086 [P] Unit test: `backend/src/controllers/export.controller.ts` (`tests/unit/backend/controllers/export.controller.test.ts`)
- [ ] T087 [P] Unit test: `backend/src/controllers/auth.controller.ts` (`tests/unit/backend/controllers/auth.controller.test.ts`)
- [ ] T088 [P] Unit test: `backend/src/controllers/analytics.controller.ts` (`tests/unit/backend/controllers/analytics.controller.test.ts`)

#### Utilities (P2)

- [ ] T089 [P] Unit test: `backend/src/utils/*.ts` (any utility functions) (`tests/unit/backend/utils/`)

### Frontend Unit Tests

#### Complex Components (P1)

- [ ] T090 [P] Unit test: `frontend/src/components/Editor/RichTextEditor.tsx` (`tests/unit/frontend/components/Editor.test.tsx`)
- [ ] T091 [P] Unit test: `frontend/src/components/CommandPalette.tsx` (`tests/unit/frontend/components/CommandPalette.test.tsx`)
- [ ] T092 [P] Unit test: `frontend/src/components/AITools/TextImprover.tsx` (`tests/unit/frontend/components/TextImprover.test.tsx`)
- [ ] T093 [P] Unit test: `frontend/src/components/AITools/OutlineGenerator.tsx` (`tests/unit/frontend/components/OutlineGenerator.test.tsx`)
- [ ] T094 [P] Unit test: `frontend/src/components/FloatingAI.tsx` (`tests/unit/frontend/components/FloatingAI.test.tsx`)

#### State Management (P2)

- [ ] T095 [P] Unit test: `frontend/src/stores/*.ts` (all store files) (`tests/unit/frontend/stores/`)

#### Simple UI Components (P3 - Lower Priority)

- [ ] T096 [P] Unit test: `frontend/src/components/ui/*.tsx` (Button, Card, Modal, etc.) (`tests/unit/frontend/components/ui/`)

### Coverage Verification

- [ ] T097 Run full coverage report and identify any gaps below 80%
- [ ] T098 Write additional tests for any files below 80% coverage threshold
- [ ] T099 Verify final coverage meets or exceeds 80% across all metrics (lines, functions, branches, statements)

**Checkpoint**: 80% code coverage achieved across entire codebase ✅

---

## Phase 10: TDD Workflow Documentation & Enforcement

**Purpose**: Document TDD process and enforce through tooling

- [ ] T100 Write comprehensive testing documentation (`docs/TESTING.md`) with:
  - TDD workflow (Red-Green-Refactor cycle)
  - Running tests locally (commands, watch mode, debugging)
  - Writing unit tests (examples, best practices, mocking)
  - Writing API tests (Supertest examples, database isolation)
  - Writing E2E tests (Playwright examples, page objects)
  - Coverage reports (interpretation, improving coverage)
  - CI/CD pipeline (understanding failures, debugging in CI)
- [ ] T101 Create PR template (`.github/pull_request_template.md`) with TDD checklist
- [ ] T102 [P] Set up Husky for git hooks (`npm install --save-dev husky`)
- [ ] T103 [P] Create pre-commit hook (`.husky/pre-commit`) that runs tests on changed files
- [ ] T104 Update `ROADMAP.md` to mark Phase 0 as complete and update constitutional compliance to 70%+
- [ ] T105 Update `README.md` to mention testing infrastructure and link to `docs/TESTING.md`

**Checkpoint**: TDD workflow documented and enforced ✅

---

## Phase 11: Commit & Push

**Purpose**: Commit all testing infrastructure to git

- [ ] T106 Stage all changes (`git add -A`)
- [ ] T107 Commit with message following constitutional format (reference Article VII compliance)
- [ ] T108 Push to branch `001-testing-infrastructure`
- [ ] T109 Create pull request with testing infrastructure summary
- [ ] T110 Verify CI pipeline runs on PR and all tests pass

**Checkpoint**: Testing infrastructure complete and merged ✅

---

## Summary Statistics

**Total Tasks**: 110
**Critical Path Tasks (must be sequential)**: ~30
**Parallelizable Tasks**: ~80

**Estimated Time**:
- Phase 1-2 (Setup): 2-4 hours
- Phase 3-6 (User Stories 1-4): 8-12 hours
- Phase 7 (CI/CD): 2-3 hours
- Phase 8-9 (Coverage): 12-20 hours
- Phase 10-11 (Documentation & Commit): 2-3 hours

**Total**: 26-42 hours (depending on codebase complexity and test writing speed)

**Constitutional Impact**: Fixes Article VII violation, increases compliance from 30% to 70%+

---

## Task Execution Order (Recommended)

1. **Sequential**: Phase 1-2 (setup and configuration)
2. **Parallel**: Phase 3-6 (user stories can be developed concurrently once Phase 2 complete)
3. **Sequential**: Phase 7 (CI/CD after tests written)
4. **Parallel**: Phase 9 (coverage tests can be written in parallel)
5. **Sequential**: Phase 10-11 (documentation and commit)

**Ready for `/speckit.implement`** ✅
