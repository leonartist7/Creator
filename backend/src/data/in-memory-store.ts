// In-Memory Data Store (temporary until database integration)
// Used for development and testing

import { Masterwork } from '../models/Masterwork';
import { MasterworkUpload } from '../models/MasterworkUpload';
import { StyleProfile } from '../models/StyleProfile';
import { TextChunk } from '../models/TextChunk';

export class InMemoryStore {
  private masterworks: Map<string, Masterwork> = new Map();
  private uploads: Map<string, MasterworkUpload> = new Map();
  private styleProfiles: Map<string, StyleProfile> = new Map();
  private textChunks: Map<string, TextChunk[]> = new Map();

  // Masterwork operations
  saveMasterwork(masterwork: Masterwork): void {
    this.masterworks.set(masterwork.id, masterwork);
  }

  getMasterwork(id: string): Masterwork | null {
    return this.masterworks.get(id) || null;
  }

  listMasterworks(userId: string): Masterwork[] {
    return Array.from(this.masterworks.values()).filter(m => m.userId === userId);
  }

  updateMasterwork(id: string, updates: Partial<Masterwork>): Masterwork | null {
    const existing = this.masterworks.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.masterworks.set(id, updated);
    return updated;
  }

  deleteMasterwork(id: string): boolean {
    return this.masterworks.delete(id);
  }

  // Upload tracking operations
  saveUpload(upload: MasterworkUpload): void {
    this.uploads.set(upload.id, upload);
  }

  getUpload(id: string): MasterworkUpload | null {
    return this.uploads.get(id) || null;
  }

  updateUpload(id: string, updates: Partial<MasterworkUpload>): MasterworkUpload | null {
    const existing = this.uploads.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.uploads.set(id, updated);
    return updated;
  }

  // Style profile operations
  saveStyleProfile(profile: StyleProfile): void {
    this.styleProfiles.set(profile.masterworkId, profile);
  }

  getStyleProfile(masterworkId: string): StyleProfile | null {
    return this.styleProfiles.get(masterworkId) || null;
  }

  // Text chunk operations
  saveTextChunk(chunk: TextChunk): void {
    const existing = this.textChunks.get(chunk.masterworkId) || [];
    existing.push(chunk);
    this.textChunks.set(chunk.masterworkId, existing);
  }

  getTextChunks(masterworkId: string): TextChunk[] {
    return this.textChunks.get(masterworkId) || [];
  }

  // Utility methods
  clear(): void {
    this.masterworks.clear();
    this.uploads.clear();
    this.styleProfiles.clear();
    this.textChunks.clear();
  }

  getStats() {
    return {
      masterworks: this.masterworks.size,
      uploads: this.uploads.size,
      styleProfiles: this.styleProfiles.size,
      textChunks: Array.from(this.textChunks.values()).reduce((sum, chunks) => sum + chunks.length, 0)
    };
  }
}

// Export singleton instance
export const inMemoryStore = new InMemoryStore();
