// Search Service - Full-text search across masterworks
// Phase 7 Implementation - T113-T118

import { inMemoryStore } from '../data/in-memory-store';
import { TextChunk } from '../models/TextChunk';
import { Masterwork } from '../models/Masterwork';

export interface SearchQuery {
  query: string;
  masterworkIds?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  chunkId: string;
  masterworkId: string;
  masterworkTitle: string;
  masterworkAuthor: string | null;
  textSnippet: string;
  highlightedSnippet: string;
  pageNumber: number | null;
  locationReference: string | null;
  relevanceScore: number;
  matchCount: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number; // milliseconds
}

export class SearchService {
  /**
   * T113-T119: Full-text search implementation
   */
  async search(searchQuery: SearchQuery): Promise<SearchResponse> {
    const startTime = Date.now();
    const { query, masterworkIds, limit = 20, offset = 0 } = searchQuery;

    // Normalize query
    const normalizedQuery = query.toLowerCase().trim();
    const queryTerms = normalizedQuery.split(/\s+/);

    if (queryTerms.length === 0 || normalizedQuery.length === 0) {
      return {
        results: [],
        total: 0,
        query,
        took: Date.now() - startTime
      };
    }

    // Get all text chunks (filtered by masterworkIds if provided)
    let allChunks: TextChunk[] = [];

    if (masterworkIds && masterworkIds.length > 0) {
      // Search specific masterworks
      masterworkIds.forEach(id => {
        const chunks = inMemoryStore.getTextChunks(id);
        allChunks = allChunks.concat(chunks);
      });
    } else {
      // Search all masterworks
      const allMasterworks = inMemoryStore.listMasterworks(''); // Get all
      allMasterworks.forEach(masterwork => {
        const chunks = inMemoryStore.getTextChunks(masterwork.id);
        allChunks = allChunks.concat(chunks);
      });
    }

    // T115: Search and rank results by relevance
    const matches: Array<{ chunk: TextChunk; relevance: number; matchCount: number }> = [];

    allChunks.forEach(chunk => {
      const { relevance, matchCount } = this.calculateRelevance(
        chunk.textContent,
        queryTerms
      );

      if (relevance > 0) {
        matches.push({ chunk, relevance, matchCount });
      }
    });

    // Sort by relevance (descending)
    matches.sort((a, b) => b.relevance - a.relevance);

    // T117: Apply pagination
    const total = matches.length;
    const paginatedMatches = matches.slice(offset, offset + limit);

    // T116: Generate highlighted snippets
    const results: SearchResult[] = paginatedMatches.map(({ chunk, relevance, matchCount }) => {
      const masterwork = inMemoryStore.getMasterwork(chunk.masterworkId);

      return {
        chunkId: chunk.id,
        masterworkId: chunk.masterworkId,
        masterworkTitle: masterwork?.title || 'Unknown',
        masterworkAuthor: masterwork?.author || null,
        textSnippet: this.generateSnippet(chunk.textContent, queryTerms),
        highlightedSnippet: this.highlightMatches(
          this.generateSnippet(chunk.textContent, queryTerms),
          queryTerms
        ),
        pageNumber: chunk.pageNumber,
        locationReference: chunk.locationReference,
        relevanceScore: Math.round(relevance * 100) / 100,
        matchCount
      };
    });

    return {
      results,
      total,
      query,
      took: Date.now() - startTime
    };
  }

  /**
   * T115: Calculate relevance score using TF-IDF-like approach
   */
  private calculateRelevance(
    text: string,
    queryTerms: string[]
  ): { relevance: number; matchCount: number } {
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);
    const wordCount = words.length;

    let totalRelevance = 0;
    let matchCount = 0;

    queryTerms.forEach(term => {
      // Count exact matches
      const exactMatches = (normalizedText.match(new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'g')) || []).length;

      // Count partial matches (contains)
      const partialMatches = (normalizedText.match(new RegExp(this.escapeRegex(term), 'g')) || []).length;

      if (exactMatches > 0 || partialMatches > 0) {
        matchCount += exactMatches + partialMatches;

        // Calculate term frequency (TF)
        const tf = exactMatches / wordCount;

        // Boost exact matches more than partial
        const exactBoost = exactMatches * 2;
        const partialBoost = (partialMatches - exactMatches) * 0.5;

        // Simple relevance: TF + position boost + match type boost
        const termRelevance = (tf * 10) + exactBoost + partialBoost;
        totalRelevance += termRelevance;
      }
    });

    // Boost for multi-term phrase matches
    const phraseQuery = queryTerms.join(' ');
    if (queryTerms.length > 1 && normalizedText.includes(phraseQuery)) {
      totalRelevance += 5; // Significant boost for exact phrase match
      matchCount += 1;
    }

    return {
      relevance: totalRelevance,
      matchCount
    };
  }

  /**
   * T116: Generate context snippet around matches
   */
  private generateSnippet(text: string, queryTerms: string[], maxLength: number = 200): string {
    const normalizedText = text.toLowerCase();

    // Find first match position
    let firstMatchIndex = -1;
    for (const term of queryTerms) {
      const index = normalizedText.indexOf(term.toLowerCase());
      if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
        firstMatchIndex = index;
      }
    }

    if (firstMatchIndex === -1) {
      // No match found, return beginning
      return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
    }

    // Calculate snippet boundaries
    const contextBefore = 50;
    const contextAfter = maxLength - contextBefore;

    let start = Math.max(0, firstMatchIndex - contextBefore);
    let end = Math.min(text.length, firstMatchIndex + contextAfter);

    // Adjust to word boundaries
    if (start > 0) {
      const spaceIndex = text.lastIndexOf(' ', start);
      if (spaceIndex !== -1) start = spaceIndex + 1;
    }

    if (end < text.length) {
      const spaceIndex = text.indexOf(' ', end);
      if (spaceIndex !== -1) end = spaceIndex;
    }

    let snippet = text.substring(start, end);

    // Add ellipsis
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
  }

  /**
   * T116: Highlight search terms in snippet
   */
  private highlightMatches(snippet: string, queryTerms: string[]): string {
    let highlighted = snippet;

    queryTerms.forEach(term => {
      const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });

    return highlighted;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Search within a specific masterwork
   * T118: Masterwork-specific filtering
   */
  async searchInMasterwork(
    masterworkId: string,
    query: string,
    options?: { limit?: number; offset?: number }
  ): Promise<SearchResponse> {
    return this.search({
      query,
      masterworkIds: [masterworkId],
      limit: options?.limit,
      offset: options?.offset
    });
  }

  /**
   * Get search suggestions based on query
   */
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    // Simple implementation: find common phrases containing query
    const normalizedQuery = query.toLowerCase();

    if (normalizedQuery.length < 2) {
      return [];
    }

    // Search for phrases in all chunks
    const allMasterworks = inMemoryStore.listMasterworks('');
    const phrases = new Set<string>();

    allMasterworks.forEach(masterwork => {
      const chunks = inMemoryStore.getTextChunks(masterwork.id);
      chunks.forEach(chunk => {
        const sentences = chunk.textContent.split(/[.!?]+/);
        sentences.forEach(sentence => {
          const normalized = sentence.toLowerCase().trim();
          if (normalized.includes(normalizedQuery) && normalized.length < 100) {
            phrases.add(sentence.trim());
          }
        });
      });
    });

    return Array.from(phrases).slice(0, limit);
  }

  /**
   * Get search statistics
   */
  async getSearchStats(): Promise<{
    totalChunks: number;
    totalMasterworks: number;
    avgChunkSize: number;
  }> {
    const allMasterworks = inMemoryStore.listMasterworks('');
    let totalChunks = 0;
    let totalWords = 0;

    allMasterworks.forEach(masterwork => {
      const chunks = inMemoryStore.getTextChunks(masterwork.id);
      totalChunks += chunks.length;
      totalWords += chunks.reduce((sum, chunk) => sum + chunk.wordCount, 0);
    });

    return {
      totalChunks,
      totalMasterworks: allMasterworks.length,
      avgChunkSize: totalChunks > 0 ? Math.round(totalWords / totalChunks) : 0
    };
  }
}

// Export singleton
export const searchService = new SearchService();
