// API Integration Tests for Masterwork Upload (US1)
// TDD Red Phase - T026-T028
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { testMasterworks } from '../../../tests/fixtures/masterworks';

const API_URL = 'http://localhost:3001';

describe('POST /api/masterworks/upload', () => {
  // Test file paths
  const testFilesDir = path.join(__dirname, '../../../tests/test-files');
  const validPdfPath = path.join(testFilesDir, 'sample.pdf');
  const validEpubPath = path.join(testFilesDir, 'sample.epub');
  const invalidTypePath = path.join(testFilesDir, 'sample.exe');
  const largePdfPath = path.join(testFilesDir, 'large-sample.pdf');

  beforeAll(async () => {
    // Create test files directory
    await fs.mkdir(testFilesDir, { recursive: true });

    // Create a sample PDF file (small valid file)
    const smallPdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n308\n%%EOF\n');
    await fs.writeFile(validPdfPath, smallPdfContent);

    // Create a sample EPUB file (minimal valid EPUB structure)
    await fs.writeFile(validEpubPath, Buffer.from('PK\x03\x04'));

    // Create an invalid file type
    await fs.writeFile(invalidTypePath, Buffer.from('Invalid executable file'));

    // Create a large PDF (> 50MB) - we'll create a 51MB file
    const largePdfSize = 51 * 1024 * 1024; // 51MB
    const largeBuffer = Buffer.alloc(largePdfSize, 0);
    await fs.writeFile(largePdfPath, largeBuffer);
  });

  afterAll(async () => {
    // Clean up test files
    await fs.rm(testFilesDir, { recursive: true, force: true });
  });

  describe('T026: Upload PDF file successfully', () => {
    it('should accept valid PDF file and return upload confirmation', async () => {
      const formData = new FormData();
      const fileBuffer = await fs.readFile(validPdfPath);
      const file = new File([fileBuffer], 'test-upload.pdf', { type: 'application/pdf' });

      formData.append('file', file);
      formData.append('title', 'Test Upload Document');
      formData.append('author', 'Test Author');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('uploadId');
      expect(data).toHaveProperty('message');
      expect(data.message).toContain('Upload');
    });

    it('should extract basic metadata from PDF', async () => {
      const formData = new FormData();
      const fileBuffer = await fs.readFile(validPdfPath);
      const file = new File([fileBuffer], 'metadata-test.pdf', { type: 'application/pdf' });

      formData.append('file', file);
      formData.append('title', 'Metadata Test');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      const uploadId = data.uploadId;

      // Check upload progress to verify metadata was extracted
      const progressResponse = await fetch(`${API_URL}/api/masterworks/uploads/${uploadId}`);
      const progressData = await progressResponse.json();

      expect(progressData.upload).toBeDefined();
      expect(progressData.upload.format).toBe('PDF');
      expect(progressData.upload.fileSize).toBeGreaterThan(0);
    });

    it('should handle EPUB files', async () => {
      const formData = new FormData();
      const fileBuffer = await fs.readFile(validEpubPath);
      const file = new File([fileBuffer], 'test.epub', { type: 'application/epub+zip' });

      formData.append('file', file);
      formData.append('title', 'EPUB Test');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.uploadId).toBeDefined();
    });
  });

  describe('T027: Reject invalid file types', () => {
    it('should reject .exe files', async () => {
      const formData = new FormData();
      const fileBuffer = await fs.readFile(invalidTypePath);
      const file = new File([fileBuffer], 'malware.exe', { type: 'application/x-msdownload' });

      formData.append('file', file);
      formData.append('title', 'Should Fail');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.message).toContain('format');
      expect(data.message.toLowerCase()).toContain('invalid');
    });

    it('should reject files with no extension', async () => {
      const formData = new FormData();
      const file = new File([Buffer.from('test')], 'noextension', { type: 'application/octet-stream' });

      formData.append('file', file);
      formData.append('title', 'Should Fail');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(400);
    });

    it('should reject unsupported formats like .zip', async () => {
      const formData = new FormData();
      const file = new File([Buffer.from('PK\x03\x04')], 'test.zip', { type: 'application/zip' });

      formData.append('file', file);
      formData.append('title', 'Should Fail');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message.toLowerCase()).toContain('format');
    });
  });

  describe('T028: Reject oversized files (> 50MB)', () => {
    it('should reject files larger than 50MB', async () => {
      const formData = new FormData();
      const fileBuffer = await fs.readFile(largePdfPath);
      const file = new File([fileBuffer], 'huge.pdf', { type: 'application/pdf' });

      formData.append('file', file);
      formData.append('title', 'Too Large');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.message.toLowerCase()).toContain('size');
      expect(data.message).toContain('50');
    });

    it('should accept files exactly at 50MB limit', async () => {
      // Create exactly 50MB file
      const exactSizeFile = path.join(testFilesDir, 'exact-50mb.pdf');
      const exactSize = 50 * 1024 * 1024; // Exactly 50MB
      const buffer = Buffer.alloc(exactSize, 0);
      // Add PDF header
      buffer.write('%PDF-1.4\n');
      await fs.writeFile(exactSizeFile, buffer);

      const formData = new FormData();
      const fileBuffer = await fs.readFile(exactSizeFile);
      const file = new File([fileBuffer], 'exact-50mb.pdf', { type: 'application/pdf' });

      formData.append('file', file);
      formData.append('title', 'Exactly 50MB');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(200);

      await fs.unlink(exactSizeFile);
    });
  });

  describe('Validation requirements', () => {
    it('should require a file to be uploaded', async () => {
      const formData = new FormData();
      formData.append('title', 'No File');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message.toLowerCase()).toContain('file');
    });

    it('should require title when uploading', async () => {
      const formData = new FormData();
      const fileBuffer = await fs.readFile(validPdfPath);
      const file = new File([fileBuffer], 'test.pdf', { type: 'application/pdf' });

      formData.append('file', file);
      // No title provided

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message.toLowerCase()).toContain('title');
    });

    it('should accept optional metadata fields', async () => {
      const formData = new FormData();
      const fileBuffer = await fs.readFile(validPdfPath);
      const file = new File([fileBuffer], 'test.pdf', { type: 'application/pdf' });

      formData.append('file', file);
      formData.append('title', 'Full Metadata Test');
      formData.append('author', 'John Doe');
      formData.append('isbn', '978-0-123456-78-9');
      formData.append('publicationDate', '2024-01-01');
      formData.append('customTags', JSON.stringify(['fiction', 'thriller']));
      formData.append('userNotes', 'Great book for analysis');
      formData.append('rating', '5');

      const response = await fetch(`${API_URL}/api/masterworks/upload`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBe(200);
    });
  });
});
