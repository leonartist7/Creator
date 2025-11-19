# Implementation Plan: Knowledge Vault Module

**Branch**: `002-knowledge-vault` | **Date**: 2025-11-19 | **Spec**: [spec.md](./spec.md)

## Summary

The Knowledge Vault Module enables users to upload masterworks (books, PDFs, scripts) and extract their creative DNA for style learning. This implements "Learn from the Masters" - the platform's core differentiator.

**Technical Approach**: Document processing pipeline with file upload, text extraction (+ OCR), NLP style analysis, full-text search, and AI Studio integration. PostgreSQL for metadata, filesystem/S3 for binaries, background jobs for long operations.

## Technical Context

**Language/Version**: TypeScript (Node.js 18+) backend, React 18+ TypeScript frontend
**Primary Dependencies**:
- Backend: pdf-parse, epub-reader, mammoth, tesseract.js, natural/compromise, Bull queue
- Frontend: react-dropzone, recharts, react-query

**Storage**:
- PostgreSQL: Metadata, style profiles, text chunks
- Filesystem/S3: Binary files
- Redis: Job queue backend

**Testing**: Vitest, Playwright, Supertest, contract tests
**Target Platform**: Web (Linux server + browser)
**Project Type**: Web (existing backend + frontend)
**Performance Goals**: Upload 10MB in <30s, search in <2s, analysis in <5min, library loads <3s
**Constraints**: 50MB max file, 95% extraction accuracy, 90% search precision
**Scale/Scope**: 500 masterworks/user, 100k words/doc, concurrent uploads

## Constitution Check

### Article I: Master-First Development ✅ PASS
**Status**: Core feature - implements masterwork extraction and learning

### Article VI: Library-First Architecture ⚠️ DEFERRED
**Status**: Will build integrated first, extract libraries in Phase 4
**Justification**: Need to discover boundaries through implementation
**Plan**: Document clear interfaces for future extraction

### Article VII: Test-First Development ✅ PASS
**Status**: Full TDD workflow using existing test infrastructure

All other articles: ✅ PASS

## Project Structure

### Backend (NEW files)
```
backend/src/
├── models/
│   ├── Masterwork.ts
│   ├── StyleProfile.ts
│   └── TextChunk.ts
├── services/
│   ├── masterwork.service.ts
│   ├── extraction.service.ts
│   ├── style-analysis.service.ts
│   └── search.service.ts
├── controllers/masterwork.controller.ts
├── routes/masterwork.routes.ts
└── jobs/
    ├── extractText.job.ts
    └── analyzeStyle.job.ts
```

### Frontend (NEW files)
```
frontend/src/
├── components/
│   ├── MasterworkUpload/
│   ├── MasterworkLibrary/
│   └── StyleProfile/
├── pages/KnowledgeVault.tsx
└── services/masterwork.service.ts
```

