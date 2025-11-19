// Search Results Component - Display search results with highlighting
// Phase 7 Implementation - T121, T124

import React, { useState, useEffect, useRef } from 'react';

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

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // T124: Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            window.location.href = `/masterworks/${results[selectedIndex].masterworkId}`;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex]);

  // Scroll selected result into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleResultClick = (masterworkId: string) => {
    window.location.href = `/masterworks/${masterworkId}`;
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="search-results" ref={resultsRef}>
      {results.map((result, index) => (
        <div
          key={result.chunkId}
          data-index={index}
          className={`search-result ${index === selectedIndex ? 'selected' : ''}`}
          onClick={() => handleResultClick(result.masterworkId)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <div className="result-header">
            <h4 className="result-title">{result.masterworkTitle}</h4>
            {result.masterworkAuthor && (
              <span className="result-author">by {result.masterworkAuthor}</span>
            )}
          </div>

          <div
            className="result-snippet"
            dangerouslySetInnerHTML={{ __html: result.highlightedSnippet }}
          />

          <div className="result-meta">
            {result.locationReference && (
              <span className="result-location">{result.locationReference}</span>
            )}
            {result.pageNumber && (
              <span className="result-page">Page {result.pageNumber}</span>
            )}
            <span className="result-matches">
              {result.matchCount} {result.matchCount === 1 ? 'match' : 'matches'}
            </span>
            <span className="result-relevance">
              Relevance: {result.relevanceScore.toFixed(1)}
            </span>
          </div>
        </div>
      ))}

      <div className="search-hint">
        <kbd>↑</kbd> <kbd>↓</kbd> to navigate • <kbd>Enter</kbd> to open
      </div>
    </div>
  );
};

export default SearchResults;
