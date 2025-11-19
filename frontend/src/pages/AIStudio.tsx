// AI Studio Page - Generate AI prompts from masterwork styles
// Phase 8 Implementation

import React, { useState, useEffect } from 'react';
import { useMasterworks } from '../hooks/useMasterworks';
import StylePrompt from '../components/AIStudio/StylePrompt';
import StyleCompare from '../components/AIStudio/StyleCompare';
import StyleBlend from '../components/AIStudio/StyleBlend';
import { Masterwork } from '../types/masterwork.types';

type TabType = 'prompt' | 'compare' | 'blend';

const AIStudio: React.FC = () => {
  const { masterworks, loading, error } = useMasterworks();
  const [activeTab, setActiveTab] = useState<TabType>('prompt');
  const [selectedMasterwork, setSelectedMasterwork] = useState<Masterwork | null>(null);

  const analyzedMasterworks = masterworks.filter(m => m.analysisStatus === 'completed');

  // Auto-select first analyzed masterwork for prompt view
  useEffect(() => {
    if (!selectedMasterwork && analyzedMasterworks.length > 0) {
      setSelectedMasterwork(analyzedMasterworks[0]);
    }
  }, [analyzedMasterworks, selectedMasterwork]);

  if (loading) {
    return (
      <div className="ai-studio-loading">
        <div className="spinner">
          <div className="spinner-ring"></div>
        </div>
        <p>Loading AI Studio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-studio-error">
        <h2>Error Loading AI Studio</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="ai-studio-page">
      <header className="page-header">
        <div className="header-content">
          <h1>AI Studio</h1>
          <p className="page-subtitle">
            Transform your masterwork styles into AI writing prompts
          </p>
        </div>

        {analyzedMasterworks.length === 0 && (
          <div className="warning-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>
              No analyzed masterworks found. Upload and analyze masterworks first to use AI Studio.
            </span>
          </div>
        )}
      </header>

      {analyzedMasterworks.length > 0 && (
        <>
          <nav className="studio-tabs">
            <button
              className={`tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
              onClick={() => setActiveTab('prompt')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeWidth="2"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Generate Prompt
            </button>

            <button
              className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
              onClick={() => setActiveTab('compare')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12h6M9 16h6M9 8h6" strokeWidth="2" strokeLinecap="round"/>
                <rect x="3" y="3" width="7" height="18" rx="1" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="18" rx="1" strokeWidth="2"/>
              </svg>
              Compare Styles
            </button>

            <button
              className={`tab-btn ${activeTab === 'blend' ? 'active' : ''}`}
              onClick={() => setActiveTab('blend')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Blend Styles
            </button>
          </nav>

          <div className="studio-content">
            {activeTab === 'prompt' && (
              <div className="prompt-tab">
                <div className="masterwork-selector">
                  <label htmlFor="masterwork-select">Select Masterwork:</label>
                  <select
                    id="masterwork-select"
                    value={selectedMasterwork?.id || ''}
                    onChange={(e) => {
                      const mw = analyzedMasterworks.find(m => m.id === e.target.value);
                      setSelectedMasterwork(mw || null);
                    }}
                  >
                    {analyzedMasterworks.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} {m.author && `by ${m.author}`}
                      </option>
                    ))}
                  </select>
                </div>

                <StylePrompt masterwork={selectedMasterwork} />
              </div>
            )}

            {activeTab === 'compare' && (
              <StyleCompare masterworks={masterworks} />
            )}

            {activeTab === 'blend' && (
              <StyleBlend masterworks={masterworks} />
            )}
          </div>
        </>
      )}

      {analyzedMasterworks.length === 0 && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-icon">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Get Started with AI Studio</h3>
          <p>
            AI Studio helps you generate writing prompts based on the unique style of your masterworks.
          </p>
          <ol className="getting-started-steps">
            <li>Upload a masterwork document (PDF, EPUB, DOCX, etc.)</li>
            <li>Wait for text extraction and style analysis to complete</li>
            <li>Return here to generate AI prompts, compare styles, or blend multiple styles</li>
          </ol>
          <a href="/library" className="cta-link">
            Go to Library →
          </a>
        </div>
      )}
    </div>
  );
};

export default AIStudio;
