# Quickstart: Knowledge Vault Module Development

**Feature**: 002-knowledge-vault
**Branch**: `002-knowledge-vault`
**Prerequisites**: Node.js 18+, PostgreSQL, Redis

## Initial Setup

### 1. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install pdf-parse epub mammoth tesseract.js natural compromise bull ioredis multer

# Dev dependencies
npm install --save-dev @types/pdf-parse @types/natural @types/bull @types/multer

# Frontend dependencies
cd ../frontend
npm install react-dropzone recharts react-query

# Return to root
cd ..
```

### 2. Database Setup

```bash
# Create PostgreSQL database (if needed)
createdb creative_mastery_dev

# Run migrations (once created)
cd backend
npm run migrate

# Or manually:
psql -d creative_mastery_dev -f migrations/001_create_masterworks.sql
psql -d creative_mastery_dev -f migrations/002_create_style_profiles.sql
psql -d creative_mastery_dev -f migrations/003_create_text_chunks.sql
psql -d creative_mastery_dev -f migrations/004_create_masterwork_uploads.sql
```

### 3. Redis Setup

```bash
# Install Redis (if not already installed)
# macOS:
brew install redis
brew services start redis

# Linux:
sudo apt-get install redis-server
sudo systemctl start redis

# Verify running:
redis-cli ping
# Should return: PONG
```

### 4. Environment Variables

Add to `backend/.env`:

```bash
# Existing variables
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/creative_mastery_dev
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# New for Knowledge Vault
REDIS_URL=redis://localhost:6379
FILE_STORAGE_TYPE=local  # or 's3'
FILE_STORAGE_PATH=./uploads  # Local storage path
MAX_FILE_SIZE=52428800  # 50MB in bytes

# For S3 (if using)
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_S3_BUCKET=creative-mastery-uploads
# AWS_REGION=us-east-1
```

Add to `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3001
VITE_MAX_UPLOAD_SIZE=50  # MB
```

### 5. Create Upload Directory

```bash
# For local file storage
mkdir -p backend/uploads
chmod 755 backend/uploads

# Add to .gitignore
echo "backend/uploads/*" >> .gitignore
echo "!backend/uploads/.gitkeep" >> .gitignore
touch backend/uploads/.gitkeep
```

## Development Workflow (TDD)

### RED: Write Failing Tests First

```bash
# Example: Testing file upload service
cat > backend/tests/unit/services/upload.service.test.ts << 'EOF'
import { describe, it, expect, beforeEach } from 'vitest'
import { UploadService } from '../../../src/services/upload.service'

describe('UploadService', () => {
  let uploadService: UploadService

  beforeEach(() => {
    uploadService = new UploadService()
  })

  it('should accept PDF files', async () => {
    const file = {
      buffer: Buffer.from('PDF content'),
      mimetype: 'application/pdf',
      originalname: 'test.pdf',
      size: 1000
    }

    const result = await uploadService.validateFile(file)
    expect(result.valid).toBe(true)
  })

  it('should reject files over 50MB', async () => {
    const file = {
      buffer: Buffer.from(''),
      mimetype: 'application/pdf',
      originalname: 'large.pdf',
      size: 60000000 // 60MB
    }

    const result = await uploadService.validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('File too large')
  })
})
EOF

# Run tests (should FAIL - RED phase)
npm test -- upload.service.test.ts
```

### GREEN: Implement to Pass Tests

```bash
# Create the service
cat > backend/src/services/upload.service.ts << 'EOF'
export class UploadService {
  private readonly MAX_FILE_SIZE = 52428800 // 50MB
  private readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/epub+zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ]

  async validateFile(file: Express.Multer.File) {
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File too large (max 50MB)' }
    }

    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      return { valid: false, error: 'Unsupported file type' }
    }

    return { valid: true }
  }
}
EOF

# Run tests (should PASS - GREEN phase)
npm test -- upload.service.test.ts
```

### REFACTOR: Improve While Tests Pass

```bash
# Extract constants, improve error messages, etc.
# Re-run tests after each change to ensure GREEN
```

## Running the Application

### Start Backend

```bash
cd backend

# Development mode with auto-reload
npm run dev

# Or with Bull dashboard (job monitoring)
npm run dev:with-dashboard

# Backend runs on http://localhost:3001
```

### Start Frontend

```bash
cd frontend

# Development mode
npm run dev

# Frontend runs on http://localhost:5173
```

### Start Background Workers

```bash
cd backend

# In separate terminal
npm run worker

# This processes background jobs:
# - Text extraction
# - OCR processing
# - Style analysis
```

## Testing

### Unit Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npm test -- masterwork.service.test.ts

# Watch mode
npm run test:watch
```

### Integration Tests

```bash
# Run API integration tests
npm run test:integration

# Requires PostgreSQL and Redis running
```

### E2E Tests

```bash
# Run Playwright E2E tests
npm run test:e2e

# With UI
npm run test:e2e:ui

# Requires frontend and backend running
```

### Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

## Common Development Tasks

### Test File Upload

```bash
# Using curl
curl -X POST http://localhost:3001/api/masterworks/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/book.pdf" \
  -F "title=Test Book" \
  -F "author=Test Author"
```

### Monitor Background Jobs

```bash
# Access Bull dashboard
open http://localhost:3001/admin/queues

# Or use Redis CLI
redis-cli
> KEYS bull:*
> HGETALL bull:extraction:1
```

### Query Database

```bash
# Connect to PostgreSQL
psql -d creative_mastery_dev

# Useful queries
SELECT id, title, extraction_status, analysis_status FROM masterworks;
SELECT * FROM style_profiles WHERE confidence_score > 80;
SELECT COUNT(*) FROM text_chunks GROUP BY masterwork_id;
```

### Clear Test Data

```bash
# Delete all test masterworks
psql -d creative_mastery_dev -c "DELETE FROM masterworks WHERE title LIKE 'Test%';"

# Clear uploads directory
rm -rf backend/uploads/*
touch backend/uploads/.gitkeep

# Clear Redis jobs
redis-cli FLUSHDB
```

## Debugging

### Enable Debug Logs

```bash
# Backend
export DEBUG=app:*,bull:*
npm run dev

# Frontend
export DEBUG=knowledge-vault:*
npm run dev
```

### Inspect Uploaded Files

```bash
# Check file storage
ls -lh backend/uploads/

# Verify file content
file backend/uploads/user-123/abc-def.pdf
```

### Debug Text Extraction

```bash
# Test PDF extraction directly
node -e "
const pdfParse = require('pdf-parse');
const fs = require('fs');
const dataBuffer = fs.readFileSync('test.pdf');
pdfParse(dataBuffer).then(data => {
  console.log('Pages:', data.numpages);
  console.log('Text length:', data.text.length);
  console.log('First 200 chars:', data.text.substring(0, 200));
});
"
```

### Debug Style Analysis

```bash
# Test NLP directly
node -e "
const natural = require('natural');
const compromise = require('compromise');
const text = 'Sample text here.';
console.log('Tokens:', natural.WordTokenizer().tokenize(text));
console.log('Sentences:', compromise(text).sentences().out('array'));
"
```

## Performance Testing

### Load Test Uploads

```bash
# Install hey (HTTP load testing)
brew install hey  # macOS
# or: go install github.com/rakyll/hey@latest

# Test concurrent uploads
hey -n 100 -c 10 -m POST -H "Authorization: Bearer TOKEN" \
  -F "file=@test.pdf" \
  http://localhost:3001/api/masterworks/upload
```

### Profile Style Analysis

```bash
# Add timing logs to service
console.time('style-analysis');
await styleAnalyzer.analyze(text);
console.timeEnd('style-analysis');

# Check Bull job metrics
# Jobs/second, average duration, failures
```

## Troubleshooting

### "Redis connection refused"
**Fix**: Ensure Redis is running: `redis-cli ping`

### "File extraction failed"
**Fix**: Check file format, try different PDF. Enable debug logs.

### "Style analysis timeout"
**Fix**: Reduce document size or increase job timeout in Bull config.

### "Out of memory during OCR"
**Fix**: Process PDFs in smaller page batches. Increase Node memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### "Search returns no results"
**Fix**: Verify text_chunks populated and tsvector index exists:
```sql
SELECT COUNT(*) FROM text_chunks;
SELECT * FROM pg_indexes WHERE tablename = 'text_chunks';
```

## Next Steps

1. **Implement P1 (Upload)**: Start with upload endpoint and file validation tests
2. **Implement P2 (Library)**: Build library view and API
3. **Implement P3 (Extraction)**: PDF/EPUB/DOCX text extraction
4. **Implement P4 (Style DNA)**: NLP analysis and profile generation
5. **Implement P5 (Search)**: Full-text search with PostgreSQL
6. **Implement P6 (AI Integration)**: Connect style profiles to Writing Studio

## Resources

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/openapi.yaml](./contracts/openapi.yaml)
- **Tasks**: [tasks.md](./tasks.md) (generated by `/speckit.tasks`)

## Support

- Check test output for detailed error messages
- Review logs in `backend/logs/`
- Inspect Bull dashboard for job failures
- Query PostgreSQL for data issues
- Use browser DevTools for frontend debugging
