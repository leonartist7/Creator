# Research & Technology Decisions: Knowledge Vault Module

**Date**: 2025-11-19
**Feature**: 002-knowledge-vault

## Technology Choices

### 1. PDF Text Extraction

**Decision**: Use `pdf-parse` library for Node.js

**Rationale**:
- Pure JavaScript implementation (no native dependencies)
- Reliable extraction for standard text-based PDFs
- Handles metadata extraction (title, author, page count)
- Widely used with 1M+ weekly downloads
- MIT licensed

**Alternatives Considered**:
- `pdfjs-dist` (Mozilla's PDF.js): More complex API, heavier dependency
- `pdf2json`: Less maintained, older codebase
- External services (Adobe PDF Services): Adds cost and latency

### 2. OCR for Scanned PDFs

**Decision**: Use `tesseract.js` for image-based PDF processing

**Rationale**:
- WebAssembly-based Tesseract OCR engine
- Works in Node.js and browsers
- Supports 100+ languages
- No external API costs
- Acceptable accuracy (85%+) for most scanned documents

**Alternatives Considered**:
- Google Cloud Vision API: Expensive at scale ($1.50 per 1000 pages)
- AWS Textract: Better accuracy but significant cost
- Azure Computer Vision: Similar cost/accuracy tradeoff

### 3. EPUB Parsing

**Decision**: Use `epub` npm package

**Rationale**:
- Dedicated EPUB parser
- Extracts metadata and content
- Handles EPUB2 and EPUB3 formats
- Simple API

**Alternatives Considered**:
- `epub-parser`: Less maintained
- Manual ZIP + XML parsing: Too complex, reinventing wheel

### 4. DOCX Parsing

**Decision**: Use `mammoth` library

**Rationale**:
- Converts DOCX to clean HTML/text
- Preserves formatting structure
- Actively maintained by UK Government Digital Service
- Handles complex Office documents

**Alternatives Considered**:
- `docx`: Focuses on generation, not parsing
- `officegen`: More for creation than extraction

### 5. NLP and Style Analysis

**Decision**: Use `natural` + `compromise` libraries

**Rationale**:
- `natural`: Tokenization, stemming, TF-IDF, sentiment
- `compromise`: Fast, lightweight NLP (sentence parsing, POS tagging)
- Combined: Powerful analysis without heavy ML models
- No external API calls (privacy, cost)
- Runs fully on backend

**Style Metrics Implementation**:
- **Sentence length**: Parse sentences with `compromise`, calculate statistics
- **Vocabulary complexity**: TF-IDF scoring with `natural`
- **Readability**: Flesch-Kincaid implementation
- **Dialogue ratio**: Regex + compromise POS tagging to identify dialogue
- **Tone analysis**: Sentiment scoring with natural
- **Top phrases**: N-gram extraction and frequency counting

**Alternatives Considered**:
- OpenAI API for style analysis: Too expensive at scale ($0.002 per 1k tokens × millions of tokens)
- spaCy (Python): Would require Python service, adds complexity
- Cloud NLP (Google/AWS): Cost prohibitive for all masterwork analysis

### 6. Background Job Processing

**Decision**: Use `Bull` job queue with Redis

**Rationale**:
- Reliable job processing for long-running tasks (OCR, style analysis)
- Built on Redis (already planned for caching)
- Retry logic, job prioritization, progress tracking
- Dashboard for monitoring (`bull-board`)
- Handles concurrent processing

**Alternatives Considered**:
- `Agenda` (MongoDB-based): Would require MongoDB for just jobs
- `BullMQ` (Bull v4): Less mature, similar features
- `node-cron`: Too simple for complex job management

### 7. File Storage

**Decision**: Abstraction layer supporting local filesystem and S3

**Rationale**:
- Start with local filesystem (simple, fast for development)
- Easy migration to S3 for production scale
- Abstraction allows swapping without code changes
- S3-compatible APIs (Minio, DigitalOcean Spaces) also work

**Implementation**: Create `file-storage.ts` utility with interface:
```typescript
interface FileStorage {
  upload(file: Buffer, path: string): Promise<string>
  download(path: string): Promise<Buffer>
  delete(path: string): Promise<void>
  getUrl(path: string): string
}
```

**Alternatives Considered**:
- Only local filesystem: Doesn't scale for production
- Only S3: Too complex for dev environment
- Database blob storage: Poor performance for large files

### 8. Full-Text Search

**Decision**: PostgreSQL full-text search with `tsvector`

**Rationale**:
- Already using PostgreSQL
- Built-in full-text search capabilities
- Good performance for 500+ documents
- No additional infrastructure
- Supports ranking and highlighting

**Implementation**:
- Store text in `text_chunks` table
- Create `tsvector` column with GIN index
- Use `ts_rank` for relevance scoring
- Trigram similarity for fuzzy matching

**Alternatives Considered**:
- Elasticsearch: Overkill for initial scale, adds infrastructure complexity
- Algolia: External service, ongoing costs
- Simple SQL `LIKE`: Too slow, no relevance ranking

### 9. Cover Image Extraction

**Decision**: Use `pdf-thumbnail` for PDF cover generation

**Rationale**:
- Generates image from first page of PDF
- Simple API
- Fallback: generic icon for text-only formats

**Alternatives Considered**:
- Embedded cover images in EPUB: Only works for EPUBs
- External service (Cloudinary): Unnecessary for simple thumbnails

## Performance Optimization Strategies

### Upload Processing
- **Streaming uploads**: Use `multer` with disk storage for large files
- **Parallel processing**: Extract metadata while uploading binary
- **Progress tracking**: Update upload progress in Redis

### Text Extraction
- **Chunked processing**: Break large documents into pages for parallel extraction
- **Caching**: Store extracted text to avoid re-extraction
- **Background jobs**: Move OCR to job queue (CPU-intensive)

### Style Analysis
- **Incremental analysis**: Analyze first 50k words, then full document
- **Sampling for previews**: Quick analysis on 10% sample for instant preview
- **Caching computed metrics**: Store analysis results, don't recompute

### Search
- **Indexed columns**: GIN index on tsvector columns
- **Pagination**: Limit results to 50 per page
- **Lazy loading**: Load library view incrementally

## Security Considerations

### File Upload
- **Virus scanning**: Integrate ClamAV or VirusTotal API for uploaded files
- **File type validation**: Verify actual file type, not just extension
- **Size limits**: Enforce 50MB max at middleware level
- **User quotas**: Limit total storage per user (e.g., 25GB)

### Text Extraction
- **Timeout protection**: Kill extraction jobs after 5 minutes
- **Sandboxing**: Run OCR in isolated process
- **Resource limits**: Cap memory usage for extraction

### Privacy
- **Encryption at rest**: Encrypt binary files if using S3
- **Access control**: Users can only access their own masterworks
- **No cross-user sharing**: Private by default

## Scalability Plan

### Phase 1 (MVP - 100 users)
- Local filesystem or small S3 bucket
- PostgreSQL on single server
- Redis on same server
- Single background worker

### Phase 2 (Growth - 1000 users)
- S3 for all file storage
- PostgreSQL with replication
- Dedicated Redis instance
- Multiple background workers (horizontal scaling)

### Phase 3 (Scale - 10k+ users)
- CDN for cover images
- PostgreSQL sharding by user
- Redis cluster
- Auto-scaling worker pool
- Consider Elasticsearch if search performance degrades

## Open Questions & Future Research

### Answered During Planning
- ✅ OCR vs. External API: Tesseract.js chosen for cost/privacy
- ✅ NLP library selection: Natural + Compromise for full control
- ✅ Search engine: PostgreSQL FTS sufficient for initial scale

### Deferred to Implementation
- 🔄 Exact NLP pipeline for style DNA: Will iterate during TDD
- 🔄 Search ranking algorithm tuning: Depends on real data
- 🔄 Worker pool size: Tune based on load testing

### Future Enhancements
- Advanced NLP: Named entity recognition, theme extraction
- Multi-language support: Language-specific NLP models
- Collaborative features: Share style profiles between users
- Visual masterworks: Image analysis for art/film screenshots

## Dependency Installation

```bash
# Backend dependencies
npm install --save pdf-parse epub mammoth tesseract.js natural compromise bull ioredis multer

# Dev dependencies
npm install --save-dev @types/pdf-parse @types/natural @types/bull
```

## References

- pdf-parse: https://www.npmjs.com/package/pdf-parse
- tesseract.js: https://tesseract.projectnaptha.com/
- natural: https://github.com/NaturalNode/natural
- compromise: https://github.com/spencermountain/compromise
- Bull: https://github.com/OptimalBits/bull
- PostgreSQL FTS: https://www.postgresql.org/docs/current/textsearch.html
