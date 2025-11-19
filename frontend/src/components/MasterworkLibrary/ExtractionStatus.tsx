// Extraction Status Indicator - Show text extraction progress
// Phase 5 Implementation - T083

import React from 'react';
import {
  ExtractionStatus as ExtractionStatusType,
  EXTRACTION_STATUS_LABELS,
  EXTRACTION_STATUS_COLORS
} from '../../types/masterwork.types';

interface ExtractionStatusProps {
  status: ExtractionStatusType;
  error?: string | null;
  compact?: boolean;
}

const ExtractionStatus: React.FC<ExtractionStatusProps> = ({
  status,
  error,
  compact = false
}) => {
  const statusColor = EXTRACTION_STATUS_COLORS[status];
  const statusLabel = EXTRACTION_STATUS_LABELS[status];

  if (compact) {
    return (
      <span
        className={`extraction-status-badge status-${statusColor}`}
        title={error || statusLabel}
      >
        {statusLabel}
      </span>
    );
  }

  return (
    <div className={`extraction-status status-${statusColor}`}>
      <div className="status-indicator">
        {status === 'processing' && (
          <div className="spinner-small">
            <div className="spinner-ring-small"></div>
          </div>
        )}

        {status === 'completed' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M20 6L9 17l-5-5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {status === 'failed' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {status === 'pending' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <div className="status-content">
        <div className="status-label">{statusLabel}</div>

        {status === 'processing' && (
          <div className="status-description">
            Extracting text from document...
          </div>
        )}

        {status === 'pending' && (
          <div className="status-description">
            Waiting to extract text
          </div>
        )}

        {status === 'failed' && error && (
          <div className="status-error">
            {error}
          </div>
        )}

        {status === 'completed' && (
          <div className="status-description">
            Text extraction complete
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractionStatus;
