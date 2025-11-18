'use client';

import React, { useState } from 'react';
import { ContentVersion } from '@/types/enhanced';
import { History, RotateCcw, Eye, User, Sparkles, Clock } from 'lucide-react';

interface VersionHistoryProps {
  versions: ContentVersion[];
  currentContent: string;
  onRevert: (versionId: string) => void;
  onPreview: (content: string) => void;
}

export function VersionHistory({
  versions,
  currentContent,
  onRevert,
  onPreview,
}: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getWordCount = (content: string): number => {
    return content.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const getCreatorIcon = (createdBy: 'user' | 'ai') => {
    return createdBy === 'ai' ? (
      <Sparkles className="w-4 h-4 text-purple-500" />
    ) : (
      <User className="w-4 h-4 text-blue-500" />
    );
  };

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <History className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-400 mb-1">No version history yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Versions are saved automatically as you edit
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Version History</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({versions.length} {versions.length === 1 ? 'version' : 'versions'})
        </span>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto">
        {/* Current Version */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Current Version
              </span>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {getWordCount(currentContent)} words
            </span>
          </div>
        </div>

        {/* Previous Versions */}
        {versions.map((version, index) => (
          <div
            key={version.id}
            className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
              selectedVersion === version.id ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getCreatorIcon(version.createdBy)}
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Version {versions.length - index}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDate(version.createdAt)} • {version.createdBy === 'ai' ? 'AI Generated' : 'User Edit'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {getWordCount(version.content)} words
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onPreview(version.content)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <Eye className="w-3 h-3" />
                Preview
              </button>
              <button
                onClick={() => onRevert(version.id)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Revert
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Up to 10 versions are stored per section
        </p>
      </div>
    </div>
  );
}
