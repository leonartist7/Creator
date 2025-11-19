// Custom hook for masterwork data fetching
// US2 Implementation - T062

import { useState, useEffect, useCallback } from 'react';
import { masterworkApi } from '../services/masterwork.service';
import { Masterwork, LibraryFilters, LibrarySortOptions } from '../types/masterwork.types';

interface UseMasterworksOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: LibrarySortOptions;
  initialFilters?: LibraryFilters;
}

interface UseMasterworksResult {
  masterworks: Masterwork[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: LibraryFilters;
  sort: LibrarySortOptions;
  searchQuery: string;
  setPage: (page: number) => void;
  setFilters: (filters: LibraryFilters) => void;
  setSort: (sort: LibrarySortOptions) => void;
  setSearchQuery: (query: string) => void;
  refresh: () => void;
  deleteMasterwork: (id: string) => Promise<void>;
  updateMasterwork: (id: string, updates: any) => Promise<void>;
}

export const useMasterworks = (
  options: UseMasterworksOptions = {}
): UseMasterworksResult => {
  const [masterworks, setMasterworks] = useState<Masterwork[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.initialPage || 1);
  const [pageSize] = useState(options.initialPageSize || 20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LibraryFilters>(options.initialFilters || {});
  const [sort, setSort] = useState<LibrarySortOptions>(
    options.initialSort || { field: 'uploadDate', direction: 'desc' }
  );
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMasterworks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        pageSize,
        sortBy: sort.field,
        sortOrder: sort.direction
      };

      // Add filters
      if (filters.format && filters.format.length > 0) {
        params.format = filters.format[0]; // API supports single format for now
      }

      if (filters.analysisStatus && filters.analysisStatus.length > 0) {
        params.analysisStatus = filters.analysisStatus[0];
      }

      if (filters.tags && filters.tags.length > 0) {
        params.tags = filters.tags;
      }

      const response = await masterworkApi.list(params);

      // Client-side filtering for search query (until backend search is implemented)
      let filtered = response.masterworks;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          m =>
            m.title.toLowerCase().includes(query) ||
            (m.author && m.author.toLowerCase().includes(query))
        );
      }

      // Client-side filtering for rating
      if (filters.rating) {
        filtered = filtered.filter(m => m.rating && m.rating >= filters.rating!);
      }

      setMasterworks(filtered);
      setTotal(searchQuery || filters.rating ? filtered.length : response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch masterworks');
      setMasterworks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sort, filters, searchQuery]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchMasterworks();
  }, [fetchMasterworks]);

  const deleteMasterwork = async (id: string) => {
    try {
      await masterworkApi.delete(id);
      // Refresh list after deletion
      await fetchMasterworks();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete masterwork');
    }
  };

  const updateMasterwork = async (id: string, updates: any) => {
    try {
      await masterworkApi.update(id, updates);
      // Refresh list after update
      await fetchMasterworks();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update masterwork');
    }
  };

  const handleSetPage = (newPage: number) => {
    setPage(newPage);
  };

  const handleSetFilters = (newFilters: LibraryFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSetSort = (newSort: LibrarySortOptions) => {
    setSort(newSort);
    setPage(1); // Reset to first page when sort changes
  };

  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when search changes
  };

  return {
    masterworks,
    total,
    page,
    pageSize,
    loading,
    error,
    filters,
    sort,
    searchQuery,
    setPage: handleSetPage,
    setFilters: handleSetFilters,
    setSort: handleSetSort,
    setSearchQuery: handleSetSearchQuery,
    refresh: fetchMasterworks,
    deleteMasterwork,
    updateMasterwork
  };
};
