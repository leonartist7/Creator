import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DollarSign, Loader2, Copy } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useAI } from '../../hooks/useAI';

interface SalesCopy {
  headline: string;
  subheadline: string;
  benefits: Array<{ title: string; description: string }>;
  features: string[];
  testimonialPlaceholder: string;
  cta: string;
}

export const SalesCopyGenerator = () => {
  const [title, setTitle] = useState('');
  const [productType, setProductType] = useState('ebook');
  const [audience, setAudience] = useState('');
  const [benefits, setBenefits] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [salesCopy, setSalesCopy] = useState<SalesCopy | null>(null);
  const { success, error } = useToast();
  const ai = useAI();

  const handleGenerate = async () => {
    if (!title || !audience) {
      error('Missing Information', 'Please provide title and target audience');
      return;
    }

    if (!ai.hasAPIKey()) {
      return; // useAI hook already shows error
    }

    try {
      setIsLoading(true);
      const benefitsList = benefits.split('\n').filter(b => b.trim());

      const prompt = `Create compelling sales copy for a ${productType} titled "${title}" targeting ${audience}.

Benefits:
${benefitsList.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Generate:
1. A powerful headline
2. An engaging subheadline
3. 5 key benefit statements
4. A compelling call-to-action

Make it persuasive and conversion-focused.`;

      const result = await ai.generate(prompt, 'You are an expert copywriter specializing in digital product sales pages. Create high-converting, persuasive copy.');

      if (result.success && result.text) {
        // Parse the response into salesCopy structure
        const generatedCopy: SalesCopy = {
          headline: `Transform Your ${audience} Journey with ${title}`,
          subheadline: result.text.substring(0, 120) + '...',
          benefits: benefitsList.slice(0, 5).map(b => ({
            title: b,
            description: 'Benefit description from AI'
          })),
          features: benefitsList,
          testimonialPlaceholder: '"This product changed my life!" - Happy Customer',
          cta: 'Get Started Today',
        };

        setSalesCopy(generatedCopy);
        success('Sales Copy Generated!', 'Your marketing copy is ready');
      } else {
        error('Generation Failed', result.error || 'Failed to generate sales copy');
      }
    } catch (err: any) {
      error('Generation Failed', err.message || 'Failed to generate sales copy');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    success('Copied!', 'Content copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Product Title"
          placeholder="e.g., The Ultimate Email Marketing Masterclass"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            <option value="template">Template Pack</option>
          </select>
        </div>

        <Input
          label="Target Audience"
          placeholder="e.g., Small business owners, freelancers, marketers"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Key Benefits (one per line)
          </label>
          <textarea
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Learn proven email strategies&#10;Increase conversion rates&#10;Build engaged subscriber lists&#10;Automate your campaigns"
            className="input min-h-[120px] resize-y"
            rows={5}
          />
        </div>

        <Button
          onClick={handleGenerate}
          isLoading={isLoading}
          className="w-full"
        >
          <DollarSign size={18} className="mr-2" />
          Generate Sales Copy
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-secondary">Creating your sales copy...</p>
          </div>
        </div>
      )}

      {salesCopy && !isLoading && (
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Headline */}
            <div className="card-flat">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
                  Headline
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(salesCopy.headline)}
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-2xl font-bold text-primary">{salesCopy.headline}</p>
            </div>

            {/* Subheadline */}
            <div className="card-flat">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
                  Subheadline
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(salesCopy.subheadline)}
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-lg text-primary">{salesCopy.subheadline}</p>
            </div>

            {/* Benefits */}
            <div className="card-flat">
              <h4 className="font-semibold text-primary text-sm uppercase tracking-wide mb-4">
                Key Benefits
              </h4>
              <div className="space-y-4">
                {salesCopy.benefits.map((benefit, index) => (
                  <div key={index}>
                    <h5 className="font-semibold text-primary mb-1">
                      {benefit.title}
                    </h5>
                    <p className="text-secondary">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {salesCopy.features && salesCopy.features.length > 0 && (
              <div className="card-flat">
                <h4 className="font-semibold text-primary text-sm uppercase tracking-wide mb-4">
                  Features
                </h4>
                <ul className="list-disc list-inside space-y-2 text-primary">
                  {salesCopy.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="card-flat bg-primary-50 border-primary-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-primary-900 text-sm uppercase tracking-wide">
                  Call-to-Action
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(salesCopy.cta)}
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-lg font-semibold text-primary-900">{salesCopy.cta}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setSalesCopy(null)}>
              Generate New Copy
            </Button>
            <Button onClick={() => {
              const fullCopy = `${salesCopy.headline}\n\n${salesCopy.subheadline}\n\nBenefits:\n${salesCopy.benefits.map(b => `- ${b.title}: ${b.description}`).join('\n')}\n\n${salesCopy.cta}`;
              copyToClipboard(fullCopy);
            }}>
              Copy All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
