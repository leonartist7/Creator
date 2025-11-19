// Search Interface Component - Main search UI
// Phase 7 Implementation - T120, T123

import React, { useState, useEffect, useCallback } from 'react';
import { masterworkApi } from '../../services/masterwork.service';
import SearchResults from './SearchResults';

export interface SearchInterfaceProps {
  masterworkIds?: string[]; // Optional: search within specific masterworks
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  masterworkIds,
  placeholder = 'Search across all masterworks...',
  autoFocus = false
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState(0);

  // T123: Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length === 0) {
      setResults([]);
      setTotal(0);
      return;
    }

    performSearch(debouncedQuery);
  }, [debouncedQuery, masterworkIds]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await masterworkApi.search({
        query: searchQuery,
        masterworkIds,
        limit: 50,
        offset: 0
      });

      setResults(response.results);
      setTotal(response.total);
      setSearchTime(response.took);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setTotal(0);
    setError(null);
  };

  return (
    <div className="search-interface">
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={autoFocus}
          />

          {query && (
            <button
              className="clear-search-btn"
              onClick={handleClear}
              title="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {loading && (
          <div className="search-loading">
            <div className="spinner-small">
              <div className="spinner-ring-small"></div>
            </div>
            <span>Searching...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="search-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {debouncedQuery && !loading && (
        <div className="search-meta">
          {total > 0 ? (
            <span>
              Found <strong>{total}</strong> {total === 1 ? 'result' : 'results'} in {searchTime}ms
            </span>
          ) : (
            <span>No results found for "{debouncedQuery}"</span>
          )}
        </div>
      )}

      {results.length > 0 && (
        <SearchResults results={results} query={debouncedQuery} />
      )}
    </div>
  );
};

export default SearchInterface;
