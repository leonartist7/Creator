// Background job for text extraction
// Phase 5 Implementation - T079-T082

import { Job } from 'bull';
import { extractionService } from '../services/extraction.service';
import { inMemoryStore } from '../data/in-memory-store';
import { ExtractTextJobData } from '../config/bull';

/**
 * T079: Extract text background job processor
 * T080: Integrated with Bull queue
 * T081: Progress tracking and error handling
 * T082: Updates extraction_status during processing
 */
export async function processTextExtraction(job: Job<ExtractTextJobData>): Promise<void> {
  const { masterworkId, filePath, format, userId } = job.data;

  try {
    // T082: Update status to processing
    const masterwork = inMemoryStore.getMasterwork(masterworkId);
    if (!masterwork) {
      throw new Error(`Masterwork ${masterworkId} not found`);
    }

    inMemoryStore.updateMasterwork(masterworkId, {
      extractionStatus: 'processing',
      extractionError: null
    });

    // T081: Report initial progress
    await job.progress(10);

    // Extract and store text
    console.log(`Starting text extraction for masterwork ${masterworkId} (${format})`);
    const startTime = Date.now();

    const result = await extractionService.extractAndStoreText(masterworkId, filePath, format);

    const duration = Date.now() - startTime;
    console.log(`Extraction completed in ${duration}ms:`, extractionService.getExtractionStats(result));

    // T081: Report extraction complete
    await job.progress(70);

    // Update masterwork with accurate word count from extraction
    inMemoryStore.updateMasterwork(masterworkId, {
      wordCount: result.wordCount,
      language: result.language || masterwork.language,
      extractionStatus: 'completed',
      extractionError: null
    });

    // T081: Report final progress
    await job.progress(100);

    console.log(`Successfully extracted ${result.wordCount} words into ${result.chunks.length} chunks`);
  } catch (error) {
    console.error(`Text extraction failed for masterwork ${masterworkId}:`, error);

    // T082: Update status to failed with error message
    inMemoryStore.updateMasterwork(masterworkId, {
      extractionStatus: 'failed',
      extractionError: (error as Error).message
    });

    // T081: Rethrow to mark job as failed
    throw error;
  }
}

/**
 * Job event handlers for monitoring
 */
export const extractTextJobHandlers = {
  onCompleted: (job: Job<ExtractTextJobData>, result: any) => {
    console.log(`✓ Text extraction job ${job.id} completed for masterwork ${job.data.masterworkId}`);
  },

  onFailed: (job: Job<ExtractTextJobData>, error: Error) => {
    console.error(`✗ Text extraction job ${job.id} failed for masterwork ${job.data.masterworkId}:`, error.message);
  },

  onProgress: (job: Job<ExtractTextJobData>, progress: number) => {
    console.log(`⟳ Text extraction job ${job.id} progress: ${progress}%`);
  },

  onActive: (job: Job<ExtractTextJobData>) => {
    console.log(`→ Text extraction job ${job.id} started for masterwork ${job.data.masterworkId}`);
  }
};
