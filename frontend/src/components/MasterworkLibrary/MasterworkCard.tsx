// Masterwork Card Component - Individual masterwork display
// US2 Implementation - T058

import React, { useState } from 'react';
import {
  Masterwork,
  FILE_FORMAT_LABELS,
  ANALYSIS_STATUS_LABELS,
  ANALYSIS_STATUS_COLORS,
  formatFileSize
} from '../../types/masterwork.types';

interface MasterworkCardProps {
  masterwork: Masterwork;
  viewMode: 'grid' | 'list';
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
}

const MasterworkCard: React.FC<MasterworkCardProps> = ({
  masterwork,
  viewMode,
  onDelete,
  onUpdate
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(masterwork.userNotes || '');
  const [editRating, setEditRating] = useState(masterwork.rating || 0);

  const handleDelete = () => {
    onDelete(masterwork.id);
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = () => {
    onUpdate(masterwork.id, {
      userNotes: editNotes,
      rating: editRating || null
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditNotes(masterwork.userNotes || '');
    setEditRating(masterwork.rating || 0);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const analysisStatusColor = ANALYSIS_STATUS_COLORS[masterwork.analysisStatus];

  if (viewMode === 'list') {
    return (
      <div className="masterwork-card list-view">
        <div className="card-main">
          <div className="card-cover">
            {masterwork.coverImageUrl ? (
              <img src={masterwork.coverImageUrl} alt={masterwork.title} />
            ) : (
              <div className="cover-placeholder">
                <span className="format-badge">{masterwork.format}</span>
              </div>
            )}
          </div>

          <div className="card-info">
            <h3 className="card-title">{masterwork.title}</h3>
            {masterwork.author && <p className="card-author">by {masterwork.author}</p>}

            <div className="card-meta">
              <span className="meta-item">
                {formatFileSize(masterwork.fileSize)}
              </span>
              <span className="meta-separator">•</span>
              <span className="meta-item">
                {masterwork.wordCount.toLocaleString()} words
              </span>
              <span className="meta-separator">•</span>
              <span className="meta-item">
                {formatDate(masterwork.uploadDate)}
              </span>
            </div>

            {masterwork.customTags.length > 0 && (
              <div className="card-tags">
                {masterwork.customTags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="card-status">
            <span
              className={`status-badge status-${analysisStatusColor}`}
              title="Analysis status"
            >
              {ANALYSIS_STATUS_LABELS[masterwork.analysisStatus]}
            </span>

            {masterwork.rating && (
              <div className="rating">
                {'★'.repeat(masterwork.rating)}
                {'☆'.repeat(5 - masterwork.rating)}
              </div>
            )}
          </div>

          <div className="card-actions">
            <button
              className="action-btn"
              onClick={() => setShowActions(!showActions)}
              title="More actions"
            >
              ⋮
            </button>

            {showActions && (
              <div className="actions-menu">
                <button onClick={() => { setIsEditing(true); setShowActions(false); }}>
                  Edit
                </button>
                <button onClick={() => window.location.href = `/masterworks/${masterwork.id}`}>
                  View Details
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(true); setShowActions(false); }}
                  className="danger"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="card-edit">
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add notes..."
              rows={3}
            />
            <div className="edit-rating">
              <label>Rating:</label>
              <select value={editRating} onChange={(e) => setEditRating(parseInt(e.target.value))}>
                <option value="0">No rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div className="edit-actions">
              <button onClick={handleCancelEdit}>Cancel</button>
              <button onClick={handleSaveEdit} className="primary">Save</button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="delete-confirm">
            <p>Are you sure you want to delete "{masterwork.title}"? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button onClick={handleDelete} className="danger">Delete</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div className="masterwork-card grid-view">
      <div className="card-cover">
        {masterwork.coverImageUrl ? (
          <img src={masterwork.coverImageUrl} alt={masterwork.title} />
        ) : (
          <div className="cover-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2" />
            </svg>
          </div>
        )}

        <span className="format-badge">{masterwork.format}</span>

        <span
          className={`status-badge status-${analysisStatusColor}`}
          title="Analysis status"
        >
          {ANALYSIS_STATUS_LABELS[masterwork.analysisStatus]}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title" title={masterwork.title}>
          {masterwork.title}
        </h3>

        {masterwork.author && (
          <p className="card-author" title={masterwork.author}>
            by {masterwork.author}
          </p>
        )}

        <div className="card-meta">
          <span>{masterwork.wordCount.toLocaleString()} words</span>
          <span className="meta-separator">•</span>
          <span>{formatDate(masterwork.uploadDate)}</span>
        </div>

        {masterwork.rating && (
          <div className="rating">
            {'★'.repeat(masterwork.rating)}
            {'☆'.repeat(5 - masterwork.rating)}
          </div>
        )}

        {masterwork.customTags.length > 0 && (
          <div className="card-tags">
            {masterwork.customTags.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
            {masterwork.customTags.length > 3 && (
              <span className="tag">+{masterwork.customTags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="card-footer">
        <button
          className="card-btn"
          onClick={() => window.location.href = `/masterworks/${masterwork.id}`}
        >
          View
        </button>
        <button
          className="card-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          Edit
        </button>
        <button
          className="card-btn danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete
        </button>
      </div>

      {isEditing && (
        <div className="card-edit-overlay">
          <div className="edit-modal">
            <h4>Edit {masterwork.title}</h4>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add notes..."
              rows={4}
            />
            <div className="edit-rating">
              <label>Rating:</label>
              <select value={editRating} onChange={(e) => setEditRating(parseInt(e.target.value))}>
                <option value="0">No rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div className="edit-actions">
              <button onClick={handleCancelEdit}>Cancel</button>
              <button onClick={handleSaveEdit} className="primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="card-edit-overlay">
          <div className="delete-modal">
            <h4>Delete Masterwork</h4>
            <p>Are you sure you want to delete "{masterwork.title}"?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button onClick={handleDelete} className="danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterworkCard;
