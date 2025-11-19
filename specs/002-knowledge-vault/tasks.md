# Implementation Tasks: Knowledge Vault Module

**Feature**: 002-knowledge-vault
**Branch**: `002-knowledge-vault`
**Total Tasks**: 120 tasks
**Estimated Time**: 60-80 hours

## Task Summary

- **Phase 1 (Setup)**: 15 tasks - Project initialization (3-5 hours)
- **Phase 2 (Foundation)**: 10 tasks - Blocking prerequisites (4-6 hours)
- **Phase 3 (US1 - Upload)**: 20 tasks - P1: Upload masterwork documents (8-12 hours)
- **Phase 4 (US2 - Library)**: 18 tasks - P2: View and manage library (8-10 hours)
- **Phase 5 (US3 - Extraction)**: 20 tasks - P3: Extract text and metadata (10-14 hours)
- **Phase 6 (US4 - Style DNA)**: 25 tasks - P4: Generate style DNA profiles (14-18 hours)
- **Phase 7 (US5 - Search)**: 18 tasks - P5: Search masterwork content (8-10 hours)
- **Phase 8 (US6 - AI Integration)**: 10 tasks - P6: Use style profiles in AI Writing (4-6 hours)
- **Phase 9 (Polish)**: 4 tasks - Cross-cutting concerns (2-3 hours)

## Dependencies

### User Story Completion Order
```
Setup (Phase 1)
     ↓
Foundation (Phase 2)
     ↓
US1 (Upload) → US2 (Library) → US3 (Extraction) → US4 (Style DNA) → US5 (Search)
                                                                          ↓
                                                          US6 (AI Integration)
```

**Independent Stories**: US2, US5, US6 can be developed in parallel after their prerequisites

## Implementation Strategy

**MVP**: Phase 1-3 (US1: Upload) delivers working upload + storage system
**First Release**: Phases 1-4 (US1-US2) delivers complete library management
**Core Value**: Phases 1-6 (US1-US4) delivers style DNA extraction (differentiator)
**Full Feature**: All phases

---

## Phase 1: Setup (3-5 hours)

**Goal**: Initialize project structure and install dependencies

- [ ] T001 Install backend dependencies: `npm install pdf-parse epub mammoth tesseract.js natural compromise bull ioredis multer`
- [ ] T002 Install backend dev dependencies: `npm install --save-dev @types/pdf-parse @types/natural @types/bull @types/multer`
- [ ] T003 Install frontend dependencies: `npm install react-dropzone recharts react-query`
- [ ] T004 Create uploads directory: `mkdir -p backend/uploads && touch backend/uploads/.gitkeep`
- [ ] T005 Add uploads to .gitignore: `echo "backend/uploads/*\n!backend/uploads/.gitkeep" >> .gitignore`
- [ ] T006 Update backend/.env with Redis, file storage config
- [ ] T007 Update frontend/.env with max upload size config
- [ ] T008 Create database migrations directory: `mkdir -p backend/migrations`
- [ ] T009 Create migration 001_create_masterworks.sql from data-model.md
- [ ] T010 Create migration 002_create_style_profiles.sql from data-model.md
- [ ] T011 Create migration 003_create_text_chunks.sql from data-model.md
- [ ] T012 Create migration 004_create_masterwork_uploads.sql from data-model.md
- [ ] T013 [P] Run all database migrations
- [ ] T014 [P] Start Redis server and verify connection
- [ ] T015 [P] Create test fixtures in tests/fixtures/masterworks.ts

---

## Phase 2: Foundation (4-6 hours)

**Goal**: Shared infrastructure needed by all user stories

- [ ] T016 Create Masterwork model in backend/src/models/Masterwork.ts
- [ ] T017 Create StyleProfile model in backend/src/models/StyleProfile.ts
- [ ] T018 Create TextChunk model in backend/src/models/TextChunk.ts
- [ ] T019 Create MasterworkUpload model in backend/src/models/MasterworkUpload.ts
- [ ] T020 Create FileStorage utility in backend/src/utils/file-storage.ts (supports local and S3)
- [ ] T021 Configure Bull job queue in backend/src/config/bull.ts
- [ ] T022 [P] Write unit tests for FileStorage utility
- [ ] T023 [P] Write unit tests for Masterwork model validation
- [ ] T024 [P] Add TypeScript types in frontend/src/types/masterwork.types.ts
- [ ] T025 Create API client in frontend/src/services/masterwork.service.ts

---

## Phase 3: User Story 1 - Upload Masterwork Documents (P1) (8-12 hours)

**Story Goal**: Users can upload PDF, EPUB, DOCX, TXT, MD files to their Knowledge Vault

**Independent Test**: Upload various file formats and verify stored in database with basic metadata

### Tests (TDD Red Phase)
- [ ] T026 [P] [US1] Write API test: POST /api/masterworks/upload with PDF file
- [ ] T027 [P] [US1] Write API test: Upload with invalid file type (should fail)
- [ ] T028 [P] [US1] Write API test: Upload file > 50MB (should fail)
- [ ] T029 [P] [US1] Write unit test: File validation service accepts valid formats
- [ ] T030 [P] [US1] Write unit test: File validation rejects oversized files

### Implementation (TDD Green Phase)
- [ ] T031 [US1] Create UploadService in backend/src/services/upload.service.ts (file validation)
- [ ] T032 [US1] Create MasterworkService in backend/src/services/masterwork.service.ts (business logic)
- [ ] T033 [US1] Create MetadataExtractor utility in backend/src/utils/metadata-extractor.ts
- [ ] T034 [US1] Implement PDF metadata extraction using pdf-parse
- [ ] T035 [US1] Implement EPUB metadata extraction using epub
- [ ] T036 [US1] Implement DOCX metadata extraction using mammoth
- [ ] T037 [US1] Create upload routes in backend/src/routes/masterwork.routes.ts
- [ ] T038 [US1] Create MasterworkController in backend/src/controllers/masterwork.controller.ts
- [ ] T039 [US1] Implement POST /upload endpoint with Multer middleware
- [ ] T040 [US1] Create upload tracking (MasterworkUpload record creation)
- [ ] T041 [US1] Implement progress updates using Redis pub/sub

### Frontend
- [ ] T042 [P] [US1] Create MasterworkUpload component in frontend/src/components/MasterworkUpload/MasterworkUpload.tsx
- [ ] T043 [P] [US1] Create UploadProgress component in frontend/src/components/MasterworkUpload/UploadProgress.tsx
- [ ] T044 [P] [US1] Implement drag-drop using react-dropzone
- [ ] T045 [P] [US1] Add file type validation on frontend

---

## Phase 4: User Story 2 - View and Manage Library (P2) (8-10 hours)

**Story Goal**: Users can browse, organize, and manage their uploaded masterworks

**Independent Test**: Upload multiple documents and verify library view with sorting, filtering, tagging

### Tests (TDD Red Phase)
- [ ] T046 [P] [US2] Write API test: GET /api/masterworks returns paginated list
- [ ] T047 [P] [US2] Write API test: GET /api/masterworks?tag=thriller filters by tag
- [ ] T048 [P] [US2] Write API test: PATCH /api/masterworks/:id updates metadata
- [ ] T049 [P] [US2] Write API test: DELETE /api/masterworks/:id deletes masterwork
- [ ] T050 [P] [US2] Write component test: MasterworkLibrary renders grid view

### Implementation (TDD Green Phase)
- [ ] T051 [US2] Implement GET /masterworks endpoint (list with pagination)
- [ ] T052 [US2] Add sorting logic (title, author, date, word count)
- [ ] T053 [US2] Add filtering logic (tags, format, status)
- [ ] T054 [US2] Implement GET /masterworks/:id endpoint (detail view)
- [ ] T055 [US2] Implement PATCH /masterworks/:id endpoint (update metadata)
- [ ] T056 [US2] Implement DELETE /masterworks/:id endpoint (with confirmation)

### Frontend
- [ ] T057 [P] [US2] Create MasterworkLibrary component in frontend/src/components/MasterworkLibrary/MasterworkLibrary.tsx
- [ ] T058 [P] [US2] Create MasterworkCard component for grid/list items
- [ ] T059 [P] [US2] Create LibraryFilters component (tags, format, sort)
- [ ] T060 [P] [US2] Create LibrarySearch component (title/author search)
- [ ] T061 [P] [US2] Create KnowledgeVault page in frontend/src/pages/KnowledgeVault.tsx
- [ ] T062 [P] [US2] Implement useMasterworks hook for data fetching
- [ ] T063 [P] [US2] Add pagination controls to library view

---

## Phase 5: User Story 3 - Extract Text and Metadata (P3) (10-14 hours)

**Story Goal**: System automatically extracts readable text from uploaded documents

**Independent Test**: Upload documents and verify extracted text is searchable and accurate

### Tests (TDD Red Phase)
- [ ] T064 [P] [US3] Write unit test: PDF text extraction with pdf-parse
- [ ] T065 [P] [US3] Write unit test: EPUB text extraction
- [ ] T066 [P] [US3] Write unit test: DOCX text extraction
- [ ] T067 [P] [US3] Write unit test: OCR extraction for scanned PDF
- [ ] T068 [P] [US3] Write integration test: Background extraction job completes successfully

### Implementation (TDD Green Phase)
- [ ] T069 [US3] Create ExtractionService in backend/src/services/extraction.service.ts
- [ ] T070 [US3] Implement PDF text extraction using pdf-parse
- [ ] T071 [US3] Implement EPUB text extraction using epub package
- [ ] T072 [US3] Implement DOCX text extraction using mammoth
- [ ] T073 [US3] Implement TXT/MD text extraction (direct read)
- [ ] T074 [US3] Create OCRService in backend/src/services/ocr.service.ts
- [ ] T075 [US3] Implement OCR using tesseract.js for image-based PDFs
- [ ] T076 [US3] Implement language detection
- [ ] T077 [US3] Create text chunking logic (1000 words with 100-word overlap)
- [ ] T078 [US3] Store extracted text in TextChunk table with tsvector
- [ ] T079 [US3] Create extractText background job in backend/src/jobs/extractText.job.ts
- [ ] T080 [US3] Integrate job with Bull queue (trigger after upload)
- [ ] T081 [US3] Add job progress tracking and error handling
- [ ] T082 [US3] Update Masterwork extraction_status during processing
- [ ] T083 [P] [US3] Create status indicator UI showing extraction progress

---

## Phase 6: User Story 4 - Generate Style DNA Profile (P4) (14-18 hours)

**Story Goal**: Analyze masterwork and create style profile with writing patterns

**Independent Test**: Analyze uploaded masterwork and verify style profile contains accurate metrics

### Tests (TDD Red Phase)
- [ ] T084 [P] [US4] Write unit test: Calculate average sentence length
- [ ] T085 [P] [US4] Write unit test: Calculate vocabulary complexity score
- [ ] T086 [P] [US4] Write unit test: Identify dialogue ratio
- [ ] T087 [P] [US4] Write unit test: Calculate Flesch reading ease
- [ ] T088 [P] [US4] Write integration test: Full style analysis pipeline
- [ ] T089 [P] [US4] Write API test: POST /masterworks/:id/analyze starts analysis
- [ ] T090 [P] [US4] Write API test: GET /masterworks/:id/style-profile returns profile

### Implementation (TDD Green Phase)
- [ ] T091 [US4] Create StyleAnalysisService in backend/src/services/style-analysis.service.ts
- [ ] T092 [US4] Implement sentence length analysis using compromise
- [ ] T093 [US4] Implement vocabulary complexity using natural (TF-IDF)
- [ ] T094 [US4] Implement paragraph length analysis
- [ ] T095 [US4] Implement dialogue detection (regex + POS tagging)
- [ ] T096 [US4] Implement Flesch-Kincaid readability scores
- [ ] T097 [US4] Implement tone analysis (formal vs conversational)
- [ ] T098 [US4] Implement sentiment analysis using natural
- [ ] T099 [US4] Extract top words and phrases (n-grams)
- [ ] T100 [US4] Identify common sentence patterns (POS patterns)
- [ ] T101 [US4] Calculate confidence score based on text length
- [ ] T102 [US4] Store StyleProfile in database
- [ ] T103 [US4] Create analyzeStyle background job in backend/src/jobs/analyzeStyle.job.ts
- [ ] T104 [US4] Implement POST /masterworks/:id/analyze endpoint
- [ ] T105 [US4] Implement GET /masterworks/:id/style-profile endpoint
- [ ] T106 [US4] Implement GET /masterworks/:id/compare endpoint (compare two profiles)

### Frontend
- [ ] T107 [P] [US4] Create StyleProfileView component in frontend/src/components/StyleProfile/StyleProfileView.tsx
- [ ] T108 [P] [US4] Create StyleCharts component with recharts visualizations

---

## Phase 7: User Story 5 - Search Masterwork Content (P5) (8-10 hours)

**Story Goal**: Full-text search across all masterworks with highlighted results

**Independent Test**: Search for known quotes/phrases and verify accurate results with context

### Tests (TDD Red Phase)
- [ ] T109 [P] [US5] Write API test: GET /masterworks/search returns matching passages
- [ ] T110 [P] [US5] Write API test: Search with masterwork_id filter
- [ ] T111 [P] [US5] Write unit test: PostgreSQL full-text search query builder
- [ ] T112 [P] [US5] Write unit test: Search result highlighting

### Implementation (TDD Green Phase)
- [ ] T113 [US5] Create SearchService in backend/src/services/search.service.ts
- [ ] T114 [US5] Implement PostgreSQL full-text search using tsvector
- [ ] T115 [US5] Implement relevance ranking with ts_rank
- [ ] T116 [US5] Implement search result highlighting (snippet generation)
- [ ] T117 [US5] Implement pagination for search results
- [ ] T118 [US5] Add masterwork-specific filtering
- [ ] T119 [US5] Implement GET /masterworks/search endpoint

### Frontend
- [ ] T120 [P] [US5] Create SearchInterface component in frontend/src/components/MasterworkSearch/SearchInterface.tsx
- [ ] T121 [P] [US5] Create SearchResults component with highlighted snippets
- [ ] T122 [P] [US5] Create SearchFilters component (masterwork selection)
- [ ] T123 [P] [US5] Implement real-time search (debounced)
- [ ] T124 [P] [US5] Add keyboard navigation for search results
- [ ] T125 [P] [US5] Integrate search into library view and detail page
- [ ] T126 [P] [US5] Add "Search across all masterworks" global search

---

## Phase 8: User Story 6 - AI Integration (P6) (4-6 hours)

**Story Goal**: Apply style profiles when using AI Writing Studio

**Independent Test**: Generate AI content with/without style profile and compare outputs

### Tests (TDD Red Phase)
- [ ] T127 [P] [US6] Write integration test: AI generation with style profile applied
- [ ] T128 [P] [US6] Write API test: Style profile influences AI output

### Implementation (TDD Green Phase)
- [ ] T129 [US6] Modify AI Writing Studio to accept style profile parameter
- [ ] T130 [US6] Implement style prompt generation from StyleProfile
- [ ] T131 [US6] Add style strength slider (0-100%) to AI generation
- [ ] T132 [US6] Integrate with existing AI service (OpenAI/Anthropic)
- [ ] T133 [US6] Test style mimicry accuracy

### Frontend
- [ ] T134 [P] [US6] Add "Apply Master Style" button to AI Writing Studio
- [ ] T135 [P] [US6] Create style selector dropdown (list masterworks)
- [ ] T136 [P] [US6] Add style strength slider
- [ ] T137 [P] [US6] Show style profile preview when selected

---

## Phase 9: Polish & Cross-Cutting Concerns (2-3 hours)

- [ ] T138 [P] Add comprehensive error handling and logging
- [ ] T139 [P] Implement rate limiting for upload endpoint
- [ ] T140 [P] Add E2E tests for complete upload → analysis → search → AI workflow
- [ ] T141 [P] Update documentation in docs/ with Knowledge Vault usage guide

---

## Parallel Execution Opportunities

### Per User Story:
- **US1 (Upload)**: T026-T030 (tests), T042-T045 (frontend) can run parallel
- **US2 (Library)**: T046-T050 (tests), T057-T063 (frontend) can run parallel
- **US3 (Extraction)**: T064-T068 (tests) can run parallel with T070-T075 (extraction implementations)
- **US4 (Style DNA)**: T084-T090 (tests), T092-T100 (analysis metrics) can run parallel
- **US5 (Search)**: T109-T112 (tests), T120-T127 (frontend) can run parallel
- **US6 (AI Integration)**: T127-T128 (tests), T134-T137 (frontend) can run parallel

### Across User Stories:
- US2 (Library) frontend can develop in parallel with US1 backend
- US5 (Search) can develop in parallel with US4 (Style DNA) after US3 complete
- US6 (AI Integration) can develop in parallel with US5

---

## Time Estimates

**Total**: 60-80 hours for complete implementation
**MVP (US1)**: 11-17 hours
**Core Value (US1-US4)**: 41-55 hours
**Full Feature**: 60-80 hours

**Note**: Estimates include TDD workflow (tests + implementation + refactor)
