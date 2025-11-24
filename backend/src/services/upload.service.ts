import { fileStorage } from '../utils/file-storage';
import Masterwork from '../models/Masterwork';
import path from 'path';

interface UploadResult {
  masterwork: Masterwork;
  message: string;
}

export class UploadService {
  /**
   * Process an uploaded file and create a Masterwork record
   */
  public async processUpload(
    userId: string,
    file: Express.Multer.File,
    metadata: { title?: string; author?: string } = {}
  ): Promise<UploadResult> {
    // 1. Validate file type
    const allowedFormats = ['.pdf', '.epub', '.docx', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedFormats.includes(ext)) {
      throw new Error(`Invalid file format. Allowed: ${allowedFormats.join(', ')}`);
    }

    // 2. Determine format enum
    let format: 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD' = 'PDF';
    if (ext === '.epub') format = 'EPUB';
    else if (ext === '.docx') format = 'DOCX';
    else if (ext === '.txt') format = 'TXT';
    else if (ext === '.md') format = 'MD';

    // 3. Save file to storage
    const storedFilename = await fileStorage.saveFile(file.buffer, file.originalname);

    // 4. Create Masterwork record
    const masterwork = await Masterwork.create({
      user_id: userId,
      title: metadata.title || file.originalname,
      author: metadata.author || null,
      format,
      file_size: file.size,
      file_path: storedFilename,
      word_count: 0, // Will be updated by extraction job
      extraction_status: 'pending',
      analysis_status: 'not_started',
      upload_date: new Date(),
      last_accessed: new Date()
    });

    // 5. Trigger background extraction job
    // For MVP, we run this "inline" but non-blocking (fire and forget)
    // In production, this should go to a Redis queue
    console.log(`[UploadService] Starting extraction for masterwork ${masterwork.id}`);

    // Don't await this, let it run in background
    import('./extraction.service').then(({ extractionService }) => {
      extractionService.extractAndChunk(masterwork.id).catch(err => {
        console.error(`[UploadService] Background extraction failed:`, err);
      });
    });

    return {
      masterwork,
      message: 'File uploaded successfully. Processing started.'
    };
  }
}

export const uploadService = new UploadService();
