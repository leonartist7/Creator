-- Migration 003: Create text_chunks table
-- Knowledge Vault Module - Searchable text segments

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
