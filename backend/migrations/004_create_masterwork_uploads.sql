-- Migration 004: Create masterwork_uploads table
-- Knowledge Vault Module - Upload progress tracking (temporary)

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
