// Library Search Component - Title/author search
// US2 Implementation - T060

import React, { useState, useEffect } from 'react';

interface LibrarySearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const LibrarySearch: React.FC<LibrarySearchProps> = ({
  onSearch,
  placeholder = 'Search by title or author...'
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="library-search">
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

      {debouncedQuery && (
        <div className="search-status">
          Searching for "{debouncedQuery}"
        </div>
      )}
    </div>
  );
};

export default LibrarySearch;
