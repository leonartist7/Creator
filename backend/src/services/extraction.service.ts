// Text Extraction Service - Extract full text from documents
// Phase 5 Implementation - T069-T078

import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import EPub from 'epub';
import mammoth from 'mammoth';
import { TextChunk, CreateTextChunkInput, TextChunkValidator } from '../models/TextChunk';
import { inMemoryStore } from '../data/in-memory-store';
import { v4 as uuidv4 } from 'uuid';

export interface ExtractionResult {
  text: string;
  wordCount: number;
  pageCount?: number;
  language?: string;
  chunks: TextChunk[];
}

export interface ChunkingOptions {
  chunkSize: number; // words per chunk
  overlapSize: number; // words to overlap between chunks
}

export class ExtractionService {
  private static readonly DEFAULT_CHUNK_SIZE = 1000;
  private static readonly DEFAULT_OVERLAP = 100;

  /**
   * T070: Extract text from PDF using pdf-parse
   */
  async extractPdf(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text || '';
    } catch (error) {
      throw new Error(`PDF extraction failed: ${(error as Error).message}`);
    }
  }

  /**
   * T071: Extract text from EPUB
   */
  async extractEpub(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const epub = new EPub(filePath);

        epub.on('error', (err) => {
          reject(new Error(`EPUB extraction failed: ${err.message}`));
        });

        epub.on('end', async () => {
          try {
            const chapters = epub.flow;
            let fullText = '';

            for (const chapter of chapters) {
              try {
                const chapterText = await this.getEpubChapterText(epub, chapter.id);
                fullText += chapterText + '\n\n';
              } catch (err) {
                console.warn(`Failed to extract chapter ${chapter.id}:`, err);
              }
            }

            resolve(fullText);
          } catch (err) {
            reject(err);
          }
        });

        epub.parse();
      } catch (error) {
        reject(new Error(`EPUB extraction failed: ${(error as Error).message}`));
      }
    });
  }

  /**
   * Helper to extract EPUB chapter text
   */
  private getEpubChapterText(epub: EPub, chapterId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      epub.getChapter(chapterId, (error, text) => {
        if (error) {
          reject(error);
        } else {
          // Strip HTML tags
          const strippedText = this.stripHtmlTags(text);
          resolve(strippedText);
        }
      });
    });
  }

  /**
   * T072: Extract text from DOCX using mammoth
   */
  async extractDocx(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new Error(`DOCX extraction failed: ${(error as Error).message}`);
    }
  }

  /**
   * T073: Extract text from TXT/MD (direct read)
   */
  async extractPlainText(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Plain text extraction failed: ${(error as Error).message}`);
    }
  }

  /**
   * Main extraction method - routes to appropriate extractor
   */
  async extractText(filePath: string, format: string): Promise<string> {
    switch (format.toUpperCase()) {
      case 'PDF':
        return this.extractPdf(filePath);
      case 'EPUB':
        return this.extractEpub(filePath);
      case 'DOCX':
        return this.extractDocx(filePath);
      case 'TXT':
      case 'MD':
        return this.extractPlainText(filePath);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * T077: Chunk text into segments with overlap
   */
  chunkText(
    text: string,
    options: ChunkingOptions = {
      chunkSize: ExtractionService.DEFAULT_CHUNK_SIZE,
      overlapSize: ExtractionService.DEFAULT_OVERLAP
    }
  ): string[] {
    const words = text.trim().split(/\s+/);
    const chunks: string[] = [];

    if (words.length === 0) {
      return chunks;
    }

    let startIndex = 0;

    while (startIndex < words.length) {
      // Take chunk of words
      const endIndex = Math.min(startIndex + options.chunkSize, words.length);
      const chunkWords = words.slice(startIndex, endIndex);
      const chunk = chunkWords.join(' ');

      chunks.push(chunk);

      // Move to next chunk with overlap
      // If we're at the end, don't continue
      if (endIndex >= words.length) {
        break;
      }

      // Move forward by (chunkSize - overlap)
      startIndex += options.chunkSize - options.overlapSize;
    }

    return chunks;
  }

  /**
   * T078: Store extracted text chunks in database
   */
  async storeTextChunks(
    masterworkId: string,
    text: string,
    options?: ChunkingOptions
  ): Promise<TextChunk[]> {
    const chunks = this.chunkText(text, options);
    const textChunks: TextChunk[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const wordCount = this.countWords(chunkText);

      // Create text chunk
      const textChunk: TextChunk = {
        id: uuidv4(),
        masterworkId,
        chunkIndex: i,
        textContent: chunkText,
        wordCount,
        pageNumber: null, // Could be calculated based on position
        locationReference: `Chunk ${i + 1} of ${chunks.length}`,
        createdAt: new Date()
      };

      // Validate chunk
      const validation = TextChunkValidator.validateCreate({
        masterworkId,
        chunkIndex: i,
        textContent: chunkText,
        wordCount,
        locationReference: textChunk.locationReference
      });

      if (!validation.valid) {
        console.warn(`Chunk ${i} validation failed:`, validation.errors);
        continue;
      }

      // Save to store
      inMemoryStore.saveTextChunk(textChunk);
      textChunks.push(textChunk);
    }

    return textChunks;
  }

  /**
   * Complete extraction pipeline for a masterwork
   */
  async extractAndStoreText(
    masterworkId: string,
    filePath: string,
    format: string
  ): Promise<ExtractionResult> {
    // Extract full text
    const text = await this.extractText(filePath, format);

    // Count words
    const wordCount = this.countWords(text);

    // Detect language (simple heuristic for now)
    const language = this.detectLanguage(text);

    // Chunk and store text
    const chunks = await this.storeTextChunks(masterworkId, text);

    return {
      text,
      wordCount,
      language,
      chunks
    };
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Strip HTML tags from text
   */
  private stripHtmlTags(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * T076: Simple language detection
   */
  private detectLanguage(text: string): string {
    // Very basic language detection
    // In production, would use a proper language detection library
    const sample = text.substring(0, 1000).toLowerCase();

    // Check for common English words
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a'];
    const englishCount = englishWords.reduce(
      (count, word) => count + (sample.match(new RegExp(`\\b${word}\\b`, 'g'))?.length || 0),
      0
    );

    if (englishCount > 5) {
      return 'en';
    }

    // Default to English
    return 'en';
  }

  /**
   * Get extraction statistics
   */
  getExtractionStats(result: ExtractionResult): {
    totalWords: number;
    totalChunks: number;
    avgChunkSize: number;
    language: string;
  } {
    const avgChunkSize =
      result.chunks.length > 0
        ? Math.round(result.chunks.reduce((sum, c) => sum + c.wordCount, 0) / result.chunks.length)
        : 0;

    return {
      totalWords: result.wordCount,
      totalChunks: result.chunks.length,
      avgChunkSize,
      language: result.language || 'unknown'
    };
  }
}

// Export singleton instance
export const extractionService = new ExtractionService();
