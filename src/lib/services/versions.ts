/**
 * Version History Service
 * Manages content versions and allows reverting to previous versions
 */

import { ContentVersion, VersionHistory } from '@/types/enhanced';

class VersionHistoryService {
  private maxVersionsPerSection: number = 10;

  /**
   * Create a new version
   */
  createVersion(
    sectionId: string,
    content: string,
    createdBy: 'user' | 'ai',
    metadata?: ContentVersion['metadata']
  ): ContentVersion {
    return {
      id: `version_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sectionId,
      content,
      createdAt: new Date(),
      createdBy,
      metadata,
    };
  }

  /**
   * Add version to history
   */
  addVersion(
    versionHistory: VersionHistory[],
    sectionId: string,
    version: ContentVersion
  ): VersionHistory[] {
    const existingIndex = versionHistory.findIndex((vh) => vh.sectionId === sectionId);

    if (existingIndex >= 0) {
      // Update existing section history
      const existing = versionHistory[existingIndex];
      const newVersions = [...existing.versions, version];

      // Keep only max versions
      const trimmedVersions =
        newVersions.length > this.maxVersionsPerSection
          ? newVersions.slice(-this.maxVersionsPerSection)
          : newVersions;

      const updated: VersionHistory = {
        sectionId,
        versions: trimmedVersions,
        currentVersionId: version.id,
      };

      return [
        ...versionHistory.slice(0, existingIndex),
        updated,
        ...versionHistory.slice(existingIndex + 1),
      ];
    } else {
      // Create new section history
      const newHistory: VersionHistory = {
        sectionId,
        versions: [version],
        currentVersionId: version.id,
      };

      return [...versionHistory, newHistory];
    }
  }

  /**
   * Get version history for a section
   */
  getVersionHistory(
    versionHistory: VersionHistory[],
    sectionId: string
  ): VersionHistory | null {
    return versionHistory.find((vh) => vh.sectionId === sectionId) || null;
  }

  /**
   * Get specific version
   */
  getVersion(
    versionHistory: VersionHistory[],
    sectionId: string,
    versionId: string
  ): ContentVersion | null {
    const history = this.getVersionHistory(versionHistory, sectionId);
    if (!history) return null;

    return history.versions.find((v) => v.id === versionId) || null;
  }

  /**
   * Revert to a specific version
   */
  revertToVersion(
    versionHistory: VersionHistory[],
    sectionId: string,
    versionId: string
  ): { content: string; versionHistory: VersionHistory[] } | null {
    const history = this.getVersionHistory(versionHistory, sectionId);
    if (!history) return null;

    const version = history.versions.find((v) => v.id === versionId);
    if (!version) return null;

    // Create a new version based on the reverted content
    const revertedVersion = this.createVersion(
      sectionId,
      version.content,
      'user',
      {
        ...version.metadata,
        revertedFrom: versionId,
      } as any
    );

    const updatedHistory = this.addVersion(versionHistory, sectionId, revertedVersion);

    return {
      content: version.content,
      versionHistory: updatedHistory,
    };
  }

  /**
   * Compare two versions
   */
  compareVersions(
    version1: ContentVersion,
    version2: ContentVersion
  ): {
    added: string[];
    removed: string[];
    wordCountDiff: number;
  } {
    const words1 = version1.content.split(/\s+/);
    const words2 = version2.content.split(/\s+/);

    // Simple word-based diff (can be enhanced with actual diff algorithm)
    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const added = words2.filter((w) => !set1.has(w));
    const removed = words1.filter((w) => !set2.has(w));

    return {
      added,
      removed,
      wordCountDiff: words2.length - words1.length,
    };
  }

  /**
   * Get version count for section
   */
  getVersionCount(versionHistory: VersionHistory[], sectionId: string): number {
    const history = this.getVersionHistory(versionHistory, sectionId);
    return history ? history.versions.length : 0;
  }

  /**
   * Delete old versions (keep only N most recent)
   */
  pruneVersions(
    versionHistory: VersionHistory[],
    sectionId: string,
    keepCount: number = 5
  ): VersionHistory[] {
    const history = this.getVersionHistory(versionHistory, sectionId);
    if (!history || history.versions.length <= keepCount) {
      return versionHistory;
    }

    const prunedVersions = history.versions.slice(-keepCount);
    const updated: VersionHistory = {
      ...history,
      versions: prunedVersions,
    };

    const existingIndex = versionHistory.findIndex((vh) => vh.sectionId === sectionId);
    return [
      ...versionHistory.slice(0, existingIndex),
      updated,
      ...versionHistory.slice(existingIndex + 1),
    ];
  }
}

// Export singleton instance
export const versionHistoryService = new VersionHistoryService();
