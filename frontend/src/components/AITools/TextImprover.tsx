import { useState } from 'react';
import { Button } from '../ui/Button';
import api from '../../utils/api';
import { Wand2, Loader2, Copy, Settings2 } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { StyleSelector } from './StyleSelector';
import { StylePresets } from './StylePresets';

export const TextImprover = () => {
  const [originalText, setOriginalText] = useState('');
  const [improvementType, setImprovementType] = useState('clarity');
  const [targetStyle, setTargetStyle] = useState('professional');
  const [targetTone, setTargetTone] = useState('neutral');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [improvedText, setImprovedText] = useState('');
  const { success, error } = useToast();

  const handleImprove = async () => {
    if (!originalText.trim()) {
      error('Missing Text', 'Please provide text to improve');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/ai/improve-text', {
        text: originalText,
        improvement: improvementType,
        targetStyle: showAdvancedOptions ? targetStyle : undefined,
        targetTone: showAdvancedOptions ? targetTone : undefined,
      });

      setImprovedText(response.data.data.content);
      success('Text Improved!', 'Your content has been enhanced');
    } catch (err: any) {
      error('Improvement Failed', err.response?.data?.error?.message || 'Failed to improve text');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(improvedText);
    success('Copied!', 'Improved text copied to clipboard');
  };

  const improvementTypes = [
    { value: 'clarity', label: 'Improve Clarity', description: 'Make text clearer and easier to understand' },
    { value: 'grammar', label: 'Fix Grammar', description: 'Correct grammar, spelling, and punctuation' },
    { value: 'tone', label: 'Adjust Tone', description: 'Make more professional or conversational' },
    { value: 'concise', label: 'Make Concise', description: 'Remove unnecessary words and fluff' },
    { value: 'engaging', label: 'More Engaging', description: 'Add energy and reader engagement' },
    { value: 'professional', label: 'More Professional', description: 'Elevate language and formality' },
    { value: 'seo', label: 'SEO Optimize', description: 'Improve for search engines' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Original Text
          </label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Paste your text here to improve it..."
            className="input min-h-[200px] resize-y"
            rows={10}
          />
          <p className="text-xs text-muted mt-1">
            {originalText.split(/\s+/).filter(Boolean).length} words, {originalText.length} characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Improvement Type
          </label>
          <div className="space-y-2">
            {improvementTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  improvementType === type.value
                    ? 'border-primary-500 glass-strong'
                    : 'border-primary/20 glass hover:border-purple-500'
                }`}
              >
                <input
                  type="radio"
                  name="improvementType"
                  value={type.value}
                  checked={improvementType === type.value}
                  onChange={(e) => setImprovementType(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-primary">{type.label}</div>
                  <div className="text-sm text-secondary">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Style Options */}
        <div className="border-t border-primary/20 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-purple-500 transition-colors"
          >
            <Settings2 size={16} />
            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Style Options
          </button>

          {showAdvancedOptions && (
            <div className="mt-4 p-4 glass-strong rounded-lg space-y-4">
              <p className="text-xs text-secondary mb-3">
                Fine-tune the output style and tone for precise control
              </p>

              <StylePresets
                onPresetSelect={(preset) => {
                  setTargetStyle(preset.style);
                  setTargetTone(preset.tone);
                }}
                currentStyle={targetStyle}
                currentTone={targetTone}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 glass text-muted">or customize</span>
                </div>
              </div>

              <StyleSelector
                selectedStyle={targetStyle}
                selectedTone={targetTone}
                onStyleChange={setTargetStyle}
                onToneChange={setTargetTone}
                showTone={true}
                showCategories={false}
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleImprove}
          isLoading={isLoading}
          className="w-full"
        >
          <Wand2 size={18} className="mr-2" />
          Improve Text
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-secondary">Improving your text...</p>
          </div>
        </div>
      )}

      {improvedText && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-primary">Improved Text</h3>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy size={16} className="mr-2" />
              Copy
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-primary mb-2">Original</h4>
              <div className="glass rounded-lg p-4 min-h-[200px]">
                <div className="whitespace-pre-wrap text-sm text-secondary">{originalText}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                Improved
                <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 font-medium">
                  Enhanced
                </span>
              </h4>
              <div className="glass-strong rounded-lg p-4 min-h-[200px] border-2 border-green-500/20">
                <div className="whitespace-pre-wrap text-sm text-primary">{improvedText}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setImprovedText('')}>
              Improve New Text
            </Button>
            <Button onClick={copyToClipboard}>
              Copy Improved Version
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
