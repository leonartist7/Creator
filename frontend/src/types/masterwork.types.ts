// Frontend TypeScript types for Knowledge Vault Module
// Mirrors backend models with additional UI-specific types

// Core entities
export type FileFormat = 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD';
export type ExtractionStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AnalysisStatus = 'not_started' | 'processing' | 'completed' | 'failed';
export type UploadStatus = 'uploading' | 'processing' | 'complete' | 'failed';

export interface Masterwork {
  id: string;
  userId: string;
  title: string;
  author: string | null;
  format: FileFormat;
  fileSize: number;
  filePath: string;
  coverImageUrl: string | null;
  pageCount: number | null;
  wordCount: number;
  language: string;
  publicationDate: Date | null;
  isbn: string | null;
  customTags: string[];
  userNotes: string | null;
  rating: number | null;
  extractionStatus: ExtractionStatus;
  extractionError: string | null;
  analysisStatus: AnalysisStatus;
  uploadDate: Date;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StyleProfile {
  id: string;
  masterworkId: string;
  avgSentenceLength: number;
  sentenceLengthVariance: number;
  vocabComplexity: number;
  uniqueWordRatio: number;
  avgParagraphLength: number;
  paragraphVariance: number;
  dialogueRatio: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  toneScore: number;
  sentimentScore: number;
  topWords: Record<string, number>;
  topPhrases: Record<string, number>;
  commonSentencePatterns: string[];
  confidenceScore: number;
  analysisDate: Date;
  analysisDurationMs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TextChunk {
  id: string;
  masterworkId: string;
  chunkIndex: number;
  textContent: string;
  wordCount: number;
  pageNumber: number | null;
  locationReference: string | null;
  createdAt: Date;
}

export interface MasterworkUpload {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  format: FileFormat;
  status: UploadStatus;
  progressPercentage: number;
  errorMessage: string | null;
  tempFilePath: string | null;
  masterworkId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// API request/response types
export interface CreateMasterworkRequest {
  title: string;
  author?: string;
  format: FileFormat;
  fileSize: number;
  filePath: string;
  coverImageUrl?: string;
  pageCount?: number;
  wordCount: number;
  language?: string;
  publicationDate?: Date;
  isbn?: string;
  customTags?: string[];
  userNotes?: string;
  rating?: number;
}

export interface UpdateMasterworkRequest {
  title?: string;
  author?: string;
  customTags?: string[];
  userNotes?: string;
  rating?: number;
}

export interface UploadMasterworkResponse {
  uploadId: string;
  message: string;
}

export interface UploadProgressResponse {
  upload: MasterworkUpload;
}

export interface MasterworkListResponse {
  masterworks: Masterwork[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StyleProfileResponse {
  styleProfile: StyleProfile;
}

export interface SearchRequest {
  query: string;
  masterworkIds?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  chunkId: string;
  masterworkId: string;
  masterworkTitle: string;
  textSnippet: string;
  pageNumber: number | null;
  locationReference: string | null;
  relevanceScore: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

// UI-specific types
export interface MasterworkCardData {
  id: string;
  title: string;
  author: string | null;
  coverImageUrl: string | null;
  format: FileFormat;
  wordCount: number;
  rating: number | null;
  analysisStatus: AnalysisStatus;
  uploadDate: Date;
}

export interface StyleMetricCardData {
  label: string;
  value: number | string;
  description: string;
  format?: 'number' | 'percentage' | 'decimal' | 'range';
}

export interface LibraryFilters {
  format?: FileFormat[];
  analysisStatus?: AnalysisStatus[];
  rating?: number;
  tags?: string[];
  searchQuery?: string;
}

export interface LibrarySortOptions {
  field: 'title' | 'author' | 'uploadDate' | 'wordCount' | 'rating';
  direction: 'asc' | 'desc';
}

export interface UploadConfig {
  maxFileSize: number; // bytes
  allowedFormats: FileFormat[];
  chunkSize: number; // for chunked uploads
}

// Validation helpers
export const FILE_FORMAT_LABELS: Record<FileFormat, string> = {
  PDF: 'PDF Document',
  EPUB: 'EPUB eBook',
  DOCX: 'Word Document',
  TXT: 'Plain Text',
  MD: 'Markdown'
};

export const EXTRACTION_STATUS_LABELS: Record<ExtractionStatus, string> = {
  pending: 'Pending',
  processing: 'Extracting...',
  completed: 'Completed',
  failed: 'Failed'
};

export const ANALYSIS_STATUS_LABELS: Record<AnalysisStatus, string> = {
  not_started: 'Not Started',
  processing: 'Analyzing...',
  completed: 'Completed',
  failed: 'Failed'
};

export const UPLOAD_STATUS_LABELS: Record<UploadStatus, string> = {
  uploading: 'Uploading...',
  processing: 'Processing...',
  complete: 'Complete',
  failed: 'Failed'
};

// Status colors for UI
export const ANALYSIS_STATUS_COLORS: Record<AnalysisStatus, string> = {
  not_started: 'gray',
  processing: 'blue',
  completed: 'green',
  failed: 'red'
};

export const EXTRACTION_STATUS_COLORS: Record<ExtractionStatus, string> = {
  pending: 'gray',
  processing: 'blue',
  completed: 'green',
  failed: 'red'
};

// Utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function getReadabilityLevel(grade: number): string {
  if (grade <= 6) return 'Elementary';
  if (grade <= 8) return 'Middle School';
  if (grade <= 12) return 'High School';
  if (grade <= 16) return 'College';
  return 'Graduate';
}

export function getToneDescription(score: number): string {
  if (score < -0.5) return 'Very Formal';
  if (score < 0) return 'Formal';
  if (score === 0) return 'Neutral';
  if (score < 0.5) return 'Conversational';
  return 'Very Conversational';
}

export function getSentimentDescription(score: number): string {
  if (score < -0.5) return 'Negative';
  if (score < -0.1) return 'Slightly Negative';
  if (score >= -0.1 && score <= 0.1) return 'Neutral';
  if (score < 0.5) return 'Slightly Positive';
  return 'Positive';
}

export function getConfidenceDescription(score: number): string {
  if (score < 50) return 'Low Confidence';
  if (score < 80) return 'Medium Confidence';
  return 'High Confidence';
}
