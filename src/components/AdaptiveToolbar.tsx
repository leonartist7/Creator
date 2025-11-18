'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTemplate } from '@/contexts/TemplateContext';
import { useProject } from '@/contexts/ProjectContext';

interface AdaptiveToolbarProps {
  onToggleZen: () => void;
  onToggleAISidebar: () => void;
  onToggleTemplateSidebar: () => void;
}

export default function AdaptiveToolbar({
  onToggleZen,
  onToggleAISidebar,
  onToggleTemplateSidebar,
}: AdaptiveToolbarProps) {
  const { theme, toggleTheme, textColor, cardBg, borderColor } = useTheme();
  const { selectedTemplate } = useTemplate();
  const { currentProject } = useProject();
  const [writingPhase, setWritingPhase] = useState<'drafting' | 'editing' | 'polishing'>('drafting');

  const metadata = currentProject?.metadata;

  return (
    <div className={`${cardBg} ${borderColor} border-b px-6 py-3 flex items-center justify-between`}>
      {/* Left: Phase Selector */}
      <div className="flex items-center gap-2">
        <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          Phase:
        </span>
        <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          {['drafting', 'editing', 'polishing'].map((phase) => (
            <button
              key={phase}
              onClick={() => setWritingPhase(phase as any)}
              className={`
                px-3 py-1 rounded text-xs font-medium transition-all
                ${
                  writingPhase === phase
                    ? 'bg-blue-500 text-white'
                    : theme === 'light'
                    ? 'text-gray-700 hover:bg-gray-300'
                    : 'text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Quick Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Words:
          </span>
          <span className={`font-semibold ${textColor}`}>
            {metadata?.totalWords || 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Progress:
          </span>
          <span className={`font-semibold ${textColor}`}>
            {metadata?.completionPercentage || 0}%
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Phase-Specific Tools */}
        {writingPhase === 'drafting' && (
          <button
            className={`
              px-3 py-1.5 rounded-lg text-sm
              ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
              transition-colors
            `}
          >
            💡 Ideas
          </button>
        )}

        {writingPhase === 'editing' && (
          <button
            className={`
              px-3 py-1.5 rounded-lg text-sm
              ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
              transition-colors
            `}
          >
            ✓ Check Grammar
          </button>
        )}

        {writingPhase === 'polishing' && (
          <button
            className={`
              px-3 py-1.5 rounded-lg text-sm
              ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
              transition-colors
            `}
          >
            ✨ Enhance
          </button>
        )}

        {/* Voice Input Button */}
        <button
          className={`
            px-3 py-1.5 rounded-lg text-sm
            ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
            transition-colors
          `}
          title="Voice to Text"
        >
          🎤
        </button>

        {/* Zen Mode */}
        <button
          onClick={onToggleZen}
          className={`
            px-3 py-1.5 rounded-lg text-sm
            ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
            transition-colors
          `}
          title="Zen Mode"
        >
          🧘
        </button>

        {/* Toggle Sidebars */}
        <button
          onClick={onToggleTemplateSidebar}
          className={`
            px-3 py-1.5 rounded-lg text-sm
            ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
            transition-colors
          `}
          title="Toggle Template Sidebar"
        >
          📚
        </button>

        <button
          onClick={onToggleAISidebar}
          className={`
            px-3 py-1.5 rounded-lg text-sm
            ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
            transition-colors
          `}
          title="Toggle AI Sidebar"
        >
          🤖
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`
            px-3 py-1.5 rounded-lg text-sm
            ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
            transition-colors
          `}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
}
