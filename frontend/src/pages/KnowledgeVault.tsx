// Knowledge Vault Page - Main library interface
// US2 Implementation - T061

import React, { useState } from 'react';
import { useMasterworks } from '../hooks/useMasterworks';
import MasterworkLibrary from '../components/MasterworkLibrary/MasterworkLibrary';
import MasterworkUpload from '../components/MasterworkUpload/MasterworkUpload';

const KnowledgeVault: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);

  const {
    masterworks,
    total,
    page,
    pageSize,
    loading,
    error,
    setPage,
    setFilters,
    setSort,
    setSearchQuery,
    refresh,
    deleteMasterwork,
    updateMasterwork
  } = useMasterworks({
    initialPageSize: 20,
    initialSort: { field: 'uploadDate', direction: 'desc' }
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteMasterwork(id);
    } catch (err: any) {
      alert(`Failed to delete masterwork: ${err.message}`);
    }
  };

  const handleUpdate = async (id: string, updates: any) => {
    try {
      await updateMasterwork(id, updates);
    } catch (err: any) {
      alert(`Failed to update masterwork: ${err.message}`);
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    refresh();
  };

  return (
    <div className="knowledge-vault-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Knowledge Vault</h1>
          <p className="subtitle">
            Upload and analyze masterworks to learn their creative DNA
          </p>
        </div>

        <button
          className="upload-btn primary"
          onClick={() => setShowUpload(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Upload Masterwork
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={refresh}>Retry</button>
        </div>
      )}

      {showUpload && (
        <div className="upload-modal">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowUpload(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <MasterworkUpload />

            <div className="modal-footer">
              <button onClick={handleUploadComplete}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-content">
        <MasterworkLibrary
          masterworks={masterworks}
          total={total}
          page={page}
          pageSize={pageSize}
          loading={loading}
          onPageChange={setPage}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          onSearchChange={setSearchQuery}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>

      {/* Quick stats */}
      {!loading && total > 0 && (
        <div className="vault-stats">
          <div className="stat-card">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Masterworks</span>
          </div>

          <div className="stat-card">
            <span className="stat-value">
              {masterworks.filter(m => m.analysisStatus === 'completed').length}
            </span>
            <span className="stat-label">Analyzed</span>
          </div>

          <div className="stat-card">
            <span className="stat-value">
              {masterworks.reduce((sum, m) => sum + m.wordCount, 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Words</span>
          </div>

          <div className="stat-card">
            <span className="stat-value">
              {new Set(masterworks.flatMap(m => m.customTags)).size}
            </span>
            <span className="stat-label">Unique Tags</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeVault;
