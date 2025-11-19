// Masterwork Library Component - Grid/list view for masterwork collection
// US2 Implementation - T057

import React, { useState } from 'react';
import { Masterwork, LibraryFilters, LibrarySortOptions } from '../../types/masterwork.types';
import MasterworkCard from './MasterworkCard';
import LibraryFiltersComponent from './LibraryFilters';
import LibrarySearch from './LibrarySearch';
import Pagination from './Pagination';

interface MasterworkLibraryProps {
  masterworks: Masterwork[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: LibraryFilters) => void;
  onSortChange: (sort: LibrarySortOptions) => void;
  onSearchChange: (query: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
}

type ViewMode = 'grid' | 'list';

const MasterworkLibrary: React.FC<MasterworkLibraryProps> = ({
  masterworks,
  total,
  page,
  pageSize,
  loading = false,
  onPageChange,
  onFiltersChange,
  onSortChange,
  onSearchChange,
  onDelete,
  onUpdate
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="masterwork-library">
      <div className="library-header">
        <div className="library-title">
          <h2>Knowledge Vault</h2>
          <span className="masterwork-count">
            {total} {total === 1 ? 'masterwork' : 'masterworks'}
          </span>
        </div>

        <div className="library-controls">
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Filters {showFilters ? '▼' : '▶'}
          </button>

          <div className="view-mode-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="2" />
                <rect x="3" y="11" width="18" height="2" />
                <rect x="3" y="18" width="18" height="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <LibrarySearch onSearch={onSearchChange} />

      {showFilters && (
        <LibraryFiltersComponent
          onFiltersChange={onFiltersChange}
          onSortChange={onSortChange}
        />
      )}

      {loading ? (
        <div className="library-loading">
          <div className="spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading masterworks...</p>
        </div>
      ) : masterworks.length === 0 ? (
        <div className="library-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" strokeLinecap="round" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3>No masterworks yet</h3>
          <p>Upload your first masterwork to start analyzing creative styles</p>
        </div>
      ) : (
        <>
          <div className={`library-${viewMode}`}>
            {masterworks.map((masterwork) => (
              <MasterworkCard
                key={masterwork.id}
                masterwork={masterwork}
                viewMode={viewMode}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MasterworkLibrary;
