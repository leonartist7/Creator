// Background job for style DNA analysis
// Phase 6 Implementation - T103

import { Job } from 'bull';
import { styleAnalysisService } from '../services/style-analysis.service';
import { inMemoryStore } from '../data/in-memory-store';
import { AnalyzeStyleJobData } from '../config/bull';

/**
 * T103: Style analysis background job processor
 */
export async function processStyleAnalysis(job: Job<AnalyzeStyleJobData>): Promise<void> {
  const { masterworkId, userId } = job.data;

  try {
    const masterwork = inMemoryStore.getMasterwork(masterworkId);
    if (!masterwork) {
      throw new Error(`Masterwork ${masterworkId} not found`);
    }

    // Check if text has been extracted
    if (masterwork.extractionStatus !== 'completed') {
      throw new Error(`Text extraction not completed for masterwork ${masterworkId}`);
    }

    // Update status to processing
    inMemoryStore.updateMasterwork(masterworkId, {
      analysisStatus: 'processing'
    });

    await job.progress(10);

    // Get all text chunks for this masterwork
    const chunks = inMemoryStore.getTextChunks(masterworkId);
    if (chunks.length === 0) {
      throw new Error(`No text chunks found for masterwork ${masterworkId}`);
    }

    // Combine all chunks into full text
    const fullText = chunks
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .map(c => c.textContent)
      .join('\n\n');

    console.log(`Analyzing style for masterwork ${masterworkId} (${masterwork.wordCount} words)...`);

    await job.progress(30);

    // Run style analysis
    const styleProfile = await styleAnalysisService.analyzeStyle(masterworkId, fullText);

    await job.progress(90);

    // Update masterwork status
    inMemoryStore.updateMasterwork(masterworkId, {
      analysisStatus: 'completed'
    });

    await job.progress(100);

    console.log(`✓ Style analysis completed for "${masterwork.title}"`);
    console.log(`  - Confidence: ${styleProfile.confidenceScore}%`);
    console.log(`  - Avg sentence length: ${styleProfile.avgSentenceLength} words`);
    console.log(`  - Readability: ${styleProfile.fleschReadingEase} (Grade ${styleProfile.fleschKincaidGrade})`);
    console.log(`  - Tone: ${styleProfile.toneScore} (${styleProfile.toneScore < 0 ? 'formal' : 'conversational'})`);
  } catch (error) {
    console.error(`Style analysis failed for masterwork ${masterworkId}:`, error);

    // Update status to failed
    inMemoryStore.updateMasterwork(masterworkId, {
      analysisStatus: 'failed'
    });

    throw error;
  }
}

/**
 * Job event handlers
 */
export const analyzeStyleJobHandlers = {
  onCompleted: (job: Job<AnalyzeStyleJobData>, result: any) => {
    console.log(`✓ Style analysis job ${job.id} completed for masterwork ${job.data.masterworkId}`);
  },

  onFailed: (job: Job<AnalyzeStyleJobData>, error: Error) => {
    console.error(`✗ Style analysis job ${job.id} failed:`, error.message);
  },

  onProgress: (job: Job<AnalyzeStyleJobData>, progress: number) => {
    console.log(`⟳ Style analysis job ${job.id} progress: ${progress}%`);
  },

  onActive: (job: Job<AnalyzeStyleJobData>) => {
    console.log(`→ Style analysis job ${job.id} started`);
  }
};
