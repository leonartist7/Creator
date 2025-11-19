'use client';

import React from 'react';
import { SmartSuggestion } from '@/types/enhanced';
import {
  Lightbulb,
  ChevronRight,
  X,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  onAction: (actionCallback: string, data?: any) => void;
  onDismiss: (suggestionId: string) => void;
}

export function SmartSuggestions({
  suggestions,
  onAction,
  onDismiss,
}: SmartSuggestionsProps) {
  const getTypeIcon = (type: SmartSuggestion['type']) => {
    switch (type) {
      case 'next-action':
        return <Target className="w-4 h-4 text-blue-500" />;
      case 'optimization':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'quality':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'productivity':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'inspiration':
        return <Sparkles className="w-4 h-4 text-pink-500" />;
    }
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    const styles = {
      high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      low: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    };

    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const getTypeLabel = (type: SmartSuggestion['type']): string => {
    switch (type) {
      case 'next-action':
        return 'Next Step';
      case 'optimization':
        return 'Optimization';
      case 'quality':
        return 'Quality';
      case 'productivity':
        return 'Productivity';
      case 'inspiration':
        return 'Inspiration';
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <Lightbulb className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-400 mb-1">All caught up!</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Keep writing and we'll provide smart suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Smart Suggestions</h3>
        <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
          {suggestions.length}
        </span>
      </div>

      {/* Suggestions List */}
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2 flex-1">
                {getTypeIcon(suggestion.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h4>
                    {getPriorityBadge(suggestion.priority)}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getTypeLabel(suggestion.type)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDismiss(suggestion.id)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Dismiss suggestion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 ml-6">
              {suggestion.description}
            </p>

            {/* Action Button */}
            {suggestion.action && (
              <button
                onClick={() => onAction(suggestion.action!.callback, suggestion.action!.data)}
                className="flex items-center gap-2 px-3 py-1.5 ml-6 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <span>{suggestion.action.label}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
