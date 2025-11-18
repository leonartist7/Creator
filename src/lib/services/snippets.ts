/**
 * Snippet Library Service
 * Save and reuse content snippets across projects
 */

import { Snippet } from '@/types/enhanced';

class SnippetLibraryService {
  /**
   * Create a new snippet
   */
  createSnippet(
    userId: string,
    title: string,
    content: string,
    category: Snippet['category'],
    tags: string[] = []
  ): Snippet {
    return {
      id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      content,
      category,
      tags,
      useCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get snippets by category
   */
  getByCategory(snippets: Snippet[], category: Snippet['category']): Snippet[] {
    return snippets.filter((s) => s.category === category);
  }

  /**
   * Search snippets
   */
  search(snippets: Snippet[], query: string): Snippet[] {
    const lowerQuery = query.toLowerCase();

    return snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(lowerQuery) ||
        s.content.toLowerCase().includes(lowerQuery) ||
        s.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get snippets by tags
   */
  getByTags(snippets: Snippet[], tags: string[]): Snippet[] {
    return snippets.filter((s) => tags.some((tag) => s.tags.includes(tag)));
  }

  /**
   * Increment use count
   */
  incrementUseCount(snippets: Snippet[], snippetId: string): Snippet[] {
    return snippets.map((s) =>
      s.id === snippetId
        ? {
            ...s,
            useCount: s.useCount + 1,
            updatedAt: new Date(),
          }
        : s
    );
  }

  /**
   * Update snippet
   */
  updateSnippet(
    snippets: Snippet[],
    snippetId: string,
    updates: Partial<Omit<Snippet, 'id' | 'userId' | 'createdAt'>>
  ): Snippet[] {
    return snippets.map((s) =>
      s.id === snippetId
        ? {
            ...s,
            ...updates,
            updatedAt: new Date(),
          }
        : s
    );
  }

  /**
   * Delete snippet
   */
  deleteSnippet(snippets: Snippet[], snippetId: string): Snippet[] {
    return snippets.filter((s) => s.id !== snippetId);
  }

  /**
   * Get most used snippets
   */
  getMostUsed(snippets: Snippet[], limit: number = 10): Snippet[] {
    return [...snippets].sort((a, b) => b.useCount - a.useCount).slice(0, limit);
  }

  /**
   * Get recent snippets
   */
  getRecent(snippets: Snippet[], limit: number = 10): Snippet[] {
    return [...snippets]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Extract all tags from snippets
   */
  getAllTags(snippets: Snippet[]): string[] {
    const tags = new Set<string>();
    snippets.forEach((s) => s.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }

  /**
   * Get snippet suggestions based on context
   */
  getSuggestions(
    snippets: Snippet[],
    context: {
      category?: Snippet['category'];
      currentContent?: string;
      recentTags?: string[];
    }
  ): Snippet[] {
    let suggestions = snippets;

    // Filter by category if provided
    if (context.category) {
      suggestions = suggestions.filter((s) => s.category === context.category);
    }

    // Filter by recent tags if provided
    if (context.recentTags && context.recentTags.length > 0) {
      suggestions = suggestions.filter((s) =>
        s.tags.some((tag) => context.recentTags!.includes(tag))
      );
    }

    // Sort by use count and recency
    return suggestions.sort((a, b) => {
      const scoreA = a.useCount * 2 + (Date.now() - a.updatedAt.getTime()) / 1000000;
      const scoreB = b.useCount * 2 + (Date.now() - b.updatedAt.getTime()) / 1000000;
      return scoreB - scoreA;
    }).slice(0, 5);
  }

  /**
   * Export snippets to JSON
   */
  exportToJSON(snippets: Snippet[]): string {
    return JSON.stringify(snippets, null, 2);
  }

  /**
   * Import snippets from JSON
   */
  importFromJSON(json: string, userId: string): Snippet[] {
    try {
      const imported = JSON.parse(json) as Snippet[];
      return imported.map((s) => ({
        ...s,
        id: `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    } catch (error) {
      console.error('[SnippetLibrary] Failed to import JSON:', error);
      return [];
    }
  }
}

// Export singleton instance
export const snippetLibraryService = new SnippetLibraryService();
