-- Migration 002: Create style_profiles table
-- Knowledge Vault Module - Style DNA storage

CREATE TABLE IF NOT EXISTS style_profiles (
  id TEXT PRIMARY KEY,
  masterwork_id TEXT NOT NULL UNIQUE REFERENCES masterworks(id) ON DELETE CASCADE,

  avg_sentence_length REAL NOT NULL,
  sentence_length_variance REAL NOT NULL,
  vocab_complexity REAL NOT NULL CHECK (vocab_complexity >= 0 AND vocab_complexity <= 100),
  unique_word_ratio REAL NOT NULL CHECK (unique_word_ratio >= 0 AND unique_word_ratio <= 1),
  avg_paragraph_length REAL NOT NULL,
  paragraph_variance REAL NOT NULL,
  dialogue_ratio REAL NOT NULL CHECK (dialogue_ratio >= 0 AND dialogue_ratio <= 100),

  flesch_reading_ease REAL NOT NULL,
  flesch_kincaid_grade REAL NOT NULL,
  tone_score REAL NOT NULL CHECK (tone_score >= -1 AND tone_score <= 1),
  sentiment_score REAL NOT NULL CHECK (sentiment_score >= -1 AND sentiment_score <= 1),

  top_words TEXT NOT NULL,
  top_phrases TEXT NOT NULL,
  common_sentence_patterns TEXT DEFAULT '[]',

  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  analysis_duration_ms INTEGER NOT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- Migration 002: Create style_profiles table
-- Knowledge Vault Module - Style DNA storage

CREATE TABLE IF NOT EXISTS style_profiles (
  id TEXT PRIMARY KEY,
  masterwork_id TEXT NOT NULL UNIQUE REFERENCES masterworks(id) ON DELETE CASCADE,

  avg_sentence_length REAL NOT NULL,
  sentence_length_variance REAL NOT NULL,
  vocab_complexity REAL NOT NULL CHECK (vocab_complexity >= 0 AND vocab_complexity <= 100),
  unique_word_ratio REAL NOT NULL CHECK (unique_word_ratio >= 0 AND unique_word_ratio <= 1),
  avg_paragraph_length REAL NOT NULL,
  paragraph_variance REAL NOT NULL,
  dialogue_ratio REAL NOT NULL CHECK (dialogue_ratio >= 0 AND dialogue_ratio <= 100),

  flesch_reading_ease REAL NOT NULL,
  flesch_kincaid_grade REAL NOT NULL,
  tone_score REAL NOT NULL CHECK (tone_score >= -1 AND tone_score <= 1),
  sentiment_score REAL NOT NULL CHECK (sentiment_score >= -1 AND sentiment_score <= 1),

  top_words TEXT NOT NULL,
  top_phrases TEXT NOT NULL,
  common_sentence_patterns TEXT DEFAULT '[]',

  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  analysis_duration_ms INTEGER NOT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_styleprofile_masterwork ON style_profiles(masterwork_id);
CREATE INDEX IF NOT EXISTS idx_styleprofile_confidence ON style_profiles(confidence_score DESC);
