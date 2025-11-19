# Creative Mastery Platform

> **A revolutionary AI-powered platform that learns from uploaded masterworks across all media to help creators produce professional-grade content.**

**Vision**: Learn from the Masters → Create like the Masters → Publish like the Masters

---

## 🎯 What Makes This Different

Unlike traditional AI writing tools that generate generic content, the Creative Mastery Platform **learns from masterworks**—books, scripts, films—to extract their creative DNA and help you write, design, and create with the same techniques used by the world's best creators.

### Core Capabilities

1. **Learn from the Masters** 📚
   - Upload any book, script, or masterwork
   - Extract style DNA (sentence structure, vocabulary, pacing, tone)
   - Identify patterns (plot structures, character arcs, narrative techniques)
   - Build a knowledge vault of creative mastery

2. **Create Across Media** 🎨
   - **Text**: AI Writing Studio with style mimicry engine
   - **Visual**: Cover design, illustrations, storyboards (AI-generated)
   - **Cinematic**: Scripts, vision boards, scene visualizations

3. **Professional Output** ✨
   - Publication-ready exports (EPUB, MOBI, PDF, DOCX)
   - Print-quality visuals (300 DPI, CMYK)
   - Industry-standard formatting

---

## 🏛️ Constitutional Principles

This project follows **Spec-Driven Development** guided by a strict constitution. Read the full constitution at:

👉 **[`.specify/memory/constitution.md`](.specify/memory/constitution.md)**

### Key Principles

- **Master-First Development**: Every feature learns from uploaded masterworks
- **Creative-Flow Priority**: UX follows natural creative process, not tech constraints
- **Intelligence Over Automation**: AI assists and enhances, never replaces
- **Multi-Media Native**: Equal support for text, visual, and cinematic creation
- **Professional Output Standard**: Everything exportable at publication quality
- **Test-First Development** (NON-NEGOTIABLE): TDD mandatory for all features
- **Library-First Architecture**: Build reusable, standalone components
- **Simplicity & Anti-Abstraction**: Start simple, justify all complexity

**Violations halt development.** See constitution for full details.

---

## 📊 Current Status

**Version**: 1.0.0 (Speckit Adoption Phase)
**Constitutional Compliance**: 30% (F grade) - In active improvement
**Vision Implementation**: 5% (AI Writing Studio only - partial)

### What's Working ✅

- **AI Writing Studio**: Rich text editor with AI assistance (OpenAI + Anthropic)
- **Project Management**: Create, save, and organize writing projects
- **Snippet Library**: Reusable content blocks (hooks, CTAs, paragraphs)
- **Export System**: Export to multiple formats
- **Version History**: Track and revert content changes
- **Autosave**: Never lose work
- **Focus Mode**: Distraction-free writing

### Critical Gaps 🔴

1. ~~**NO TEST SUITE**~~ ✅ **FIXED** - Testing infrastructure complete (Vitest + Playwright + Supertest)
2. **NO MASTERWORK SYSTEM** - Violates Article I (Master-First - core vision)
3. **NO MULTI-MEDIA SUPPORT** - Violates Article IV (vision requires text + visual + cinematic)
4. **NOT LIBRARY-FIRST** - Violates Article VI (tightly coupled architecture)

See **[FEATURE_INVENTORY.md](legacy-docs/FEATURE_INVENTORY.md)** for detailed gap analysis.

---

## 🗺️ Development Roadmap

We're following a **spec-driven development roadmap** to achieve the full vision:

👉 **[ROADMAP.md](ROADMAP.md)** - Complete development plan

### Phases Overview

| Phase | Timeline | Focus | Deliverables |
|-------|----------|-------|--------------|
| **Phase 0** | Weeks 1-2 | Foundation Reset | Testing infrastructure + Library-first refactoring |
| **Phase 1** | Weeks 3-6 | Knowledge Vault | Master upload, Style DNA extraction, Pattern recognition |
| **Phase 2** | Weeks 7-10 | AI Studio Enhancement | Style mimicry, Advanced writing assist, Professional export |
| **Phase 3** | Weeks 11-14 | Visual Generation | Cover design, Illustrations, Storyboards |
| **Phase 4+** | Weeks 15+ | Advanced Modules | E-book creator, Course builder, Marketing tools |

**Next Milestone**: Phase 0 completion (constitutional compliance to 70%+)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (local or Supabase)
- MongoDB (for masterwork storage - Phase 1)
- OpenAI API key
- Anthropic API key (for Claude)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Creator
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:pass@localhost:5432/creative_mastery
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   Runs both frontend (http://localhost:5173) and backend (http://localhost:3001)

---

## 🛠️ Tech Stack

### Current Stack

- **Frontend**: React 18+ with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL (primary), MongoDB (planned for masterworks)
- **AI**: OpenAI (GPT-4), Anthropic (Claude)
- **Testing**: Vitest (unit), Playwright (E2E), Supertest (API) ✅ **Complete**
  - 80% minimum code coverage enforced
  - TDD workflow mandatory (Article VII)
  - CI/CD pipeline with GitHub Actions

### Forbidden Patterns

❌ Redux/MobX (use React Context + hooks)
❌ Premature microservices (modular monolith)
❌ Custom framework wrappers (use frameworks directly)
❌ Mock-heavy testing (use real services)

See constitution for rationale.

---

## 📚 Documentation Structure

```
Creator/
├── README.md                          # This file - project overview
├── ROADMAP.md                         # Development roadmap
├── docs/
│   └── TESTING.md                     # ⭐ Testing guide (TDD workflow, best practices)
├── .specify/
│   ├── memory/
│   │   └── constitution.md           # Project constitution (READ THIS FIRST)
│   ├── specs/                         # Feature specifications (created by /speckit.specify)
│   ├── templates/                     # Spec templates
│   └── scripts/                       # Automation scripts
├── tests/
│   ├── unit/                          # Unit tests (services, controllers, components)
│   ├── integration/                   # Integration tests (API endpoints)
│   ├── e2e/                           # End-to-end tests (user workflows)
│   └── fixtures/                      # Shared test data
├── legacy-docs/
│   ├── README.md                      # Archive explanation
│   ├── FEATURE_INVENTORY.md          # What exists vs. what's planned
│   └── [14 archived docs]             # Historical documentation (pre-speckit)
├── frontend/                          # React app
├── backend/                           # Express API
└── spec-kit-main/                     # Speckit source (reference only)
```

---

## 🔧 Development Workflow

This project uses **Spec-Driven Development** with the following commands:

### Speckit Commands (available in Claude Code)

1. **`/speckit.constitution`** - Create/update project principles
2. **`/speckit.specify`** - Create feature specification (WHAT to build)
3. **`/speckit.clarify`** - Resolve spec ambiguities (optional but recommended)
4. **`/speckit.plan`** - Create technical plan (HOW to build)
5. **`/speckit.tasks`** - Generate task breakdown
6. **`/speckit.implement`** - Execute implementation with TDD

### Example Workflow

```bash
# Step 1: Specify feature
/speckit.specify Create comprehensive testing infrastructure...

# Step 2: Clarify ambiguities
/speckit.clarify

# Step 3: Create technical plan
/speckit.plan Using Vitest, Playwright, and Supertest...

# Step 4: Generate tasks
/speckit.tasks

# Step 5: Implement with TDD
/speckit.implement
```

**All features MUST follow this workflow.** See `.specify/memory/constitution.md` for enforcement details.

---

## 🧪 Testing

**Status**: ✅ **Complete** - Constitutional compliance achieved (Article VII)

**Coverage**: 80% minimum enforced across all code

### Testing Stack

- **Vitest** v4.0.10: Unit & integration tests
- **Playwright** v1.56.1: End-to-end browser testing
- **Supertest** v7.1.4: API endpoint testing
- **CI/CD**: GitHub Actions pipeline (runs on every push)

### Running Tests

```bash
# Unit tests
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
npm run test:ui             # Open Vitest UI

# Integration tests
npm run test:integration    # API endpoint tests

# E2E tests
npm run test:e2e            # Run Playwright tests
npm run test:e2e:ui         # Open Playwright UI
```

### TDD Workflow (Mandatory)

Following Article VII, all features MUST use Test-Driven Development:

1. **RED**: Write failing tests first
2. **GREEN**: Implement minimum code to pass
3. **REFACTOR**: Improve code while keeping tests green

📖 **Full Guide**: [`docs/TESTING.md`](docs/TESTING.md) - Comprehensive testing documentation

---

## 📦 Project Structure (Library-First Migration)

**Current**: Monolithic app structure (violates Article VI)

**Target** (Phase 0):
```
Creator/
├── packages/
│   ├── ai-service/              # OpenAI + Anthropic wrapper
│   ├── editor-core/             # Rich text editing library
│   ├── snippet-manager/         # Snippet management library
│   └── export-engine/           # Multi-format export library
├── apps/
│   ├── frontend/                # React app (consumes libraries)
│   └── backend/                 # Express API (consumes libraries)
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 🤝 Contributing

**Important**: This project follows strict constitutional principles.

### Before Contributing

1. **Read the constitution**: `.specify/memory/constitution.md`
2. **Review the roadmap**: `ROADMAP.md`
3. **Check feature inventory**: `legacy-docs/FEATURE_INVENTORY.md`
4. **Follow spec-driven workflow**: Use `/speckit.*` commands

### Pull Request Requirements

All PRs MUST pass these checks:

- [ ] Constitutional compliance verified (all articles)
- [ ] Tests written BEFORE implementation (TDD)
- [ ] All tests passing (>80% coverage)
- [ ] Integration tests pass with real services
- [ ] Performance benchmarks met
- [ ] Accessibility standards verified (WCAG 2.1 AA)
- [ ] Feature spec + plan + API docs complete

**PRs failing constitutional checks will be rejected.**

---

## 📖 Learning Resources

- **Spec-Driven Development**: [spec-kit-main/spec-driven.md](spec-kit-main/spec-driven.md)
- **Speckit README**: [spec-kit-main/README.md](spec-kit-main/README.md)
- **Legacy Docs Archive**: [legacy-docs/README.md](legacy-docs/README.md)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Speckit** by GitHub - Spec-Driven Development methodology
- **OpenAI** & **Anthropic** - AI model providers
- All the masterwork creators whose techniques inspire this platform

---

## 🚨 Important Notes

### For New Developers

1. **Start here**: Read `.specify/memory/constitution.md` (10 minutes)
2. **Understand the vision**: Read this README + `ROADMAP.md` (15 minutes)
3. **See what exists**: Review `legacy-docs/FEATURE_INVENTORY.md` (10 minutes)
4. **Follow workflow**: Use `/speckit.*` commands for all new features
5. **Never skip tests**: Article VII (Test-First) is NON-NEGOTIABLE

### For Users

This platform is in **active development**. Current features (AI Writing Studio) are functional but represent only 5% of the vision.

**Want to contribute?** Help us reach Phase 1 (Knowledge Vault) - the foundation for learning from masterworks.

---

**Next Steps**: See [ROADMAP.md](ROADMAP.md) for immediate actions.

---

*Built with ❤️ using Spec-Driven Development*
