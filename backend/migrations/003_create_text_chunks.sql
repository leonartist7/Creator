-- Migration 003: Create text_chunks table
-- Knowledge Vault Module - Searchable text segments

CREATE TABLE IF NOT EXISTS text_chunks (
  id TEXT PRIMARY KEY,
  masterwork_id TEXT NOT NULL REFERENCES masterworks(id) ON DELETE CASCADE,

  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  text_content TEXT NOT NULL,
  -- SQLite doesn't support TSVECTOR, we'll use simple text search or FTS5 later
  -- text_vector TSVECTOR NOT NULL,

  word_count INTEGER NOT NULL CHECK (word_count >= 0),
  page_number INTEGER,
  location_reference TEXT,
-- Migration 003: Create text_chunks table
-- Knowledge Vault Module - Searchable text segments

CREATE TABLE IF NOT EXISTS text_chunks (
  id TEXT PRIMARY KEY,
  masterwork_id TEXT NOT NULL REFERENCES masterworks(id) ON DELETE CASCADE,

  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  text_content TEXT NOT NULL,
  -- SQLite doesn't support TSVECTOR, we'll use simple text search or FTS5 later
  -- text_vector TSVECTOR NOT NULL,

  word_count INTEGER NOT NULL CHECK (word_count >= 0),
  page_number INTEGER,
  location_reference TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_textchunk_masterwork ON text_chunks(masterwork_id);
CREATE INDEX IF NOT EXISTS idx_textchunk_order ON text_chunks(masterwork_id, chunk_index);
