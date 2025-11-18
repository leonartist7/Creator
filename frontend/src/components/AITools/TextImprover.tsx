import { useState } from 'react';
import { Button } from '../ui/Button';
import api from '../../utils/api';
import { Wand2, Loader2, Copy } from 'lucide-react';
import { useToast } from '../ui/Toast';

export const TextImprover = () => {
  const [originalText, setOriginalText] = useState('');
  const [improvementType, setImprovementType] = useState('clarity');
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Text
          </label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Paste your text here to improve it..."
            className="input min-h-[200px] resize-y"
            rows={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            {originalText.split(/\s+/).filter(Boolean).length} words, {originalText.length} characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Improvement Type
          </label>
          <div className="space-y-2">
            {improvementTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  improvementType === type.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
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
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
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
            <p className="text-gray-600">Improving your text...</p>
          </div>
        </div>
      )}

      {improvedText && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Improved Text</h3>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy size={16} className="mr-2" />
              Copy
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Original</h4>
              <div className="card-flat bg-gray-50 min-h-[200px]">
                <div className="whitespace-pre-wrap text-sm text-gray-600">{originalText}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Improved</h4>
              <div className="card-flat bg-success-50 border-success-200 min-h-[200px]">
                <div className="whitespace-pre-wrap text-sm text-gray-900">{improvedText}</div>
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
