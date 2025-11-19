// Masterwork API Client Service
// Handles all API communication for Knowledge Vault Module

import {
  Masterwork,
  StyleProfile,
  MasterworkUpload,
  CreateMasterworkRequest,
  UpdateMasterworkRequest,
  UploadMasterworkResponse,
  UploadProgressResponse,
  MasterworkListResponse,
  StyleProfileResponse,
  SearchRequest,
  SearchResponse
} from '../types/masterwork.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API Error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP helper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText
    }));
    throw new ApiError(
      response.status,
      errorData.message || 'An error occurred',
      errorData.errors
    );
  }

  return response.json();
}

// Masterwork API
export const masterworkApi = {
  /**
   * Upload a new masterwork file
   */
  async upload(file: File, metadata?: Partial<CreateMasterworkRequest>): Promise<UploadMasterworkResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await fetch(`${API_URL}/api/masterworks/upload`, {
      method: 'POST',
      body: formData
      // Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText
      }));
      throw new ApiError(response.status, errorData.message, errorData.errors);
    }

    return response.json();
  },

  /**
   * Get upload progress
   */
  async getUploadProgress(uploadId: string): Promise<UploadProgressResponse> {
    return fetchApi<UploadProgressResponse>(`/api/masterworks/uploads/${uploadId}`);
  },

  /**
   * List all masterworks for the current user
   */
  async list(params?: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    format?: string;
    analysisStatus?: string;
    tags?: string[];
  }): Promise<MasterworkListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.format) queryParams.append('format', params.format);
    if (params?.analysisStatus) queryParams.append('analysisStatus', params.analysisStatus);
    if (params?.tags) {
      params.tags.forEach(tag => queryParams.append('tags[]', tag));
    }

    const endpoint = `/api/masterworks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchApi<MasterworkListResponse>(endpoint);
  },

  /**
   * Get a single masterwork by ID
   */
  async getById(id: string): Promise<{ masterwork: Masterwork }> {
    return fetchApi<{ masterwork: Masterwork }>(`/api/masterworks/${id}`);
  },

  /**
   * Update a masterwork
   */
  async update(id: string, data: UpdateMasterworkRequest): Promise<{ masterwork: Masterwork }> {
    return fetchApi<{ masterwork: Masterwork }>(`/api/masterworks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Delete a masterwork
   */
  async delete(id: string): Promise<{ message: string }> {
    return fetchApi<{ message: string }>(`/api/masterworks/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Trigger text extraction for a masterwork
   */
  async extractText(id: string): Promise<{ message: string; jobId: string }> {
    return fetchApi<{ message: string; jobId: string }>(`/api/masterworks/${id}/extract`, {
      method: 'POST'
    });
  },

  /**
   * Trigger style analysis for a masterwork
   */
  async analyzeStyle(id: string): Promise<{ message: string; jobId: string }> {
    return fetchApi<{ message: string; jobId: string }>(`/api/masterworks/${id}/analyze`, {
      method: 'POST'
    });
  },

  /**
   * Get style profile for a masterwork
   */
  async getStyleProfile(masterworkId: string): Promise<StyleProfileResponse> {
    return fetchApi<StyleProfileResponse>(`/api/masterworks/${masterworkId}/style`);
  },

  /**
   * Search across masterwork text
   */
  async search(searchData: SearchRequest): Promise<SearchResponse> {
    return fetchApi<SearchResponse>('/api/masterworks/search', {
      method: 'POST',
      body: JSON.stringify(searchData)
    });
  },

  /**
   * Get text chunks for a masterwork
   */
  async getTextChunks(
    masterworkId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<{ chunks: any[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));

    const endpoint = `/api/masterworks/${masterworkId}/chunks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchApi<{ chunks: any[]; total: number }>(endpoint);
  }
};

// React Query hooks (for use with @tanstack/react-query)
export const masterworkQueryKeys = {
  all: ['masterworks'] as const,
  lists: () => [...masterworkQueryKeys.all, 'list'] as const,
  list: (params?: any) => [...masterworkQueryKeys.lists(), params] as const,
  details: () => [...masterworkQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...masterworkQueryKeys.details(), id] as const,
  styleProfile: (id: string) => [...masterworkQueryKeys.detail(id), 'style'] as const,
  chunks: (id: string, params?: any) => [...masterworkQueryKeys.detail(id), 'chunks', params] as const,
  search: (query: string) => [...masterworkQueryKeys.all, 'search', query] as const,
  uploadProgress: (uploadId: string) => ['uploads', uploadId] as const
};

// Upload helper with progress tracking
export interface UploadProgress {
  percentage: number;
  bytesUploaded: number;
  totalBytes: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export function uploadWithProgress(
  file: File,
  metadata?: Partial<CreateMasterworkRequest>,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadMasterworkResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          percentage: Math.round((e.loaded / e.total) * 100),
          bytesUploaded: e.loaded,
          totalBytes: e.total,
          status: 'uploading'
        });
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        if (onProgress) {
          onProgress({
            percentage: 100,
            bytesUploaded: file.size,
            totalBytes: file.size,
            status: 'complete'
          });
        }
        resolve(response);
      } else {
        const errorData = JSON.parse(xhr.responseText);
        const error = new ApiError(xhr.status, errorData.message, errorData.errors);
        if (onProgress) {
          onProgress({
            percentage: 0,
            bytesUploaded: 0,
            totalBytes: file.size,
            status: 'error',
            error: error.message
          });
        }
        reject(error);
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      const error = new ApiError(0, 'Network error occurred');
      if (onProgress) {
        onProgress({
          percentage: 0,
          bytesUploaded: 0,
          totalBytes: file.size,
          status: 'error',
          error: error.message
        });
      }
      reject(error);
    });

    xhr.open('POST', `${API_URL}/api/masterworks/upload`);
    xhr.send(formData);
  });
}

// Polling helper for long-running operations
export async function pollUploadProgress(
  uploadId: string,
  onProgress: (upload: MasterworkUpload) => void,
  interval: number = 1000
): Promise<MasterworkUpload> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await masterworkApi.getUploadProgress(uploadId);
        const upload = response.upload;

        onProgress(upload);

        if (upload.status === 'complete') {
          resolve(upload);
        } else if (upload.status === 'failed') {
          reject(new ApiError(500, upload.errorMessage || 'Upload failed'));
        } else {
          setTimeout(poll, interval);
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}
