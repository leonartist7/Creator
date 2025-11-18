import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import api from '../../utils/api';
import { Heading, Loader2, Copy, Star } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface TitleOption {
  title: string;
  formula: string;
  seoScore: number;
}

export const TitleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [productType, setProductType] = useState('ebook');
  const [isLoading, setIsLoading] = useState(false);
  const [titles, setTitles] = useState<TitleOption[]>([]);
  const { success, error } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      error('Missing Topic', 'Please provide a topic for your product');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/ai/generate-titles', {
        topic,
        type: productType,
      });

      setTitles(response.data.data.content || []);
      success('Titles Generated!', `Created ${response.data.data.content?.length || 0} title options`);
    } catch (err: any) {
      error('Generation Failed', err.response?.data?.error?.message || 'Failed to generate titles');
    } finally {
      setIsLoading(false);
    }
  };

  const copyTitle = async (title: string) => {
    await navigator.clipboard.writeText(title);
    success('Copied!', 'Title copied to clipboard');
  };

  const getSEOBadgeVariant = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'gray';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Product Topic"
          placeholder="e.g., Email Marketing for Small Businesses"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Product Type
          </label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="input"
          >
            <option value="ebook">Ebook</option>
            <option value="course">Online Course</option>
            <option value="guide">Guide</option>
            <option value="workbook">Workbook</option>
            <option value="template">Template</option>
            <option value="checklist">Checklist</option>
          </select>
        </div>

        <Button
          onClick={handleGenerate}
          isLoading={isLoading}
          className="w-full"
        >
          <Heading size={18} className="mr-2" />
          Generate Titles
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-secondary">Generating title options...</p>
          </div>
        </div>
      )}

      {titles.length > 0 && !isLoading && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-primary">Title Options</h3>

          <div className="space-y-3">
            {titles.map((titleOption, index) => (
              <div
                key={index}
                className="card-flat group hover:border-primary-300 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getSEOBadgeVariant(titleOption.seoScore)}>
                        SEO: {titleOption.seoScore}/10
                      </Badge>
                      {titleOption.seoScore >= 8 && (
                        <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                      )}
                    </div>
                    <h4 className="font-semibold text-primary text-lg mb-1">
                      {titleOption.title}
                    </h4>
                    <p className="text-sm text-muted">
                      Formula: {titleOption.formula}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyTitle(titleOption.title)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setTitles([])}>
              Generate New Titles
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
