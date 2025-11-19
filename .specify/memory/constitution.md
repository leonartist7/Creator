# Creative Mastery Platform Constitution

## Article I: Core Creative Principles

### I. Master-First Development
Every feature MUST learn from and honor the structure, style, and techniques of uploaded masterworks across all media (books, scripts, films, visual arts).

**Requirements**:
- Features SHALL extract and preserve the creative DNA of masterworks
- Pattern recognition MUST identify techniques, not just content
- Style analysis SHALL be deep, multi-dimensional, and context-aware
- No feature may ignore or override learned master patterns without explicit user intent

### II. Creative-Flow Priority
User experience MUST follow natural creative processes, not technical constraints.

**Requirements**:
- Workflow SHALL mirror how creators actually work (ideation → draft → refine → publish)
- Technical architecture MUST serve creative flow, never dictate it
- Interface design SHALL minimize cognitive friction during creative states
- No feature may interrupt or break creative momentum for technical reasons

### III. Intelligence Over Automation
AI assists and enhances human creativity; it NEVER replaces or diminishes the creator's voice.

**Requirements**:
- All AI suggestions MUST be transparent and explainable
- Creators SHALL have final control over every creative decision
- AI SHALL adapt to creator's style, not force creators to adapt to AI
- Output MUST preserve and amplify the creator's unique voice

### IV. Multi-Media Native
Equal support for text, visual, and cinematic creation across all features.

**Requirements**:
- Features SHALL support cross-media learning (text ↔ visual ↔ cinematic)
- Style DNA MUST translate across media types
- No media type may be treated as secondary or "plugin-like"
- Export formats MUST maintain quality across all media types

### V. Professional Output Standard
Everything exported MUST meet publication-quality standards for its medium.

**Requirements**:
- Text output SHALL be manuscript-ready (formatting, typography, structure)
- Visual output SHALL be print/web-ready (resolution, color, composition)
- Cinematic output SHALL be production-ready (storyboards, scripts, vision boards)
- No feature may produce "draft only" or "preview only" output

## Article II: Technical Principles (Speckit Foundation)

### VI. Library-First Architecture
Every feature MUST begin as a standalone, reusable library.

**Requirements**:
- Libraries SHALL be self-contained with clear boundaries
- All libraries MUST be independently testable
- Libraries SHALL have comprehensive documentation
- No organizational-only libraries (must have concrete functionality)
- Maximum 3 projects for initial implementation (justify exceptions in complexity tracking)

### VII. Test-First Development (NON-NEGOTIABLE)
TDD is mandatory for all implementation.

**Process (STRICT)**:
1. Write tests defining expected behavior
2. Get tests reviewed and approved by user/reviewer
3. Verify tests FAIL (Red phase)
4. Implement feature to make tests pass (Green phase)
5. Refactor while keeping tests green (Refactor phase)

**Violations halt development immediately.**

### VIII. Integration-First Testing
Focus on real-world integration over isolated unit tests.

**Requirements**:
- Contract tests MANDATORY before implementation
- Use real databases, not mocks (PostgreSQL, MongoDB, etc.)
- Use actual AI services, not stubs (OpenAI, Anthropic APIs)
- Test with real file uploads and processing
- Integration tests SHALL cover cross-module creative workflows

### IX. Simplicity & Anti-Abstraction
Start simple, avoid premature abstraction, embrace YAGNI.

**Simplicity Gate**:
- [ ] Using ≤3 projects/services?
- [ ] No future-proofing or "might need" features?
- [ ] Direct framework usage (React, Express) without unnecessary wrappers?
- [ ] Single representation for each data model (no redundant abstractions)?

**Violations require documented justification in Complexity Tracking section.**

### X. Observability & Debugging
All features MUST be observable and debuggable.

**Requirements**:
- Structured logging for all creative operations
- API endpoints SHALL return JSON + human-readable formats
- Errors MUST include context (what masterwork, what operation, what failed)
- Creative workflow tracking (user journey from upload → creation → export)

## Article III: Technology Stack Constraints

### Stack Requirements
**Frontend**: React 18+ with TypeScript, Vite build system
**Backend**: Node.js 18+ with TypeScript, Express framework
**Database**: PostgreSQL (primary), MongoDB (document storage for masterworks)
**AI Integration**: OpenAI API (GPT-4), Anthropic API (Claude), Stable Diffusion (visuals)
**File Storage**: S3-compatible object storage (masterworks, generated content)
**Testing**: Vitest (unit), Playwright (E2E), Supertest (API)

### Forbidden Patterns
❌ Over-engineered state management (Redux, MobX) - use React Context + hooks
❌ Premature microservices - start as modular monolith
❌ Custom abstraction layers over frameworks
❌ Mock-heavy testing - use real services in test environments
❌ "Enterprise" patterns without proven need

## Article IV: Quality Standards

### Performance Requirements
- **Upload Processing**: Master document analysis completes in <30s for 500-page documents
- **AI Generation**: First response (writing assist) appears in <3s, streaming begins <1s
- **Visual Generation**: Cover designs/illustrations deliver in <15s
- **Export**: Publication-ready files generate in <10s for 300-page manuscripts

### Security & Privacy Requirements
- **Masterwork Protection**: Uploaded content NEVER leaves platform without encryption
- **API Security**: All endpoints require authentication, rate limiting enforced
- **Data Isolation**: Each creator's masterwork library is fully isolated
- **Audit Trail**: All AI operations logged for transparency and debugging

### Accessibility Requirements
- **WCAG 2.1 AA** compliance for all UI
- **Keyboard navigation** for all creative workflows
- **Screen reader** support for text-based features
- **Color contrast** meeting accessibility standards for creative tools

## Article V: Creative Learning System

### Learning Engine Requirements
Every interaction improves the platform's understanding of creative mastery.

**Requirements**:
- Pattern extraction MUST be versioned (track improvements over time)
- Style DNA database SHALL grow with each analyzed masterwork
- Cross-reference engine MUST connect patterns across media types
- Feedback loops SHALL incorporate user corrections to AI suggestions

### Style Morphing Standards
Platform MUST support blending multiple master styles coherently.

**Requirements**:
- Users SHALL specify style weights (70% King, 30% Gaiman)
- Blending SHALL preserve distinct techniques from each master
- Morphed output MUST be coherent, not a "Frankenstein" mashup
- Style conflicts SHALL be surfaced to user with resolution options

## Article VI: Development Workflow

### Feature Development Process
1. **Constitution Check**: Verify alignment with all articles
2. **Specification**: Create feature spec using `/speckit.specify`
3. **Clarification**: Run `/speckit.clarify` to resolve ambiguities
4. **Planning**: Create technical plan using `/speckit.plan`
5. **Task Breakdown**: Generate tasks using `/speckit.tasks`
6. **Implementation**: Execute using `/speckit.implement` with TDD

### Code Review Requirements
- [ ] Constitution compliance verified (all articles)
- [ ] Tests written BEFORE implementation
- [ ] Integration tests pass with real services
- [ ] Creative workflows manually tested with sample masterworks
- [ ] Performance benchmarks met
- [ ] Accessibility standards verified

### Quality Gates (Must Pass Before Merge)
1. **Tests**: All tests green (unit + integration + E2E)
2. **Performance**: Benchmarks within requirements (Article IV)
3. **Constitution**: No violations or all violations justified
4. **Documentation**: Feature spec + plan + API docs complete
5. **Creative Quality**: Manual testing with real masterworks successful

## Governance

### Constitutional Authority
This constitution supersedes all other development practices, guidelines, or preferences.

**Amendment Process**:
- Amendments require documented rationale + impact analysis
- Approval needed from project maintainers
- Backwards compatibility assessment mandatory
- Version number incremented (MAJOR for breaking changes)

### Enforcement
- All PRs/reviews MUST verify constitutional compliance
- Violations halt development until resolved or justified
- Complexity tracking MANDATORY for Simplicity Gate failures
- Creative quality takes precedence over technical convenience

### Runtime Guidance
For day-to-day development decisions not covered by constitution, consult:
1. `.specify/specs/` - Feature specifications
2. `.specify/templates/` - Planning and task templates
3. Project README - High-level architecture
4. Team discussions - Collaborative decision-making

---

**Version**: 1.0.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
