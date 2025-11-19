// Metadata Extractor - Extract metadata from uploaded documents
// US1 Implementation - T033-T036

import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import EPub from 'epub';
import mammoth from 'mammoth';

export interface ExtractedMetadata {
  title?: string;
  author?: string;
  pageCount?: number;
  wordCount: number;
  language?: string;
  publicationDate?: Date;
  isbn?: string;
  format: 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD';
}

export class MetadataExtractor {
  /**
   * Extract metadata from any supported file format
   */
  async extract(filePath: string, format: 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD'): Promise<ExtractedMetadata> {
    switch (format) {
      case 'PDF':
        return this.extractPdfMetadata(filePath);
      case 'EPUB':
        return this.extractEpubMetadata(filePath);
      case 'DOCX':
        return this.extractDocxMetadata(filePath);
      case 'TXT':
        return this.extractTxtMetadata(filePath);
      case 'MD':
        return this.extractMdMetadata(filePath);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * T034: Extract metadata from PDF files using pdf-parse
   */
  private async extractPdfMetadata(filePath: string): Promise<ExtractedMetadata> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);

      // Count words from text
      const text = data.text || '';
      const wordCount = this.countWords(text);

      // Extract metadata from PDF info
      const info = data.info || {};

      return {
        title: info.Title || undefined,
        author: info.Author || undefined,
        pageCount: data.numpages || undefined,
        wordCount,
        format: 'PDF',
        // PDF creation date is often in a specific format
        publicationDate: info.CreationDate ? this.parsePdfDate(info.CreationDate) : undefined
      };
    } catch (error) {
      throw new Error(`Failed to extract PDF metadata: ${(error as Error).message}`);
    }
  }

  /**
   * T035: Extract metadata from EPUB files
   */
  private async extractEpubMetadata(filePath: string): Promise<ExtractedMetadata> {
    return new Promise((resolve, reject) => {
      try {
        const epub = new EPub(filePath);

        epub.on('error', (err) => {
          reject(new Error(`Failed to extract EPUB metadata: ${err.message}`));
        });

        epub.on('end', async () => {
          try {
            // Extract text content for word count
            const chapters = epub.flow;
            let totalText = '';

            for (const chapter of chapters) {
              try {
                const chapterText = await this.getEpubChapterText(epub, chapter.id);
                totalText += chapterText + ' ';
              } catch (err) {
                // Skip chapters that fail to extract
                console.warn(`Failed to extract chapter ${chapter.id}:`, err);
              }
            }

            const wordCount = this.countWords(totalText);

            // Parse publication date if available
            let publicationDate: Date | undefined;
            if (epub.metadata.date) {
              const parsed = new Date(epub.metadata.date);
              if (!isNaN(parsed.getTime())) {
                publicationDate = parsed;
              }
            }

            resolve({
              title: epub.metadata.title || undefined,
              author: epub.metadata.creator || undefined,
              wordCount,
              language: epub.metadata.language || undefined,
              publicationDate,
              isbn: epub.metadata.ISBN || undefined,
              format: 'EPUB'
            });
          } catch (err) {
            reject(err);
          }
        });

        epub.parse();
      } catch (error) {
        reject(new Error(`Failed to extract EPUB metadata: ${(error as Error).message}`));
      }
    });
  }

  /**
   * Helper to extract text from EPUB chapter
   */
  private getEpubChapterText(epub: EPub, chapterId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      epub.getChapter(chapterId, (error, text) => {
        if (error) {
          reject(error);
        } else {
          // Strip HTML tags from chapter text
          const strippedText = this.stripHtmlTags(text);
          resolve(strippedText);
        }
      });
    });
  }

  /**
   * T036: Extract metadata from DOCX files using mammoth
   */
  private async extractDocxMetadata(filePath: string): Promise<ExtractedMetadata> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      const text = result.value;
      const wordCount = this.countWords(text);

      // Mammoth doesn't extract document properties by default
      // We could use additional libraries for full metadata, but for now focus on text
      return {
        wordCount,
        format: 'DOCX'
      };
    } catch (error) {
      throw new Error(`Failed to extract DOCX metadata: ${(error as Error).message}`);
    }
  }

  /**
   * Extract metadata from plain text files
   */
  private async extractTxtMetadata(filePath: string): Promise<ExtractedMetadata> {
    try {
      const text = await fs.readFile(filePath, 'utf-8');
      const wordCount = this.countWords(text);

      return {
        wordCount,
        format: 'TXT'
      };
    } catch (error) {
      throw new Error(`Failed to extract TXT metadata: ${(error as Error).message}`);
    }
  }

  /**
   * Extract metadata from Markdown files
   */
  private async extractMdMetadata(filePath: string): Promise<ExtractedMetadata> {
    try {
      const text = await fs.readFile(filePath, 'utf-8');

      // Try to extract frontmatter if present (YAML format)
      const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---/);
      let title: string | undefined;
      let author: string | undefined;
      let publicationDate: Date | undefined;

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];

        // Simple YAML parsing for common fields
        const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?\n/);
        const authorMatch = frontmatter.match(/author:\s*["']?(.*?)["']?\n/);
        const dateMatch = frontmatter.match(/date:\s*["']?(.*?)["']?\n/);

        if (titleMatch) title = titleMatch[1];
        if (authorMatch) author = authorMatch[1];
        if (dateMatch) {
          const parsed = new Date(dateMatch[1]);
          if (!isNaN(parsed.getTime())) {
            publicationDate = parsed;
          }
        }
      }

      // Count words (excluding frontmatter)
      const contentText = frontmatterMatch ? text.replace(frontmatterMatch[0], '') : text;
      const wordCount = this.countWords(contentText);

      return {
        title,
        author,
        wordCount,
        publicationDate,
        format: 'MD'
      };
    } catch (error) {
      throw new Error(`Failed to extract MD metadata: ${(error as Error).message}`);
    }
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }

    // Split on whitespace and filter empty strings
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  /**
   * Strip HTML tags from text
   */
  private stripHtmlTags(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')  // Remove tags
      .replace(/&nbsp;/g, ' ')   // Replace nbsp
      .replace(/&lt;/g, '<')     // Decode entities
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
  }

  /**
   * Parse PDF date format (D:YYYYMMDDHHmmSS)
   */
  private parsePdfDate(pdfDate: string): Date | undefined {
    try {
      // PDF dates are in format: D:YYYYMMDDHHmmSS+HH'mm'
      const match = pdfDate.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/);

      if (match) {
        const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1, // Months are 0-indexed
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second)
        );

        return isNaN(date.getTime()) ? undefined : date;
      }

      // Try parsing as ISO date
      const isoDate = new Date(pdfDate);
      return isNaN(isoDate.getTime()) ? undefined : isoDate;
    } catch {
      return undefined;
    }
  }

  /**
   * Validate extracted metadata
   */
  validateMetadata(metadata: ExtractedMetadata): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (metadata.wordCount < 0) {
      errors.push('Word count cannot be negative');
    }

    if (metadata.pageCount !== undefined && metadata.pageCount < 1) {
      errors.push('Page count must be at least 1');
    }

    if (metadata.publicationDate && metadata.publicationDate > new Date()) {
      errors.push('Publication date cannot be in the future');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const metadataExtractor = new MetadataExtractor();
