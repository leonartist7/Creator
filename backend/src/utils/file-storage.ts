import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FileStorage {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.FILE_STORAGE_PATH || './uploads';

    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Save a file to storage
   * @param fileBuffer The file content buffer
   * @param originalFilename The original filename
   * @returns The relative path to the saved file
   */
  public async saveFile(fileBuffer: Buffer, originalFilename: string): Promise<string> {
    const extension = path.extname(originalFilename);
    const filename = `${uuidv4()}${extension}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filePath, fileBuffer);

    // Return relative path for database storage
    return filename;
  }

  /**
   * Get the full system path for a stored file
   * @param storedFilename The filename stored in the database
   */
  public getFilePath(storedFilename: string): string {
    return path.resolve(this.uploadDir, storedFilename);
  }

  /**
   * Delete a file from storage
   * @param storedFilename The filename stored in the database
   */
  public async deleteFile(storedFilename: string): Promise<void> {
    const filePath = this.getFilePath(storedFilename);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  /**
   * Read file content
   * @param storedFilename The filename stored in the database
   */
  public async readFile(storedFilename: string): Promise<Buffer> {
    const filePath = this.getFilePath(storedFilename);
    return fs.promises.readFile(filePath);
  }
}

export const fileStorage = new FileStorage();
