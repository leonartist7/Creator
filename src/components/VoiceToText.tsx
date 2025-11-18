'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { VoiceToTextSettings } from '@/types';

interface VoiceToTextProps {
  onTextGenerated: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceToText({ onTextGenerated, isOpen, onClose }: VoiceToTextProps) {
  const { theme, textColor, cardBg, borderColor } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [settings, setSettings] = useState<VoiceToTextSettings>({
    enabled: true,
    autoImprove: true,
    removeFiller: true,
    tone: 'neutral',
  });

  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript((prev) => prev + finalTranscript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const improveText = useCallback((text: string): string => {
    if (!settings.autoImprove) return text;

    let improved = text;

    // Remove filler words
    if (settings.removeFiller) {
      const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually'];
      fillerWords.forEach((filler) => {
        const regex = new RegExp(`\\b${filler}\\b`, 'gi');
        improved = improved.replace(regex, '');
      });
    }

    // Clean up spacing
    improved = improved.replace(/\s+/g, ' ').trim();

    // Add proper punctuation (simplified)
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    if (!/[.!?]$/.test(improved)) {
      improved += '.';
    }

    // Apply tone transformation (simulated)
    switch (settings.tone) {
      case 'formal':
        improved = improved.replace(/gonna/g, 'going to').replace(/wanna/g, 'want to');
        break;
      case 'casual':
        // Keep conversational
        break;
      case 'creative':
        // Add more descriptive language (placeholder)
        break;
    }

    return improved;
  }, [settings]);

  const handleApplyText = useCallback(() => {
    const improvedText = improveText(transcript);
    onTextGenerated(improvedText);
    setTranscript('');
    onClose();
  }, [transcript, improveText, onTextGenerated, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`${cardBg} ${borderColor} border rounded-2xl shadow-2xl w-full max-w-2xl p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${textColor}`}>Voice to Text</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Settings */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className={textColor}>Auto-improve text</span>
            <input
              type="checkbox"
              checked={settings.autoImprove}
              onChange={(e) => setSettings({ ...settings, autoImprove: e.target.checked })}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className={textColor}>Remove filler words</span>
            <input
              type="checkbox"
              checked={settings.removeFiller}
              onChange={(e) => setSettings({ ...settings, removeFiller: e.target.checked })}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className={textColor}>Tone</span>
            <select
              value={settings.tone}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value as any })}
              className={`px-3 py-1 rounded-lg ${cardBg} ${borderColor} border ${textColor}`}
            >
              <option value="neutral">Neutral</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="creative">Creative</option>
            </select>
          </div>
        </div>

        {/* Recording Area */}
        <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-xl p-6 mb-6 min-h-[200px]`}>
          {isListening && (
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-500 animate-pulse flex items-center justify-center text-white text-3xl mb-2">
                🎤
              </div>
              <span className={`text-sm ${textColor}`}>Listening...</span>
            </div>
          )}

          {transcript ? (
            <p className={`${textColor} leading-relaxed`}>{transcript}</p>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} italic`}>
                {isListening ? 'Speak now...' : 'Click start to begin recording'}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`
              px-6 py-3 rounded-lg font-semibold
              ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
              text-white transition-colors
            `}
          >
            {isListening ? 'Stop Recording' : 'Start Recording'}
          </button>

          {transcript && (
            <div className="flex gap-2">
              <button
                onClick={() => setTranscript('')}
                className={`
                  px-4 py-2 rounded-lg
                  ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'}
                  transition-colors
                `}
              >
                Clear
              </button>
              <button
                onClick={handleApplyText}
                className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
              >
                Apply Text
              </button>
            </div>
          )}
        </div>

        {/* Browser Support Warning */}
        {!recognition && (
          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className={`text-sm ${textColor}`}>
              ⚠️ Voice recognition is not supported in your browser. Please use Chrome or Edge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
