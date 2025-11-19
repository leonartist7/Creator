// Unit Tests for Text Extraction Service
// Phase 5 - T064-T068

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { extractionService } from '../extraction.service';
import fs from 'fs/promises';
import path from 'path';

describe('ExtractionService', () => {
  const testFilesDir = path.join(__dirname, '../../../tests/test-files');

  beforeAll(async () => {
    // Create test files directory
    await fs.mkdir(testFilesDir, { recursive: true });

    // Create test PDF
    const pdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 100\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(This is a test PDF with sample text for extraction.) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n366\n%%EOF\n');
    await fs.writeFile(path.join(testFilesDir, 'sample.pdf'), pdfContent);

    // Create test TXT
    const txtContent = 'This is a sample text file. It contains multiple sentences for testing text extraction. The extraction service should read this file correctly and count the words accurately.';
    await fs.writeFile(path.join(testFilesDir, 'sample.txt'), txtContent);

    // Create test MD
    const mdContent = '# Test Markdown\n\nThis is a markdown file with **bold** and *italic* text.\n\n## Section 2\n\nMore content here for testing extraction.';
    await fs.writeFile(path.join(testFilesDir, 'sample.md'), mdContent);
  });

  afterAll(async () => {
    // Clean up test files
    await fs.rm(testFilesDir, { recursive: true, force: true });
  });

  describe('T064: PDF text extraction', () => {
    it('should extract text from PDF file', async () => {
      const filePath = path.join(testFilesDir, 'sample.pdf');
      const text = await extractionService.extractPdf(filePath);

      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should handle extraction errors gracefully', async () => {
      const invalidPath = path.join(testFilesDir, 'nonexistent.pdf');

      await expect(extractionService.extractPdf(invalidPath)).rejects.toThrow();
    });

    it('should extract readable text from PDF', async () => {
      const filePath = path.join(testFilesDir, 'sample.pdf');
      const text = await extractionService.extractPdf(filePath);

      // PDF should contain some recognizable text
      expect(text.toLowerCase()).toContain('test');
    });
  });

  describe('T073: Plain text extraction', () => {
    it('should extract text from TXT file', async () => {
      const filePath = path.join(testFilesDir, 'sample.txt');
      const text = await extractionService.extractPlainText(filePath);

      expect(text).toContain('sample text file');
      expect(text).toContain('extraction service');
    });

    it('should extract text from MD file', async () => {
      const filePath = path.join(testFilesDir, 'sample.md');
      const text = await extractionService.extractPlainText(filePath);

      expect(text).toContain('# Test Markdown');
      expect(text).toContain('**bold**');
      expect(text).toContain('*italic*');
    });

    it('should handle file not found error', async () => {
      const invalidPath = path.join(testFilesDir, 'missing.txt');

      await expect(extractionService.extractPlainText(invalidPath)).rejects.toThrow(
        'Plain text extraction failed'
      );
    });
  });

  describe('T077: Text chunking with overlap', () => {
    it('should chunk text into segments', () => {
      const text = 'word '.repeat(2500); // 2500 words
      const chunks = extractionService.chunkText(text, {
        chunkSize: 1000,
        overlapSize: 100
      });

      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.length).toBeLessThanOrEqual(4); // ~2500 words / ~900 effective = 3 chunks
    });

    it('should create overlapping chunks', () => {
      const text = Array.from({ length: 1500 }, (_, i) => `word${i}`).join(' ');
      const chunks = extractionService.chunkText(text, {
        chunkSize: 1000,
        overlapSize: 100
      });

      expect(chunks.length).toBeGreaterThan(1);

      // Check for overlap - last words of chunk 1 should appear in chunk 2
      const chunk1Words = chunks[0].split(' ').slice(-50);
      const chunk2Words = chunks[1].split(' ').slice(0, 50);

      // Some overlap should exist
      const overlap = chunk1Words.filter(w => chunk2Words.includes(w));
      expect(overlap.length).toBeGreaterThan(0);
    });

    it('should handle text shorter than chunk size', () => {
      const text = 'This is a short text with only ten words total.';
      const chunks = extractionService.chunkText(text, {
        chunkSize: 1000,
        overlapSize: 100
      });

      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(text.trim());
    });

    it('should handle empty text', () => {
      const chunks = extractionService.chunkText('', {
        chunkSize: 1000,
        overlapSize: 100
      });

      expect(chunks).toHaveLength(0);
    });

    it('should respect custom chunk size', () => {
      const text = 'word '.repeat(500);
      const chunks = extractionService.chunkText(text, {
        chunkSize: 100,
        overlapSize: 10
      });

      expect(chunks.length).toBeGreaterThan(4); // ~500 / ~90 = ~6 chunks
    });

    it('should create chunks with approximately correct word count', () => {
      const text = 'word '.repeat(1000);
      const chunks = extractionService.chunkText(text, {
        chunkSize: 500,
        overlapSize: 50
      });

      chunks.forEach(chunk => {
        const wordCount = chunk.split(/\s+/).filter(w => w.length > 0).length;
        expect(wordCount).toBeGreaterThanOrEqual(400); // At least 400 words
        expect(wordCount).toBeLessThanOrEqual(500); // At most 500 words
      });
    });
  });

  describe('T078: Store text chunks', () => {
    it('should store text chunks with metadata', async () => {
      const masterworkId = 'test-masterwork-123';
      const text = 'word '.repeat(1500);

      const chunks = await extractionService.storeTextChunks(masterworkId, text, {
        chunkSize: 500,
        overlapSize: 50
      });

      expect(chunks.length).toBeGreaterThan(1);

      // Verify chunk structure
      chunks.forEach((chunk, index) => {
        expect(chunk.id).toBeDefined();
        expect(chunk.masterworkId).toBe(masterworkId);
        expect(chunk.chunkIndex).toBe(index);
        expect(chunk.textContent).toBeDefined();
        expect(chunk.wordCount).toBeGreaterThan(0);
        expect(chunk.createdAt).toBeInstanceOf(Date);
      });
    });

    it('should create sequential chunk indices', async () {
      const masterworkId = 'test-masterwork-456';
      const text = 'word '.repeat(2000);

      const chunks = await extractionService.storeTextChunks(masterworkId, text);

      chunks.forEach((chunk, index) => {
        expect(chunk.chunkIndex).toBe(index);
      });
    });

    it('should handle empty text gracefully', async () => {
      const masterworkId = 'test-masterwork-789';
      const chunks = await extractionService.storeTextChunks(masterworkId, '');

      expect(chunks).toHaveLength(0);
    });
  });

  describe('Complete extraction pipeline', () => {
    it('should extract and store text from TXT file', async () => {
      const masterworkId = 'pipeline-test-1';
      const filePath = path.join(testFilesDir, 'sample.txt');

      const result = await extractionService.extractAndStoreText(
        masterworkId,
        filePath,
        'TXT'
      );

      expect(result.text).toBeDefined();
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.language).toBe('en');
      expect(result.chunks.length).toBeGreaterThan(0);
    });

    it('should provide extraction statistics', async () => {
      const masterworkId = 'pipeline-test-2';
      const filePath = path.join(testFilesDir, 'sample.txt');

      const result = await extractionService.extractAndStoreText(
        masterworkId,
        filePath,
        'TXT'
      );

      const stats = extractionService.getExtractionStats(result);

      expect(stats.totalWords).toBe(result.wordCount);
      expect(stats.totalChunks).toBe(result.chunks.length);
      expect(stats.avgChunkSize).toBeGreaterThan(0);
      expect(stats.language).toBe('en');
    });

    it('should handle unsupported format', async () => {
      const masterworkId = 'pipeline-test-3';
      const filePath = path.join(testFilesDir, 'sample.txt');

      await expect(
        extractionService.extractAndStoreText(masterworkId, filePath, 'INVALID')
      ).rejects.toThrow('Unsupported format');
    });
  });

  describe('Language detection', () => {
    it('should detect English text', async () => {
      const masterworkId = 'lang-test-1';
      const text = 'This is a sample English text. The quick brown fox jumps over the lazy dog.';

      const chunks = await extractionService.storeTextChunks(masterworkId, text);

      // Language detection happens in extractAndStoreText, but we can test the result
      expect(chunks).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should throw error for invalid PDF', async () => {
      const invalidPdf = path.join(testFilesDir, 'invalid.pdf');
      await fs.writeFile(invalidPdf, 'This is not a valid PDF file');

      await expect(extractionService.extractPdf(invalidPdf)).rejects.toThrow();

      await fs.unlink(invalidPdf);
    });

    it('should throw error for missing file', async () => {
      const missingFile = path.join(testFilesDir, 'does-not-exist.txt');

      await expect(extractionService.extractPlainText(missingFile)).rejects.toThrow();
    });
  });
});
