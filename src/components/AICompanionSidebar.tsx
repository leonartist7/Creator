'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useProject } from '@/contexts/ProjectContext';
import { useTemplate } from '@/contexts/TemplateContext';

export default function AICompanionSidebar() {
  const { theme, textColor, cardBg, borderColor } = useTheme();
  const { currentProject, calculateProjectStats } = useProject();
  const { selectedTemplate, getTemplateConfig } = useTemplate();
  const [collapsed, setCollapsed] = useState(false);

  const metadata = currentProject?.metadata;
  const templateConfig = selectedTemplate ? getTemplateConfig(selectedTemplate) : null;

  // Simulated AI suggestions based on template
  const suggestions = templateConfig?.aiSuggestions || [];

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className={`
          fixed right-0 top-1/2 transform -translate-y-1/2
          px-2 py-8 rounded-l-lg
          ${cardBg} ${borderColor} border-l border-t border-b
          ${textColor}
          hover:bg-opacity-80 transition-all
          shadow-lg
        `}
      >
        <div className="writing-mode-vertical">AI Assistant</div>
      </button>
    );
  }

  return (
    <div className={`w-80 ${cardBg} ${borderColor} border-l ${textColor} flex flex-col h-screen overflow-hidden`}>
      {/* Header */}
      <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
        <h2 className={`font-bold text-lg ${textColor}`}>AI Companion</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          →
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Project Intelligence */}
        <div>
          <h3 className={`font-semibold mb-3 ${textColor}`}>Project Intelligence</h3>

          {/* Strength Map */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Clarity
                </span>
                <span className={`text-sm font-semibold ${textColor}`}>
                  {metadata?.clarityScore || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metadata?.clarityScore || 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Creativity
                </span>
                <span className={`text-sm font-semibold ${textColor}`}>
                  {metadata?.creativityScore || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metadata?.creativityScore || 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Coherence
                </span>
                <span className={`text-sm font-semibold ${textColor}`}>
                  {metadata?.coherenceScore || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metadata?.coherenceScore || 0}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculateProjectStats}
            className={`
              mt-3 w-full px-3 py-2 rounded-lg text-sm
              ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
              transition-colors
            `}
          >
            Analyze Now
          </button>
        </div>

        {/* Reading Level */}
        <div>
          <h3 className={`font-semibold mb-2 ${textColor}`}>Reading Level</h3>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-lg p-3`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span className={textColor}>{metadata?.readingLevel || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Tone Analysis */}
        <div>
          <h3 className={`font-semibold mb-2 ${textColor}`}>Tone</h3>
          <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-lg p-3`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              <span className={textColor}>{metadata?.tone || 'Neutral'}</span>
            </div>
          </div>
        </div>

        {/* Template-Specific Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h3 className={`font-semibold mb-2 ${textColor}`}>AI Suggestions</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`
                    ${theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-800'}
                    border rounded-lg p-3 text-sm
                  `}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500">💡</span>
                    <span className={textColor}>{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Section Suggestion */}
        {metadata?.suggestedNextSection && (
          <div>
            <h3 className={`font-semibold mb-2 ${textColor}`}>Suggested Next</h3>
            <div className={`${theme === 'light' ? 'bg-green-50 border-green-200' : 'bg-green-900/20 border-green-800'} border rounded-lg p-3`}>
              <div className="flex items-start gap-2">
                <span className="text-green-500">→</span>
                <span className={textColor}>{metadata.suggestedNextSection}</span>
              </div>
            </div>
          </div>
        )}

        {/* Structure Suggestions */}
        <div>
          <h3 className={`font-semibold mb-2 ${textColor}`}>Structure Tips</h3>
          <div className="space-y-2 text-sm">
            <div className={`flex items-start gap-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              <span>•</span>
              <span>Consider adding subheadings for better flow</span>
            </div>
            <div className={`flex items-start gap-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              <span>•</span>
              <span>Your paragraphs are well-balanced</span>
            </div>
            <div className={`flex items-start gap-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              <span>•</span>
              <span>Strong opening hook detected</span>
            </div>
          </div>
        </div>

        {/* Completion Tracking */}
        <div>
          <h3 className={`font-semibold mb-2 ${textColor}`}>Completion</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${metadata?.completionPercentage || 0}%` }}
                />
              </div>
            </div>
            <span className={`font-bold ${textColor}`}>
              {metadata?.completionPercentage || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
