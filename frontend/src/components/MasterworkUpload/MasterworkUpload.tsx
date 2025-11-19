// Masterwork Upload Component - Main upload interface
// US1 Implementation - T042, T044, T045

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { masterworkApi, uploadWithProgress, UploadProgress } from '../../services/masterwork.service';
import { FileFormat } from '../../types/masterwork.types';
import UploadProgressComponent from './UploadProgress';

const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE || '50') * 1024 * 1024;
const ALLOWED_FORMATS = ['application/pdf', 'application/epub+zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
const ALLOWED_EXTENSIONS = ['.pdf', '.epub', '.docx', '.txt', '.md'];

interface UploadState {
  file: File | null;
  progress: UploadProgress | null;
  uploadId: string | null;
  error: string | null;
  isUploading: boolean;
}

interface UploadMetadata {
  title: string;
  author?: string;
  isbn?: string;
  publicationDate?: string;
  customTags?: string[];
  userNotes?: string;
  rating?: number;
}

const MasterworkUpload: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: null,
    uploadId: null,
    error: null,
    isUploading: false
  });

  const [metadata, setMetadata] = useState<UploadMetadata>({
    title: '',
    author: '',
    customTags: []
  });

  const [showMetadataForm, setShowMetadataForm] = useState(false);

  // T045: File type validation on frontend
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
      };
    }

    if (file.size === 0) {
      return {
        valid: false,
        error: 'File is empty (0 bytes)'
      };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

    if (!hasAllowedExtension) {
      return {
        valid: false,
        error: `Invalid file format. Allowed formats: ${ALLOWED_EXTENSIONS.join(', ')}`
      };
    }

    // Check MIME type (if available)
    if (file.type && !ALLOWED_FORMATS.includes(file.type)) {
      console.warn('MIME type mismatch, trusting file extension');
    }

    return { valid: true };
  };

  // T044: Drag-drop handling using react-dropzone
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      setUploadState(prev => ({
        ...prev,
        error: error.message
      }));
      return;
    }

    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadState(prev => ({
        ...prev,
        error: validation.error || 'Invalid file'
      }));
      return;
    }

    // Set file and show metadata form
    setUploadState(prev => ({
      ...prev,
      file,
      error: null
    }));

    // Auto-populate title from filename
    const titleFromFilename = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    setMetadata(prev => ({
      ...prev,
      title: titleFromFilename
    }));

    setShowMetadataForm(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'application/pdf': ['.pdf'],
      'application/epub+zip': ['.epub'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    }
  });

  // Handle upload
  const handleUpload = async () => {
    if (!uploadState.file) {
      return;
    }

    if (!metadata.title.trim()) {
      setUploadState(prev => ({
        ...prev,
        error: 'Title is required'
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      error: null
    }));

    try {
      const response = await uploadWithProgress(
        uploadState.file,
        metadata,
        (progress) => {
          setUploadState(prev => ({
            ...prev,
            progress
          }));
        }
      );

      setUploadState(prev => ({
        ...prev,
        uploadId: response.uploadId,
        isUploading: false
      }));

      // Reset form after successful upload
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error: any) {
      setUploadState(prev => ({
        ...prev,
        error: error.message || 'Upload failed',
        isUploading: false
      }));
    }
  };

  const resetForm = () => {
    setUploadState({
      file: null,
      progress: null,
      uploadId: null,
      error: null,
      isUploading: false
    });
    setMetadata({
      title: '',
      author: '',
      customTags: []
    });
    setShowMetadataForm(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  // Render upload zone or metadata form
  if (!showMetadataForm) {
    return (
      <div className="masterwork-upload">
        <h2>Upload Masterwork</h2>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${uploadState.error ? 'error' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop your file here...</p>
          ) : (
            <div>
              <p>Drag & drop a file here, or click to select</p>
              <p className="formats">Supported formats: PDF, EPUB, DOCX, TXT, MD</p>
              <p className="size-limit">Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB</p>
            </div>
          )}
        </div>

        {uploadState.error && (
          <div className="error-message">
            <strong>Error:</strong> {uploadState.error}
          </div>
        )}
      </div>
    );
  }

  // Metadata form
  return (
    <div className="masterwork-upload">
      <h2>Upload Masterwork</h2>

      {uploadState.progress ? (
        <UploadProgressComponent progress={uploadState.progress} fileName={uploadState.file?.name || ''} />
      ) : (
        <div className="upload-form">
          <div className="file-info">
            <strong>File:</strong> {uploadState.file?.name} ({(uploadState.file?.size || 0) / 1024 / 1024} MB)
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                required
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                id="author"
                type="text"
                value={metadata.author}
                onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                id="isbn"
                type="text"
                value={metadata.isbn}
                onChange={(e) => setMetadata({ ...metadata, isbn: e.target.value })}
                maxLength={20}
              />
            </div>

            <div className="form-group">
              <label htmlFor="publicationDate">Publication Date</label>
              <input
                id="publicationDate"
                type="date"
                value={metadata.publicationDate}
                onChange={(e) => setMetadata({ ...metadata, publicationDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                value={metadata.rating || ''}
                onChange={(e) => setMetadata({ ...metadata, rating: e.target.value ? parseInt(e.target.value) : undefined })}
              >
                <option value="">No rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="userNotes">Notes</label>
              <textarea
                id="userNotes"
                value={metadata.userNotes}
                onChange={(e) => setMetadata({ ...metadata, userNotes: e.target.value })}
                rows={4}
              />
            </div>

            {uploadState.error && (
              <div className="error-message">
                <strong>Error:</strong> {uploadState.error}
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={handleCancel} disabled={uploadState.isUploading}>
                Cancel
              </button>
              <button type="submit" disabled={uploadState.isUploading || !metadata.title.trim()}>
                {uploadState.isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MasterworkUpload;
