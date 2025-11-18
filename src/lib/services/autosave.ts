/**
 * Autosave Service
 * Handles automatic saving of project content
 */

import { Project } from '@/types/enhanced';

class AutosaveService {
  private saveTimers: Map<string, NodeJS.Timeout> = new Map();
  private pendingSaves: Set<string> = new Set();
  private intervalSeconds: number = 30; // Default 30 seconds

  /**
   * Start autosave for a project
   */
  startAutosave(
    projectId: string,
    onSave: (project: Project) => Promise<void>,
    intervalSeconds: number = 30
  ) {
    this.intervalSeconds = intervalSeconds;

    // Clear existing timer if any
    this.stopAutosave(projectId);

    console.log(`[Autosave] Started for project ${projectId} (${intervalSeconds}s interval)`);
  }

  /**
   * Stop autosave for a project
   */
  stopAutosave(projectId: string) {
    const timer = this.saveTimers.get(projectId);
    if (timer) {
      clearTimeout(timer);
      this.saveTimers.delete(projectId);
      console.log(`[Autosave] Stopped for project ${projectId}`);
    }
  }

  /**
   * Trigger immediate save (debounced)
   */
  triggerSave(
    projectId: string,
    project: Project,
    onSave: (project: Project) => Promise<void>
  ) {
    // Clear existing timer
    const existingTimer = this.saveTimers.get(projectId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer for debounced save
    const timer = setTimeout(async () => {
      if (this.pendingSaves.has(projectId)) {
        return; // Already saving
      }

      this.pendingSaves.add(projectId);

      try {
        await onSave({
          ...project,
          metadata: {
            ...project.metadata,
            lastSavedAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log(`[Autosave] Saved project ${projectId}`);
      } catch (error) {
        console.error(`[Autosave] Failed to save project ${projectId}:`, error);
      } finally {
        this.pendingSaves.delete(projectId);
      }
    }, 2000); // 2 second debounce

    this.saveTimers.set(projectId, timer);
  }

  /**
   * Check if project has pending saves
   */
  hasPendingSaves(projectId: string): boolean {
    return this.pendingSaves.has(projectId);
  }

  /**
   * Save immediately without debounce
   */
  async saveImmediately(
    projectId: string,
    project: Project,
    onSave: (project: Project) => Promise<void>
  ): Promise<void> {
    // Clear any pending debounced save
    const timer = this.saveTimers.get(projectId);
    if (timer) {
      clearTimeout(timer);
      this.saveTimers.delete(projectId);
    }

    if (this.pendingSaves.has(projectId)) {
      console.log(`[Autosave] Save already in progress for ${projectId}`);
      return;
    }

    this.pendingSaves.add(projectId);

    try {
      await onSave({
        ...project,
        metadata: {
          ...project.metadata,
          lastSavedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(`[Autosave] Immediately saved project ${projectId}`);
    } catch (error) {
      console.error(`[Autosave] Failed to immediately save ${projectId}:`, error);
      throw error;
    } finally {
      this.pendingSaves.delete(projectId);
    }
  }

  /**
   * Cleanup all timers
   */
  cleanup() {
    this.saveTimers.forEach((timer) => clearTimeout(timer));
    this.saveTimers.clear();
    this.pendingSaves.clear();
  }
}

// Export singleton instance
export const autosaveService = new AutosaveService();
