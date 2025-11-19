-- Migration 002: Create style_profiles table
-- Knowledge Vault Module - Style DNA storage

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
