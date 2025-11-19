// Upload Progress Component - Visual progress indicator
// US1 Implementation - T043

import React from 'react';
import { UploadProgress as UploadProgressType } from '../../services/masterwork.service';

interface UploadProgressProps {
  progress: UploadProgressType;
  fileName: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, fileName }) => {
  const { percentage, bytesUploaded, totalBytes, status, error } = progress;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getStatusMessage = (): string => {
    switch (status) {
      case 'uploading':
        return `Uploading ${fileName}...`;
      case 'processing':
        return `Processing ${fileName}...`;
      case 'complete':
        return `Successfully uploaded ${fileName}`;
      case 'error':
        return `Failed to upload ${fileName}`;
      default:
        return 'Uploading...';
    }
  };

  const getStatusColor = (): string => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'blue';
      case 'complete':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className={`upload-progress status-${status}`}>
      <div className="progress-header">
        <h3>{getStatusMessage()}</h3>
        {status !== 'complete' && status !== 'error' && (
          <span className="progress-percentage">{percentage}%</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: getStatusColor()
          }}
        />
      </div>

      {/* Upload details */}
      {status === 'uploading' && (
        <div className="progress-details">
          <span>{formatBytes(bytesUploaded)} / {formatBytes(totalBytes)}</span>
        </div>
      )}

      {/* Processing message */}
      {status === 'processing' && (
        <div className="progress-details">
          <span>Extracting metadata and analyzing file...</span>
        </div>
      )}

      {/* Success message */}
      {status === 'complete' && (
        <div className="progress-success">
          <svg className="check-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span>File uploaded and ready for analysis</span>
        </div>
      )}

      {/* Error message */}
      {status === 'error' && error && (
        <div className="progress-error">
          <svg className="error-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Loading spinner for processing */}
      {status === 'processing' && (
        <div className="spinner">
          <div className="spinner-ring"></div>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;
