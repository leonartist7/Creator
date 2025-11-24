-- Migration 001: Create masterworks table
-- Knowledge Vault Module - Core masterwork storage

CREATE TABLE IF NOT EXISTS masterworks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  format TEXT NOT NULL CHECK (format IN ('PDF', 'EPUB', 'DOCX', 'TXT', 'MD')),
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  cover_image_url TEXT,

  page_count INTEGER,
  word_count INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  publication_date TEXT,
  isbn TEXT,

  custom_tags TEXT DEFAULT '[]',
  user_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  extraction_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')),
  extraction_error TEXT,
  analysis_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (analysis_status IN ('not_started', 'processing', 'completed', 'failed')),

  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_masterwork_user_id ON masterworks(user_id);
CREATE INDEX IF NOT EXISTS idx_masterwork_title ON masterworks(title);
CREATE INDEX IF NOT EXISTS idx_masterwork_upload_date ON masterworks(upload_date DESC);
-- SQLite doesn't support GIN indexes or array columns natively like Postgres
-- We'll handle tags as JSON string in application logic

