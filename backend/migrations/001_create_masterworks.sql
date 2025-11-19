-- Migration 001: Create masterworks table
-- Knowledge Vault Module - Core masterwork storage

CREATE TABLE IF NOT EXISTS masterworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_masterwork_user_id ON masterworks(user_id);
CREATE INDEX IF NOT EXISTS idx_masterwork_title ON masterworks(title);
CREATE INDEX IF NOT EXISTS idx_masterwork_upload_date ON masterworks(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_masterwork_tags ON masterworks USING GIN(custom_tags);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER masterworks_updated_at
  BEFORE UPDATE ON masterworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
