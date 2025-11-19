// File Storage Utility
// Abstraction for file storage operations (local filesystem or S3-compatible)

import fs from 'fs/promises';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export interface StorageConfig {
  type: 'local' | 's3';
  localPath?: string;
  s3Config?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
  };
}

export interface UploadOptions {
  userId: string;
  fileName: string;
  contentType?: string;
}

export interface UploadResult {
  filePath: string;
  fileSize: number;
  url?: string;
}

export interface FileStorage {
  upload(sourceStream: NodeJS.ReadableStream, options: UploadOptions): Promise<UploadResult>;
  download(filePath: string): Promise<NodeJS.ReadableStream>;
  delete(filePath: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
  getUrl(filePath: string): Promise<string>;
  getMetadata(filePath: string): Promise<{ size: number; contentType?: string }>;
}

/**
 * Local filesystem storage implementation
 */
export class LocalFileStorage implements FileStorage {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async upload(
    sourceStream: NodeJS.ReadableStream,
    options: UploadOptions
  ): Promise<UploadResult> {
    // Create user-specific directory
    const userDir = path.join(this.basePath, options.userId);
    await fs.mkdir(userDir, { recursive: true });

    // Generate safe filename and full path
    const safeFileName = this.sanitizeFileName(options.fileName);
    const filePath = path.join(options.userId, safeFileName);
    const fullPath = path.join(this.basePath, filePath);

    // Stream file to disk
    const writeStream = createWriteStream(fullPath);
    await pipeline(sourceStream, writeStream);

    // Get file size
    const stats = await fs.stat(fullPath);

    return {
      filePath,
      fileSize: stats.size,
      url: filePath // For local storage, path is the URL
    };
  }

  async download(filePath: string): Promise<NodeJS.ReadableStream> {
    const fullPath = path.join(this.basePath, filePath);
    const exists = await this.exists(filePath);

    if (!exists) {
      throw new Error(`File not found: ${filePath}`);
    }

    return createReadStream(fullPath);
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    const exists = await this.exists(filePath);

    if (!exists) {
      return; // Already deleted or never existed
    }

    await fs.unlink(fullPath);
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async getUrl(filePath: string): Promise<string> {
    // For local storage, return the relative path
    // In production, this would be served via a static file server
    return `/uploads/${filePath}`;
  }

  async getMetadata(filePath: string): Promise<{ size: number; contentType?: string }> {
    const fullPath = path.join(this.basePath, filePath);
    const exists = await this.exists(filePath);

    if (!exists) {
      throw new Error(`File not found: ${filePath}`);
    }

    const stats = await fs.stat(fullPath);
    const contentType = this.getContentType(filePath);

    return {
      size: stats.size,
      contentType
    };
  }

  private sanitizeFileName(fileName: string): string {
    // Remove or replace unsafe characters
    let safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Add timestamp to prevent collisions
    const timestamp = Date.now();
    const ext = path.extname(safe);
    const base = path.basename(safe, ext);

    return `${base}_${timestamp}${ext}`;
  }

  private getContentType(filePath: string): string | undefined {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.epub': 'application/epub+zip',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png'
    };

    return contentTypes[ext];
  }
}

/**
 * S3-compatible storage implementation (placeholder for future)
 */
export class S3FileStorage implements FileStorage {
  constructor(config: NonNullable<StorageConfig['s3Config']>) {
    // TODO: Implement S3 storage in Phase 4
    throw new Error('S3 storage not yet implemented');
  }

  async upload(
    sourceStream: NodeJS.ReadableStream,
    options: UploadOptions
  ): Promise<UploadResult> {
    throw new Error('S3 storage not yet implemented');
  }

  async download(filePath: string): Promise<NodeJS.ReadableStream> {
    throw new Error('S3 storage not yet implemented');
  }

  async delete(filePath: string): Promise<void> {
    throw new Error('S3 storage not yet implemented');
  }

  async exists(filePath: string): Promise<boolean> {
    throw new Error('S3 storage not yet implemented');
  }

  async getUrl(filePath: string): Promise<string> {
    throw new Error('S3 storage not yet implemented');
  }

  async getMetadata(filePath: string): Promise<{ size: number; contentType?: string }> {
    throw new Error('S3 storage not yet implemented');
  }
}

/**
 * Factory function to create appropriate storage implementation
 */
export function createFileStorage(config: StorageConfig): FileStorage {
  switch (config.type) {
    case 'local':
      if (!config.localPath) {
        throw new Error('localPath is required for local storage');
      }
      return new LocalFileStorage(config.localPath);

    case 's3':
      if (!config.s3Config) {
        throw new Error('s3Config is required for S3 storage');
      }
      return new S3FileStorage(config.s3Config);

    default:
      throw new Error(`Unknown storage type: ${config.type}`);
  }
}

// Default storage instance (singleton)
let defaultStorage: FileStorage | null = null;

export function initializeStorage(config: StorageConfig): FileStorage {
  defaultStorage = createFileStorage(config);
  return defaultStorage;
}

export function getStorage(): FileStorage {
  if (!defaultStorage) {
    throw new Error('Storage not initialized. Call initializeStorage() first.');
  }
  return defaultStorage;
}
