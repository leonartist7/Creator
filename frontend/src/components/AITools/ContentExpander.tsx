import { useState } from 'react';
import { Button } from '../ui/Button';
import api from '../../utils/api';
import { Maximize2, Loader2, Copy } from 'lucide-react';
import { useToast } from '../ui/Toast';

export const ContentExpander = () => {
  const [bullets, setBullets] = useState('');
  const [style, setStyle] = useState('conversational');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedContent, setExpandedContent] = useState('');
  const { success, error } = useToast();

  const handleExpand = async () => {
    if (!bullets.trim()) {
      error('Missing Content', 'Please provide bullet points to expand');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/ai/expand-content', {
        bullets,
        style,
      });

      setExpandedContent(response.data.data.content);
      success('Content Expanded!', 'Your bullet points have been expanded');
    } catch (err: any) {
      error('Expansion Failed', err.response?.data?.error?.message || 'Failed to expand content');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(expandedContent);
    success('Copied!', 'Content copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Bullet Points or Outline
          </label>
          <textarea
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
            placeholder="Enter your bullet points, one per line:&#10;&#10;• Introduction to the topic&#10;• Main benefits and features&#10;• How to get started&#10;• Best practices and tips"
            className="input min-h-[200px] resize-y font-mono text-sm"
            rows={10}
          />
          <p className="text-xs text-muted mt-1">
            Separate each point with a new line or bullet point (•, -, *)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Writing Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="input"
          >
            <option value="conversational">Conversational & Friendly</option>
            <option value="professional">Professional & Formal</option>
            <option value="persuasive">Persuasive & Sales-Oriented</option>
            <option value="educational">Educational & Informative</option>
            <option value="storytelling">Storytelling & Engaging</option>
            <option value="technical">Technical & Detailed</option>
          </select>
        </div>

        <Button
          onClick={handleExpand}
          isLoading={isLoading}
          className="w-full"
        >
          <Maximize2 size={18} className="mr-2" />
          Expand Content
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-secondary">Expanding your content...</p>
          </div>
        </div>
      )}

      {expandedContent && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-primary">Expanded Content</h3>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy size={16} className="mr-2" />
              Copy
            </Button>
          </div>

          <div className="card-flat prose max-w-none">
            <div className="whitespace-pre-wrap">{expandedContent}</div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setExpandedContent('')}>
              Expand New Content
            </Button>
            <Button onClick={copyToClipboard}>
              Copy to Clipboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
