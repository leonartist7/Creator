// Style Compare Component - Compare two masterwork styles
// Phase 8 Implementation

import React, { useState } from 'react';
import { Masterwork } from '../../types/masterwork.types';

interface StyleCompareProps {
  masterworks: Masterwork[];
}

interface ComparisonResult {
  masterwork1: { id: string; title: string };
  masterwork2: { id: string; title: string };
  similarities: Array<{
    metric: string;
    similarity: number;
    description: string;
  }>;
  differences: Array<{
    metric: string;
    delta: number;
    description: string;
  }>;
  overallSimilarity: number;
}

const StyleCompare: React.FC<StyleCompareProps> = ({ masterworks }) => {
  const [masterwork1Id, setMasterwork1Id] = useState('');
  const [masterwork2Id, setMasterwork2Id] = useState('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzedMasterworks = masterworks.filter(m => m.analysisStatus === 'completed');

  const handleCompare = async () => {
    if (!masterwork1Id || !masterwork2Id) {
      setError('Please select two masterworks to compare');
      return;
    }

    if (masterwork1Id === masterwork2Id) {
      setError('Please select two different masterworks');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-studio/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterworkId1: masterwork1Id,
          masterworkId2: masterwork2Id
        })
      });

      if (!response.ok) {
        throw new Error('Comparison failed');
      }

      const data = await response.json();
      setComparison(data.comparison);
    } catch (err: any) {
      setError(err.message || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (similarity: number): string => {
    if (similarity >= 80) return '#22c55e'; // green
    if (similarity >= 60) return '#84cc16'; // lime
    if (similarity >= 40) return '#eab308'; // yellow
    if (similarity >= 20) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="style-compare">
      <h2>Compare Writing Styles</h2>

      <div className="compare-selectors">
        <div className="selector-group">
          <label htmlFor="masterwork1">First Masterwork</label>
          <select
            id="masterwork1"
            value={masterwork1Id}
            onChange={(e) => setMasterwork1Id(e.target.value)}
          >
            <option value="">Select a masterwork...</option>
            {analyzedMasterworks.map(m => (
              <option key={m.id} value={m.id}>
                {m.title} {m.author && `by ${m.author}`}
              </option>
            ))}
          </select>
        </div>

        <div className="vs-indicator">VS</div>

        <div className="selector-group">
          <label htmlFor="masterwork2">Second Masterwork</label>
          <select
            id="masterwork2"
            value={masterwork2Id}
            onChange={(e) => setMasterwork2Id(e.target.value)}
          >
            <option value="">Select a masterwork...</option>
            {analyzedMasterworks.map(m => (
              <option key={m.id} value={m.id}>
                {m.title} {m.author && `by ${m.author}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="compare-btn primary"
        onClick={handleCompare}
        disabled={loading || !masterwork1Id || !masterwork2Id}
      >
        {loading ? 'Comparing...' : 'Compare Styles'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {comparison && (
        <div className="comparison-results">
          <div className="overall-similarity">
            <h3>Overall Similarity</h3>
            <div className="similarity-gauge">
              <div
                className="similarity-fill"
                style={{
                  width: `${comparison.overallSimilarity}%`,
                  backgroundColor: getSimilarityColor(comparison.overallSimilarity)
                }}
              />
              <span className="similarity-value">{comparison.overallSimilarity}%</span>
            </div>
            <p className="similarity-description">
              {comparison.overallSimilarity >= 80 && 'Very similar writing styles'}
              {comparison.overallSimilarity >= 60 && comparison.overallSimilarity < 80 && 'Moderately similar styles'}
              {comparison.overallSimilarity >= 40 && comparison.overallSimilarity < 60 && 'Somewhat different styles'}
              {comparison.overallSimilarity < 40 && 'Distinctly different styles'}
            </p>
          </div>

          <div className="metric-comparisons">
            <h3>Metric-by-Metric Comparison</h3>
            {comparison.similarities.map((sim, idx) => (
              <div key={idx} className="metric-item">
                <div className="metric-header">
                  <span className="metric-name">{sim.metric}</span>
                  <span
                    className="metric-similarity"
                    style={{ color: getSimilarityColor(sim.similarity) }}
                  >
                    {sim.similarity.toFixed(0)}% similar
                  </span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill"
                    style={{
                      width: `${sim.similarity}%`,
                      backgroundColor: getSimilarityColor(sim.similarity)
                    }}
                  />
                </div>
                <p className="metric-description">{sim.description}</p>
              </div>
            ))}
          </div>

          {comparison.differences.length > 0 && (
            <div className="key-differences">
              <h3>Key Differences</h3>
              {comparison.differences.map((diff, idx) => (
                <div key={idx} className="difference-item">
                  <strong>{diff.metric}:</strong> {diff.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StyleCompare;
