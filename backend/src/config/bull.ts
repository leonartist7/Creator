// Bull Queue Configuration
// Background job processing for Knowledge Vault operations

import Bull, { Queue, QueueOptions, JobOptions } from 'bull';

export interface QueueConfig {
  redisUrl: string;
  defaultJobOptions?: JobOptions;
}

// Job data interfaces
export interface ExtractTextJobData {
  masterworkId: string;
  filePath: string;
  format: string;
  userId: string;
}

export interface AnalyzeStyleJobData {
  masterworkId: string;
  userId: string;
}

export interface CleanupJobData {
  filePath: string;
  uploadId?: string;
}

// Queue names
export const QUEUE_NAMES = {
  TEXT_EXTRACTION: 'text-extraction',
  STYLE_ANALYSIS: 'style-analysis',
  CLEANUP: 'cleanup'
} as const;

// Default job options
const DEFAULT_JOB_OPTIONS: JobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  },
  removeOnComplete: true,
  removeOnFail: false
};

// Queue storage
const queues: Map<string, Queue> = new Map();

/**
 * Initialize Bull queues
 */
export function initializeQueues(config: QueueConfig): void {
  const queueOptions: QueueOptions = {
    redis: config.redisUrl,
    defaultJobOptions: config.defaultJobOptions || DEFAULT_JOB_OPTIONS
  };

  // Create queues
  queues.set(
    QUEUE_NAMES.TEXT_EXTRACTION,
    new Bull(QUEUE_NAMES.TEXT_EXTRACTION, queueOptions)
  );

  queues.set(
    QUEUE_NAMES.STYLE_ANALYSIS,
    new Bull(QUEUE_NAMES.STYLE_ANALYSIS, queueOptions)
  );

  queues.set(
    QUEUE_NAMES.CLEANUP,
    new Bull(QUEUE_NAMES.CLEANUP, {
      ...queueOptions,
      defaultJobOptions: {
        ...DEFAULT_JOB_OPTIONS,
        attempts: 1, // Cleanup jobs shouldn't retry excessively
        removeOnComplete: true,
        removeOnFail: true
      }
    })
  );

  console.log('Bull queues initialized:', Array.from(queues.keys()));
}

/**
 * Get a specific queue by name
 */
export function getQueue(name: string): Queue {
  const queue = queues.get(name);
  if (!queue) {
    throw new Error(`Queue not found: ${name}. Available queues: ${Array.from(queues.keys()).join(', ')}`);
  }
  return queue;
}

/**
 * Get text extraction queue
 */
export function getTextExtractionQueue(): Queue<ExtractTextJobData> {
  return getQueue(QUEUE_NAMES.TEXT_EXTRACTION) as Queue<ExtractTextJobData>;
}

/**
 * Get style analysis queue
 */
export function getStyleAnalysisQueue(): Queue<AnalyzeStyleJobData> {
  return getQueue(QUEUE_NAMES.STYLE_ANALYSIS) as Queue<AnalyzeStyleJobData>;
}

/**
 * Get cleanup queue
 */
export function getCleanupQueue(): Queue<CleanupJobData> {
  return getQueue(QUEUE_NAMES.CLEANUP) as Queue<CleanupJobData>;
}

/**
 * Add job to text extraction queue
 */
export async function addTextExtractionJob(
  data: ExtractTextJobData,
  options?: JobOptions
): Promise<Bull.Job<ExtractTextJobData>> {
  const queue = getTextExtractionQueue();
  return queue.add(data, {
    ...options,
    jobId: `extract-${data.masterworkId}`,
    timeout: 300000 // 5 minutes timeout for large PDFs
  });
}

/**
 * Add job to style analysis queue
 */
export async function addStyleAnalysisJob(
  data: AnalyzeStyleJobData,
  options?: JobOptions
): Promise<Bull.Job<AnalyzeStyleJobData>> {
  const queue = getStyleAnalysisQueue();
  return queue.add(data, {
    ...options,
    jobId: `analyze-${data.masterworkId}`,
    timeout: 600000 // 10 minutes timeout for comprehensive analysis
  });
}

/**
 * Add job to cleanup queue
 */
export async function addCleanupJob(
  data: CleanupJobData,
  options?: JobOptions
): Promise<Bull.Job<CleanupJobData>> {
  const queue = getCleanupQueue();
  return queue.add(data, {
    ...options,
    delay: 3600000 // 1 hour delay before cleanup
  });
}

/**
 * Get queue statistics
 */
export async function getQueueStats(queueName: string): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}> {
  const queue = getQueue(queueName);
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount()
  ]);

  return { waiting, active, completed, failed, delayed };
}

/**
 * Get all queue statistics
 */
export async function getAllQueueStats(): Promise<Record<string, {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}>> {
  const stats: Record<string, any> = {};

  for (const queueName of queues.keys()) {
    stats[queueName] = await getQueueStats(queueName);
  }

  return stats;
}

/**
 * Pause all queues
 */
export async function pauseAllQueues(): Promise<void> {
  const promises = Array.from(queues.values()).map(queue => queue.pause());
  await Promise.all(promises);
  console.log('All queues paused');
}

/**
 * Resume all queues
 */
export async function resumeAllQueues(): Promise<void> {
  const promises = Array.from(queues.values()).map(queue => queue.resume());
  await Promise.all(promises);
  console.log('All queues resumed');
}

/**
 * Close all queues (for graceful shutdown)
 */
export async function closeAllQueues(): Promise<void> {
  const promises = Array.from(queues.values()).map(queue => queue.close());
  await Promise.all(promises);
  queues.clear();
  console.log('All queues closed');
}

/**
 * Clean completed and failed jobs from all queues
 */
export async function cleanAllQueues(grace: number = 0): Promise<void> {
  const promises = Array.from(queues.values()).map(async queue => {
    await queue.clean(grace, 'completed');
    await queue.clean(grace, 'failed');
  });
  await Promise.all(promises);
  console.log('All queues cleaned');
}

/**
 * Register job processors for all queues
 */
export function registerJobProcessors(): void {
  const textExtractionQueue = getTextExtractionQueue();
  const styleAnalysisQueue = getStyleAnalysisQueue();
  const cleanupQueue = getCleanupQueue();

  // Import job processors dynamically to avoid circular dependencies
  import('../jobs/extractText.job').then(({ processTextExtraction, extractTextJobHandlers }) => {
    textExtractionQueue.process(processTextExtraction);

    textExtractionQueue.on('completed', extractTextJobHandlers.onCompleted);
    textExtractionQueue.on('failed', extractTextJobHandlers.onFailed);
    textExtractionQueue.on('progress', extractTextJobHandlers.onProgress);
    textExtractionQueue.on('active', extractTextJobHandlers.onActive);

    console.log('✓ Text extraction job processor registered');
  }).catch(err => {
    console.error('Failed to register text extraction processor:', err);
  });

  // Style analysis processor will be registered in Phase 6
  console.log('Note: Style analysis processor not yet implemented (Phase 6)');

  // Cleanup processor (simple implementation)
  cleanupQueue.process(async (job) => {
    const { filePath } = job.data;
    console.log(`Cleanup job ${job.id}: Removing ${filePath}`);
    // TODO: Implement file cleanup
    return { cleaned: filePath };
  });

  console.log('✓ Job processors registered');
}
