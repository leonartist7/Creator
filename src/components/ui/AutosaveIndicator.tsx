'use client';

import React from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';

interface AutosaveIndicatorProps {
  status: 'saved' | 'saving' | 'error' | 'idle';
  lastSaved?: Date;
}

export function AutosaveIndicator({ status, lastSaved }: AutosaveIndicatorProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Save className="w-4 h-4 animate-pulse" />,
          text: 'Saving...',
          color: 'text-blue-600 dark:text-blue-400',
        };
      case 'saved':
        return {
          icon: <Check className="w-4 h-4" />,
          text: lastSaved ? `Saved ${formatTimeSince(lastSaved)}` : 'Saved',
          color: 'text-green-600 dark:text-green-400',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Save failed',
          color: 'text-red-600 dark:text-red-400',
        };
      default:
        return null;
    }
  };

  const formatTimeSince = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
  };

  const display = getStatusDisplay();

  if (!display) return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${display.color}`}>
      {display.icon}
      <span>{display.text}</span>
    </div>
  );
}
