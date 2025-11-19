// Library Filters Component - Filter and sort controls
// US2 Implementation - T059

import React, { useState } from 'react';
import {
  LibraryFilters,
  LibrarySortOptions,
  FileFormat,
  AnalysisStatus,
  FILE_FORMAT_LABELS,
  ANALYSIS_STATUS_LABELS
} from '../../types/masterwork.types';

interface LibraryFiltersProps {
  onFiltersChange: (filters: LibraryFilters) => void;
  onSortChange: (sort: LibrarySortOptions) => void;
}

const LibraryFiltersComponent: React.FC<LibraryFiltersProps> = ({
  onFiltersChange,
  onSortChange
}) => {
  const [selectedFormats, setSelectedFormats] = useState<FileFormat[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AnalysisStatus[]>([]);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortField, setSortField] = useState<LibrarySortOptions['field']>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleFormatToggle = (format: FileFormat) => {
    const newFormats = selectedFormats.includes(format)
      ? selectedFormats.filter(f => f !== format)
      : [...selectedFormats, format];

    setSelectedFormats(newFormats);
    applyFilters({ format: newFormats });
  };

  const handleStatusToggle = (status: AnalysisStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(newStatuses);
    applyFilters({ analysisStatus: newStatuses });
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    applyFilters({ rating });
  };

  const handleSortChange = (field: LibrarySortOptions['field']) => {
    // Toggle direction if clicking same field
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';

    setSortField(field);
    setSortDirection(newDirection);
    onSortChange({ field, direction: newDirection });
  };

  const applyFilters = (updates: Partial<LibraryFilters>) => {
    const filters: LibraryFilters = {
      format: selectedFormats.length > 0 ? selectedFormats : undefined,
      analysisStatus: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      rating: minRating,
      ...updates
    };

    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSelectedFormats([]);
    setSelectedStatuses([]);
    setMinRating(undefined);
    onFiltersChange({});
  };

  const hasActiveFilters = selectedFormats.length > 0 || selectedStatuses.length > 0 || minRating !== undefined;

  return (
    <div className="library-filters">
      <div className="filters-section">
        <div className="filter-group">
          <h4>Sort By</h4>
          <div className="sort-options">
            {[
              { field: 'title' as const, label: 'Title' },
              { field: 'author' as const, label: 'Author' },
              { field: 'uploadDate' as const, label: 'Upload Date' },
              { field: 'wordCount' as const, label: 'Word Count' },
              { field: 'rating' as const, label: 'Rating' }
            ].map(({ field, label }) => (
              <button
                key={field}
                className={`sort-btn ${sortField === field ? 'active' : ''}`}
                onClick={() => handleSortChange(field)}
              >
                {label}
                {sortField === field && (
                  <span className="sort-direction">
                    {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Format</h4>
          <div className="filter-checkboxes">
            {(Object.keys(FILE_FORMAT_LABELS) as FileFormat[]).map((format) => (
              <label key={format} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedFormats.includes(format)}
                  onChange={() => handleFormatToggle(format)}
                />
                <span>{FILE_FORMAT_LABELS[format]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Analysis Status</h4>
          <div className="filter-checkboxes">
            {(Object.keys(ANALYSIS_STATUS_LABELS) as AnalysisStatus[]).map((status) => (
              <label key={status} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusToggle(status)}
                />
                <span>{ANALYSIS_STATUS_LABELS[status]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Minimum Rating</h4>
          <div className="rating-filter">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className={`rating-btn ${minRating === rating ? 'active' : ''}`}
                onClick={() => handleRatingChange(rating)}
              >
                {'★'.repeat(rating)}
                {'☆'.repeat(5 - rating)}
              </button>
            ))}
            {minRating && (
              <button
                className="clear-rating"
                onClick={() => { setMinRating(undefined); applyFilters({ rating: undefined }); }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-all-btn">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryFiltersComponent;
