# Data Model: Knowledge Vault Module

**Date**: 2025-11-19
**Feature**: 002-knowledge-vault
**Database**: PostgreSQL

## Entity Relationship Diagram

```
User (existing)
  |
  |-- (1:N) --> Masterwork
  |                |
  |                |-- (1:1) --> StyleProfile
  |                |
  |                |-- (1:N) --> TextChunk
  |
  |-- (1:N) --> MasterworkUpload
```

## Entity Definitions

### Masterwork

Represents an uploaded document stored in the Knowledge Vault.

```typescript
interface Masterwork {
  id: string                    // UUID primary key
  user_id: string               // Foreign key to users table
  title: string                 // Book/document title
  author: string | null         // Author name(s)
  format: FileFormat            // PDF | EPUB | DOCX | TXT | MD
  file_size: number             // Bytes
  file_path: string             // Storage path (S3 key or filesystem path)
  cover_image_url: string | null // Thumbnail/cover URL

  // Metadata
  page_count: number | null     // Number of pages (PDFs)
  word_count: number            // Total words
  language: string              // ISO 639-1 code (e.g., 'en')
  publication_date: Date | null // When originally published
  isbn: string | null           // ISBN if available

  // User annotations
  custom_tags: string[]         // User-defined tags
  user_notes: string | null     // Personal notes
  rating: number | null         // 1-5 stars

  // Processing status
  extraction_status: ExtractionStatus // pending | processing | completed | failed
  extraction_error: string | null     // Error message if failed
  analysis_status: AnalysisStatus     // not_started | processing | completed | failed

  // Timestamps
  upload_date: Date             // When uploaded
  last_accessed: Date           // For usage tracking
  created_at: Date
  updated_at: Date
}

type FileFormat = 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD'
type ExtractionStatus = 'pending' | 'processing' | 'completed' | 'failed'
type AnalysisStatus = 'not_started' | 'processing' | 'completed' | 'failed'
```

**Indexes**:
- `idx_masterwork_user_id` on `user_id` (frequent queries by user)
- `idx_masterwork_title` on `title` (library search)
- `idx_masterwork_upload_date` on `upload_date DESC` (recent uploads)
- `idx_masterwork_tags` GIN index on `custom_tags` (tag filtering)

**Validation Rules**:
- `title` max length: 500 characters
- `author` max length: 200 characters
- `file_size` max: 52,428,800 bytes (50MB)
- `word_count` >= 0
- `rating` between 1 and 5 if provided
- `format` must be one of allowed types

### StyleProfile

Analyzed writing style metrics for a masterwork.

```typescript
interface StyleProfile {
  id: string                    // UUID primary key
  masterwork_id: string         // Foreign key to masterwork (unique)

  // Core style metrics
  avg_sentence_length: number   // Average words per sentence
  sentence_length_variance: number // Standard deviation

  vocab_complexity: number      // 0-100 score (based on word rarity)
  unique_word_ratio: number     // Unique words / total words

  avg_paragraph_length: number  // Average sentences per paragraph
  paragraph_variance: number    // Standard deviation

  dialogue_ratio: number        // Percentage of text that's dialogue (0-100)

  // Readability scores
  flesch_reading_ease: number   // 0-100 (higher = easier)
  flesch_kincaid_grade: number  // US grade level

  // Tone and style
  tone_score: number            // -1 (formal) to 1 (conversational)
  sentiment_score: number       // -1 (negative) to 1 (positive)

  // Patterns
  top_words: Record<string, number>      // Top 50 words with frequency
  top_phrases: Record<string, number>    // Top 50 n-grams with frequency
  common_sentence_patterns: string[]     // POS patterns (e.g., "DET NOUN VERB")

  // Metadata
  confidence_score: number      // 0-100 (based on text length and quality)
  analysis_date: Date
  analysis_duration_ms: number  // How long analysis took

  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `idx_styleprofile_masterwork` UNIQUE on `masterwork_id`
- `idx_styleprofile_confidence` on `confidence_score DESC` (filter low-confidence)

**Validation Rules**:
- All numeric metrics must be finite numbers
- Ratios/percentages between 0 and 100
- `confidence_score` >= 0 and <= 100
- `top_words` and `top_phrases` stored as JSONB

### TextChunk

Segmented text from a masterwork for efficient searching.

```typescript
interface TextChunk {
  id: string                    // UUID primary key
  masterwork_id: string         // Foreign key to masterwork

  chunk_index: number           // Sequential order (0, 1, 2, ...)
  text_content: string          // Actual text segment
  text_vector: any              // tsvector for full-text search (PostgreSQL type)

  word_count: number            // Words in this chunk
  page_number: number | null    // Page reference if applicable
  location_reference: string | null // "Chapter 3" or position indicator

  created_at: Date
}
```

**Chunk Strategy**:
- Split text into ~1000-word segments
- Overlap 100 words between chunks (for context continuity)
- Preserve paragraph boundaries where possible

**Indexes**:
- `idx_textchunk_masterwork` on `masterwork_id`
- `idx_textchunk_vector` GIN index on `text_vector` (full-text search)
- `idx_textchunk_order` on `(masterwork_id, chunk_index)` (ordered retrieval)

**Validation Rules**:
- `text_content` max length: 10,000 characters
- `chunk_index` >= 0
- `word_count` >= 0

### MasterworkUpload

Tracks upload progress and status (ephemeral, cleaned up after completion).

```typescript
interface MasterworkUpload {
  id: string                    // UUID primary key
  user_id: string               // Foreign key to users table

  file_name: string             // Original filename
  file_size: number             // Bytes
  format: FileFormat            // Detected file type

  status: UploadStatus          // uploading | processing | complete | failed
  progress_percentage: number   // 0-100
  error_message: string | null  // If failed

  // Temporary storage
  temp_file_path: string | null // Where file is temporarily stored

  // Becomes masterwork on completion
  masterwork_id: string | null  // Set when converted to Masterwork

  created_at: Date
  updated_at: Date
}

type UploadStatus = 'uploading' | 'processing' | 'complete' | 'failed'
```

**Indexes**:
- `idx_upload_user_status` on `(user_id, status)` (active uploads)
- `idx_upload_created` on `created_at` (cleanup old records)

**Lifecycle**:
1. Create record when upload starts
2. Update `progress_percentage` as upload progresses
3. Set `status = 'processing'` when extraction begins
4. Create `Masterwork` record and set `masterwork_id`
5. Set `status = 'complete'`
6. Delete record after 24 hours (cleanup job)

**Validation Rules**:
- `progress_percentage` between 0 and 100
- `status` transitions: uploading → processing → complete|failed

## Database Schema (SQL)

```sql
-- Masterworks table
CREATE TABLE masterworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(200),
  format VARCHAR(10) NOT NULL CHECK (format IN ('PDF', 'EPUB', 'DOCX', 'TXT', 'MD')),
  file_size BIGINT NOT NULL CHECK (file_size > 0 AND file_size <= 52428800),
  file_path TEXT NOT NULL,
  cover_image_url TEXT,

  page_count INTEGER CHECK (page_count > 0),
  word_count INTEGER NOT NULL CHECK (word_count >= 0),
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  publication_date DATE,
  isbn VARCHAR(20),

  custom_tags TEXT[] DEFAULT '{}',
  user_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  extraction_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')),
  extraction_error TEXT,
  analysis_status VARCHAR(20) NOT NULL DEFAULT 'not_started'
    CHECK (analysis_status IN ('not_started', 'processing', 'completed', 'failed')),

  upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_masterwork_user_id ON masterworks(user_id);
CREATE INDEX idx_masterwork_title ON masterworks(title);
CREATE INDEX idx_masterwork_upload_date ON masterworks(upload_date DESC);
CREATE INDEX idx_masterwork_tags ON masterworks USING GIN(custom_tags);

-- Style profiles table
CREATE TABLE style_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  masterwork_id UUID NOT NULL UNIQUE REFERENCES masterworks(id) ON DELETE CASCADE,

  avg_sentence_length DECIMAL(10,2) NOT NULL,
  sentence_length_variance DECIMAL(10,2) NOT NULL,
  vocab_complexity DECIMAL(5,2) NOT NULL CHECK (vocab_complexity >= 0 AND vocab_complexity <= 100),
  unique_word_ratio DECIMAL(5,4) NOT NULL CHECK (unique_word_ratio >= 0 AND unique_word_ratio <= 1),
  avg_paragraph_length DECIMAL(10,2) NOT NULL,
  paragraph_variance DECIMAL(10,2) NOT NULL,
  dialogue_ratio DECIMAL(5,2) NOT NULL CHECK (dialogue_ratio >= 0 AND dialogue_ratio <= 100),

  flesch_reading_ease DECIMAL(5,2) NOT NULL,
  flesch_kincaid_grade DECIMAL(5,2) NOT NULL,
  tone_score DECIMAL(5,4) NOT NULL CHECK (tone_score >= -1 AND tone_score <= 1),
  sentiment_score DECIMAL(5,4) NOT NULL CHECK (sentiment_score >= -1 AND sentiment_score <= 1),

  top_words JSONB NOT NULL,
  top_phrases JSONB NOT NULL,
  common_sentence_patterns TEXT[] DEFAULT '{}',

  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  analysis_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  analysis_duration_ms INTEGER NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_styleprofile_masterwork ON style_profiles(masterwork_id);
CREATE INDEX idx_styleprofile_confidence ON style_profiles(confidence_score DESC);

-- Text chunks table
CREATE TABLE text_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  masterwork_id UUID NOT NULL REFERENCES masterworks(id) ON DELETE CASCADE,

  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  text_content TEXT NOT NULL,
  text_vector TSVECTOR NOT NULL,

  word_count INTEGER NOT NULL CHECK (word_count >= 0),
  page_number INTEGER,
  location_reference VARCHAR(100),

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_textchunk_masterwork ON text_chunks(masterwork_id);
CREATE INDEX idx_textchunk_vector ON text_chunks USING GIN(text_vector);
CREATE INDEX idx_textchunk_order ON text_chunks(masterwork_id, chunk_index);

-- Trigger to auto-update text_vector
CREATE OR REPLACE FUNCTION update_text_vector() RETURNS TRIGGER AS $$
BEGIN
  NEW.text_vector = to_tsvector('english', NEW.text_content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER textchunk_vector_update
  BEFORE INSERT OR UPDATE OF text_content ON text_chunks
  FOR EACH ROW
  EXECUTE FUNCTION update_text_vector();

-- Masterwork uploads table (temporary tracking)
CREATE TABLE masterwork_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  format VARCHAR(10) NOT NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'uploading'
    CHECK (status IN ('uploading', 'processing', 'complete', 'failed')),
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  error_message TEXT,

  temp_file_path TEXT,
  masterwork_id UUID REFERENCES masterworks(id) ON DELETE SET NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_upload_user_status ON masterwork_uploads(user_id, status);
CREATE INDEX idx_upload_created ON masterwork_uploads(created_at);
```

## Migrations

### Migration 001: Create masterworks table
**File**: `migrations/001_create_masterworks.sql`
**Description**: Initial table creation for masterworks

### Migration 002: Create style_profiles table
**File**: `migrations/002_create_style_profiles.sql`
**Description**: Style DNA storage

### Migration 003: Create text_chunks table
**File**: `migrations/003_create_text_chunks.sql`
**Description**: Searchable text segments with full-text search

### Migration 004: Create masterwork_uploads table
**File**: `migrations/004_create_masterwork_uploads.sql`
**Description**: Upload tracking (temporary)

## Sample Data

```sql
-- Sample masterwork
INSERT INTO masterworks (id, user_id, title, author, format, file_size, file_path, word_count, language)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'user-uuid-here',
  'The Shining',
  'Stephen King',
  'PDF',
  2500000,
  '/uploads/user123/the-shining.pdf',
  119000,
  'en'
);

-- Sample style profile
INSERT INTO style_profiles (masterwork_id, avg_sentence_length, vocab_complexity, confidence_score)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  15.3,
  72.5,
  95
);
```

## State Transitions

### Masterwork Lifecycle
```
Upload → Pending Extraction → Processing → Completed/Failed
                                    ↓
                          Pending Analysis → Processing → Completed/Failed
```

### Upload Status Flow
```
Uploading (0-100%) → Processing → Complete
                              ↘ Failed
```

## Data Retention

- **Masterworks**: Retained until user deletion
- **Style Profiles**: Cascade delete with masterwork
- **Text Chunks**: Cascade delete with masterwork
- **Uploads**: Auto-delete after 24 hours if complete/failed

## Performance Considerations

- **Text chunks** partitioned by `masterwork_id` if collection grows large
- **Full-text search** uses GIN indexes for fast queries
- **JSONB** for flexible top_words/phrases storage with indexing support
- **Cascade deletes** ensure no orphaned data
