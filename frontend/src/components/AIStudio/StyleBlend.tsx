// Style Blend Component - Blend multiple masterwork styles
// Phase 8 Implementation

import React, { useState } from 'react';
import { Masterwork } from '../../types/masterwork.types';

interface StyleBlendProps {
  masterworks: Masterwork[];
}

interface StyleInput {
  masterworkId: string;
  weight: number;
}

interface BlendedStyleResult {
  blendedMetrics: {
    avgSentenceLength: number;
    vocabComplexity: number;
    uniqueWordRatio: number;
    dialogueRatio: number;
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    toneScore: number;
    sentimentScore: number;
  };
  stylePrompt: {
    systemPrompt: string;
    userGuidance: string;
    styleHints: string[];
  };
  contributingStyles: Array<{
    masterworkId: string;
    title: string;
    weight: number;
    normalizedWeight: number;
  }>;
}

const StyleBlend: React.FC<StyleBlendProps> = ({ masterworks }) => {
  const [styleInputs, setStyleInputs] = useState<StyleInput[]>([
    { masterworkId: '', weight: 50 }
  ]);
  const [blendedStyle, setBlendedStyle] = useState<BlendedStyleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzedMasterworks = masterworks.filter(m => m.analysisStatus === 'completed');

  const handleAddStyle = () => {
    setStyleInputs([...styleInputs, { masterworkId: '', weight: 50 }]);
  };

  const handleRemoveStyle = (index: number) => {
    if (styleInputs.length > 1) {
      setStyleInputs(styleInputs.filter((_, i) => i !== index));
    }
  };

  const handleMasterworkChange = (index: number, masterworkId: string) => {
    const newInputs = [...styleInputs];
    newInputs[index].masterworkId = masterworkId;
    setStyleInputs(newInputs);
  };

  const handleWeightChange = (index: number, weight: number) => {
    const newInputs = [...styleInputs];
    newInputs[index].weight = Math.max(0, Math.min(100, weight));
    setStyleInputs(newInputs);
  };

  const handleBlend = async () => {
    // Validate inputs
    const validInputs = styleInputs.filter(input => input.masterworkId && input.weight > 0);

    if (validInputs.length < 2) {
      setError('Please select at least two masterworks to blend');
      return;
    }

    // Check for duplicates
    const ids = validInputs.map(i => i.masterworkId);
    if (new Set(ids).size !== ids.length) {
      setError('Please select different masterworks (no duplicates)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-studio/blend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ styles: validInputs })
      });

      if (!response.ok) {
        throw new Error('Style blending failed');
      }

      const data = await response.json();
      setBlendedStyle(data.blendedStyle);
    } catch (err: any) {
      setError(err.message || 'Blending failed');
    } finally {
      setLoading(false);
    }
  };

  const getTotalWeight = (): number => {
    return styleInputs.reduce((sum, input) => sum + (input.masterworkId ? input.weight : 0), 0);
  };

  const getNormalizedWeight = (weight: number): number => {
    const total = getTotalWeight();
    return total > 0 ? (weight / total) * 100 : 0;
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

  const getSentimentLabel = (score: number): string => {
    if (score > 0.3) return 'Positive';
    if (score > 0.1) return 'Slightly Positive';
    if (score > -0.1) return 'Neutral';
    if (score > -0.3) return 'Slightly Negative';
    return 'Negative';
  };

  return (
    <div className="style-blend">
      <h2>Blend Writing Styles</h2>
      <p className="blend-description">
        Combine multiple masterwork styles to create a unique writing voice.
        Adjust the weight of each style to control its influence.
      </p>

      <div className="style-inputs">
        {styleInputs.map((input, index) => {
          const normalizedWeight = getNormalizedWeight(input.weight);

          return (
            <div key={index} className="style-input-row">
              <div className="input-number">{index + 1}</div>

              <select
                className="masterwork-select"
                value={input.masterworkId}
                onChange={(e) => handleMasterworkChange(index, e.target.value)}
              >
                <option value="">Select a masterwork...</option>
                {analyzedMasterworks.map(m => (
                  <option
                    key={m.id}
                    value={m.id}
                    disabled={styleInputs.some((si, i) => i !== index && si.masterworkId === m.id)}
                  >
                    {m.title} {m.author && `by ${m.author}`}
                  </option>
                ))}
              </select>

              <div className="weight-controls">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={input.weight}
                  onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                  className="weight-slider"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={input.weight}
                  onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                  className="weight-input"
                />
                <span className="weight-label">
                  {normalizedWeight.toFixed(0)}% influence
                </span>
              </div>

              {styleInputs.length > 1 && (
                <button
                  className="remove-style-btn"
                  onClick={() => handleRemoveStyle(index)}
                  title="Remove this style"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="blend-actions">
        <button
          className="add-style-btn secondary"
          onClick={handleAddStyle}
          disabled={styleInputs.length >= 5}
        >
          + Add Style
        </button>

        <button
          className="blend-btn primary"
          onClick={handleBlend}
          disabled={loading || styleInputs.filter(i => i.masterworkId).length < 2}
        >
          {loading ? 'Blending...' : 'Blend Styles'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {blendedStyle && (
        <div className="blended-results">
          <h3>Blended Style Profile</h3>

          <div className="contributing-styles">
            <h4>Style Mix</h4>
            <div className="style-mix-chart">
              {blendedStyle.contributingStyles.map((style, idx) => (
                <div key={idx} className="style-contribution">
                  <div className="contribution-bar-container">
                    <div
                      className="contribution-bar"
                      style={{
                        width: `${style.normalizedWeight}%`,
                        backgroundColor: `hsl(${idx * 60}, 70%, 60%)`
                      }}
                    />
                  </div>
                  <div className="contribution-info">
                    <span className="contribution-title">{style.title}</span>
                    <span className="contribution-weight">
                      {style.normalizedWeight.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="blended-metrics">
            <h4>Blended Metrics</h4>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">Sentence Length</div>
                <div className="metric-value">
                  {blendedStyle.blendedMetrics.avgSentenceLength.toFixed(1)} words
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Vocabulary Complexity</div>
                <div className="metric-value">
                  {blendedStyle.blendedMetrics.vocabComplexity.toFixed(0)}/100
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Unique Words</div>
                <div className="metric-value">
                  {(blendedStyle.blendedMetrics.uniqueWordRatio * 100).toFixed(1)}%
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Dialogue</div>
                <div className="metric-value">
                  {blendedStyle.blendedMetrics.dialogueRatio.toFixed(1)}%
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Readability</div>
                <div className="metric-value">
                  {blendedStyle.blendedMetrics.fleschReadingEase.toFixed(0)}
                  <span className="metric-sublabel">
                    {getReadabilityLabel(blendedStyle.blendedMetrics.fleschReadingEase)}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Grade Level</div>
                <div className="metric-value">
                  Grade {blendedStyle.blendedMetrics.fleschKincaidGrade.toFixed(1)}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Tone</div>
                <div className="metric-value">
                  {getToneLabel(blendedStyle.blendedMetrics.toneScore)}
                  <span className="metric-sublabel">
                    {blendedStyle.blendedMetrics.toneScore.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Sentiment</div>
                <div className="metric-value">
                  {getSentimentLabel(blendedStyle.blendedMetrics.sentimentScore)}
                  <span className="metric-sublabel">
                    {blendedStyle.blendedMetrics.sentimentScore.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="style-guidance">
            <h4>Writing Guidelines</h4>
            <div className="guidance-text">
              <p>{blendedStyle.stylePrompt.userGuidance}</p>
            </div>
            <ul className="style-hints">
              {blendedStyle.stylePrompt.styleHints.map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          </div>

          <div className="system-prompt">
            <h4>AI System Prompt</h4>
            <div className="prompt-text">
              <pre>{blendedStyle.stylePrompt.systemPrompt}</pre>
            </div>
            <button
              className="copy-prompt-btn secondary"
              onClick={() => {
                navigator.clipboard.writeText(blendedStyle.stylePrompt.systemPrompt);
              }}
            >
              Copy Prompt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleBlend;
