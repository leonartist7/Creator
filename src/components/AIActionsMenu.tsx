'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { TextSelection, AIAction } from '@/types';

interface AIActionsMenuProps {
  selection: TextSelection;
  onClose: () => void;
}

interface ActionItem {
  id: AIAction;
  label: string;
  icon: string;
  category: string;
}

const actions: ActionItem[] = [
  // Core Actions
  { id: 'brainstorm', label: 'Brainstorm Ideas', icon: '💡', category: 'Generate' },
  { id: 'grammar', label: 'Fix Grammar', icon: '✓', category: 'Improve' },
  { id: 'translate', label: 'Translate', icon: '🌐', category: 'Transform' },
  { id: 'paraphrase', label: 'Paraphrase', icon: '🔄', category: 'Transform' },
  { id: 'expand', label: 'Expand', icon: '📈', category: 'Adjust' },
  { id: 'shorten', label: 'Shorten', icon: '📉', category: 'Adjust' },

  // Style Replacements
  { id: 'fun', label: 'Make Fun', icon: '🎉', category: 'Style' },
  { id: 'formal', label: 'Make Formal', icon: '🎓', category: 'Style' },
  { id: 'academic', label: 'Make Academic', icon: '📚', category: 'Style' },
  { id: 'playful', label: 'Make Playful', icon: '🎨', category: 'Style' },
  { id: 'emotional', label: 'Make Emotional', icon: '❤️', category: 'Style' },
  { id: 'statistical', label: 'Add Statistics', icon: '📊', category: 'Style' },

  // Advanced
  { id: 'creative', label: 'Creative Variations', icon: '✨', category: 'Generate' },
  { id: 'tone', label: 'Adjust Tone', icon: '🎭', category: 'Improve' },
];

export default function AIActionsMenu({ selection, onClose }: AIActionsMenuProps) {
  const { theme, textColor, cardBg, borderColor } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = (action: AIAction) => {
    console.log(`Performing ${action} on: "${selection.text}"`);
    // In production, this would call your AI API
    // For now, we'll simulate the action
    alert(`AI Action: ${action}\n\nSelected text: "${selection.text.substring(0, 50)}..."`);
    onClose();
  };

  // Group actions by category
  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, ActionItem[]>);

  return (
    <div
      ref={menuRef}
      className={`
        fixed z-50
        ${cardBg} ${borderColor} ${textColor}
        border rounded-xl shadow-2xl
        backdrop-blur-xl bg-opacity-95
        max-w-md
      `}
      style={{
        top: `${selection.position.y}px`,
        left: `${selection.position.x}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* Header */}
      <div className={`px-4 py-3 border-b ${borderColor}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>AI Actions</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          "{selection.text.substring(0, 30)}{selection.text.length > 30 ? '...' : ''}"
        </p>
      </div>

      {/* Actions Grid */}
      <div className="p-2 max-h-96 overflow-y-auto">
        {Object.entries(groupedActions).map(([category, items]) => (
          <div key={category} className="mb-3">
            <div className={`px-2 py-1 text-xs font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              {category}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {items.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`
                    px-3 py-2 rounded-lg text-left text-sm
                    ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}
                    transition-colors duration-150
                    flex items-center gap-2
                  `}
                >
                  <span>{action.icon}</span>
                  <span className={textColor}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
