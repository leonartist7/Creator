'use client';

import React, { useState } from 'react';
import { GlobalProjectSettings } from '@/types/enhanced';
import { Settings, User, MessageSquare, Sparkles, Save } from 'lucide-react';

interface GlobalSettingsProps {
  settings: GlobalProjectSettings | undefined;
  onSave: (settings: GlobalProjectSettings) => void;
}

export function GlobalSettings({ settings, onSave }: GlobalSettingsProps) {
  const [localSettings, setLocalSettings] = useState<GlobalProjectSettings>(
    settings || {
      tone: 'professional',
      persona: '',
    }
  );

  const [brandAdjectives, setBrandAdjectives] = useState<string>(
    localSettings.brandVoice?.adjectives.join(', ') || ''
  );
  const [avoidWords, setAvoidWords] = useState<string>(
    localSettings.brandVoice?.avoidWords.join(', ') || ''
  );

  const tones: { value: GlobalProjectSettings['tone']; label: string; description: string }[] = [
    { value: 'mentor', label: '👨‍🏫 Mentor', description: 'Guiding and supportive' },
    { value: 'friend', label: '🤝 Friend', description: 'Warm and conversational' },
    { value: 'professor', label: '🎓 Professor', description: 'Academic and authoritative' },
    { value: 'storyteller', label: '📖 Storyteller', description: 'Narrative and engaging' },
    { value: 'expert', label: '🎯 Expert', description: 'Technical and precise' },
    { value: 'casual', label: '😊 Casual', description: 'Relaxed and friendly' },
    { value: 'professional', label: '💼 Professional', description: 'Formal and polished' },
  ];

  const handleSave = () => {
    const updatedSettings: GlobalProjectSettings = {
      ...localSettings,
      brandVoice: brandAdjectives.trim() || avoidWords.trim()
        ? {
            adjectives: brandAdjectives
              .split(',')
              .map((adj) => adj.trim())
              .filter((adj) => adj.length > 0),
            avoidWords: avoidWords
              .split(',')
              .map((word) => word.trim())
              .filter((word) => word.length > 0),
          }
        : undefined,
    };

    onSave(updatedSettings);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Global Project Settings</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Tone Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-3">
            <MessageSquare className="w-4 h-4" />
            Writing Tone
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            This tone will be applied to all AI-generated content in your project
          </p>
          <div className="grid grid-cols-2 gap-2">
            {tones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => setLocalSettings({ ...localSettings, tone: tone.value })}
                className={`p-3 text-left rounded-lg border-2 transition-all ${
                  localSettings.tone === tone.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {tone.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {tone.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Persona/Target Audience */}
        <div>
          <label
            htmlFor="persona"
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            <User className="w-4 h-4" />
            Target Persona
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Describe your target audience (e.g., "busy entrepreneurs", "college students")
          </p>
          <input
            id="persona"
            type="text"
            value={localSettings.persona}
            onChange={(e) => setLocalSettings({ ...localSettings, persona: e.target.value })}
            placeholder="e.g., Busy professionals seeking productivity tips"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Brand Voice */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Brand Voice (Optional)
            </h4>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Define your unique brand personality and style guidelines
          </p>

          {/* Brand Adjectives */}
          <div className="mb-4">
            <label
              htmlFor="brandAdjectives"
              className="block text-sm text-gray-700 dark:text-gray-300 mb-2"
            >
              Brand Adjectives
            </label>
            <input
              id="brandAdjectives"
              type="text"
              value={brandAdjectives}
              onChange={(e) => setBrandAdjectives(e.target.value)}
              placeholder="e.g., innovative, trustworthy, energetic"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Comma-separated adjectives that describe your brand
            </p>
          </div>

          {/* Avoid Words */}
          <div>
            <label
              htmlFor="avoidWords"
              className="block text-sm text-gray-700 dark:text-gray-300 mb-2"
            >
              Words to Avoid
            </label>
            <input
              id="avoidWords"
              type="text"
              value={avoidWords}
              onChange={(e) => setAvoidWords(e.target.value)}
              placeholder="e.g., literally, basically, synergy"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Words or phrases to exclude from generated content
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>

        {/* Info Message */}
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 These settings will be used for all future AI-generated content in this project.
            Existing content won't be changed.
          </p>
        </div>
      </div>
    </div>
  );
}
