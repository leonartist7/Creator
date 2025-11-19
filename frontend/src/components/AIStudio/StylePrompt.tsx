// Style Prompt Component - Display AI writing prompts based on style DNA
// Phase 8 Implementation

import React, { useState, useEffect } from 'react';
import { Masterwork } from '../../types/masterwork.types';

interface StylePromptProps {
  masterwork: Masterwork | null;
}

interface StylePromptResult {
  systemPrompt: string;
  userGuidance: string;
  styleHints: string[];
  technicalParameters: {
    temperature: number;
    topP: number;
    maxTokens: number;
  };
  styleProfile: {
    avgSentenceLength: number;
    vocabComplexity: number;
    uniqueWordRatio: number;
    dialogueRatio: number;
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    toneScore: number;
    sentimentScore: number;
  };
}

const StylePrompt: React.FC<StylePromptProps> = ({ masterwork }) => {
  const [promptData, setPromptData] = useState<StylePromptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (masterwork && masterwork.analysisStatus === 'completed') {
      loadPrompt();
    } else {
      setPromptData(null);
    }
  }, [masterwork]);

  const loadPrompt = async () => {
    if (!masterwork) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai-studio/style-prompt/${masterwork.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to generate style prompt');
      }

      const data = await response.json();
      setPromptData(data.stylePrompt);
    } catch (err: any) {
      setError(err.message || 'Failed to load prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getReadabilityLabel = (score: number): string => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };

  const getToneLabel = (score: number): string => {
    if (score > 0.5) return 'Very Conversational';
    if (score > 0) return 'Conversational';
    if (score === 0) return 'Neutral';
    if (score > -0.5) return 'Formal';
    return 'Very Formal';
  };

  if (!masterwork) {
    return (
      <div className="style-prompt-empty">
        <p>Select a masterwork to generate an AI style prompt</p>
      </div>
    );
  }

  if (masterwork.analysisStatus !== 'completed') {
    return (
      <div className="style-prompt-empty">
        <p>This masterwork has not been analyzed yet.</p>
        <p>Please wait for style analysis to complete.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="style-prompt-loading">
        <div className="spinner">
          <div className="spinner-ring"></div>
        </div>
        <p>Generating style prompt...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="style-prompt-error">
        <p className="error-message">{error}</p>
        <button className="retry-btn secondary" onClick={loadPrompt}>
          Retry
        </button>
      </div>
    );
  }

  if (!promptData) {
    return null;
  }

  return (
    <div className="style-prompt">
      <div className="prompt-header">
        <h3>AI Style Prompt for "{masterwork.title}"</h3>
        {masterwork.author && <p className="author-name">by {masterwork.author}</p>}
      </div>

      <div className="style-overview">
        <h4>Style Overview</h4>
        <div className="overview-grid">
          <div className="overview-item">
            <span className="overview-label">Sentence Length:</span>
            <span className="overview-value">
              {promptData.styleProfile.avgSentenceLength.toFixed(1)} words
            </span>
          </div>

          <div className="overview-item">
            <span className="overview-label">Vocabulary:</span>
            <span className="overview-value">
              {promptData.styleProfile.vocabComplexity.toFixed(0)}/100 complexity
            </span>
          </div>

          <div className="overview-item">
            <span className="overview-label">Readability:</span>
            <span className="overview-value">
              {getReadabilityLabel(promptData.styleProfile.fleschReadingEase)}
              {' '}(Grade {promptData.styleProfile.fleschKincaidGrade.toFixed(1)})
            </span>
          </div>

          <div className="overview-item">
            <span className="overview-label">Tone:</span>
            <span className="overview-value">
              {getToneLabel(promptData.styleProfile.toneScore)}
            </span>
          </div>

          <div className="overview-item">
            <span className="overview-label">Dialogue:</span>
            <span className="overview-value">
              {promptData.styleProfile.dialogueRatio.toFixed(1)}% of text
            </span>
          </div>

          <div className="overview-item">
            <span className="overview-label">Unique Words:</span>
            <span className="overview-value">
              {(promptData.styleProfile.uniqueWordRatio * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="user-guidance-section">
        <h4>Writing Guidance</h4>
        <p className="guidance-text">{promptData.userGuidance}</p>
      </div>

      <div className="style-hints-section">
        <h4>Key Style Guidelines</h4>
        <ul className="style-hints-list">
          {promptData.styleHints.map((hint, idx) => (
            <li key={idx} className="style-hint-item">{hint}</li>
          ))}
        </ul>
      </div>

      <div className="system-prompt-section">
        <div className="section-header">
          <h4>System Prompt</h4>
          <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={() => handleCopy(promptData.systemPrompt)}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2"/>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="prompt-display">
          <pre>{promptData.systemPrompt}</pre>
        </div>
      </div>

      <div className="technical-params-section">
        <h4>Recommended AI Parameters</h4>
        <div className="params-grid">
          <div className="param-item">
            <span className="param-label">Temperature:</span>
            <span className="param-value">{promptData.technicalParameters.temperature}</span>
            <span className="param-description">
              {promptData.technicalParameters.temperature < 0.5 ? 'More focused' : 'More creative'}
            </span>
          </div>

          <div className="param-item">
            <span className="param-label">Top P:</span>
            <span className="param-value">{promptData.technicalParameters.topP}</span>
            <span className="param-description">Nucleus sampling threshold</span>
          </div>

          <div className="param-item">
            <span className="param-label">Max Tokens:</span>
            <span className="param-value">{promptData.technicalParameters.maxTokens}</span>
            <span className="param-description">
              ~{Math.round(promptData.technicalParameters.maxTokens * 0.75)} words
            </span>
          </div>
        </div>
      </div>

      <div className="usage-instructions">
        <h4>How to Use</h4>
        <ol className="instructions-list">
          <li>Copy the system prompt above</li>
          <li>Paste it into your AI assistant's system prompt or instructions field</li>
          <li>Apply the recommended technical parameters (temperature, top_p, max_tokens)</li>
          <li>Provide your writing request as a user message</li>
          <li>The AI will generate content matching this masterwork's style</li>
        </ol>
      </div>

      <div className="export-options">
        <button
          className="export-btn secondary"
          onClick={() => handleCopy(JSON.stringify(promptData, null, 2))}
        >
          Export Full JSON
        </button>
      </div>
    </div>
  );
};

export default StylePrompt;
