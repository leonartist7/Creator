-- ============================================================================
-- Knowledge Vault Database Setup for Supabase
-- ============================================================================
-- This file combines all migrations for easy execution in Supabase SQL Editor
-- Copy and paste this entire file into your Supabase SQL Editor and run it
-- ============================================================================

-- ============================================================================
-- Migration 001: Create masterworks table
-- ============================================================================

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

-- ============================================================================
-- Migration 002: Create style_profiles table
-- ============================================================================

CREATE TABLE IF NOT EXISTS style_profiles (
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_styleprofile_masterwork ON style_profiles(masterwork_id);
CREATE INDEX IF NOT EXISTS idx_styleprofile_confidence ON style_profiles(confidence_score DESC);

-- Trigger for auto-updating updated_at
CREATE TRIGGER styleprofiles_updated_at
  BEFORE UPDATE ON style_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Migration 003: Create text_chunks table
-- ============================================================================

CREATE TABLE IF NOT EXISTS text_chunks (
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_textchunk_masterwork ON text_chunks(masterwork_id);
CREATE INDEX IF NOT EXISTS idx_textchunk_vector ON text_chunks USING GIN(text_vector);
CREATE INDEX IF NOT EXISTS idx_textchunk_order ON text_chunks(masterwork_id, chunk_index);

-- Trigger to auto-update text_vector from text_content
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

-- ============================================================================
-- Migration 004: Create masterwork_uploads table
-- ============================================================================

CREATE TABLE IF NOT EXISTS masterwork_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,

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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_upload_user_status ON masterwork_uploads(user_id, status);
CREATE INDEX IF NOT EXISTS idx_upload_created ON masterwork_uploads(created_at);

-- Trigger for auto-updating updated_at
CREATE TRIGGER masterwork_uploads_updated_at
  BEFORE UPDATE ON masterwork_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Setup Complete!
-- ============================================================================
-- Your Knowledge Vault database is ready to use
-- All tables, indexes, and triggers have been created
-- ============================================================================
