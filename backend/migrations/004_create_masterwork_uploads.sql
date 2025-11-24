-- Trigger for auto-updating updated_at
CREATE TRIGGER masterwork_uploads_updated_at
  BEFORE UPDATE ON masterwork_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
