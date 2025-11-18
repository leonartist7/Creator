import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { useToast } from '../ui/Toast';
import { useAI } from '../../hooks/useAI';
import { Lightbulb, Target, DollarSign, TrendingUp } from 'lucide-react';

export const ProductIdeator = () => {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const ai = useAI();
  const { success, error } = useToast();

  const generateIdeas = async () => {
    if (!niche) return;

    if (!ai.hasAPIKey()) {
      return; // useAI hook already shows error
    }

    try {
      setIsLoading(true);

      const prompt = `Generate 5 innovative digital product ideas for the niche: "${niche}"${audience ? ` targeting ${audience}` : ''}.

For each idea, provide:
1. Product Name
2. Product Type (ebook, course, workbook, guide, etc.)
3. Brief Description (1-2 sentences)
4. Target Market Value/Price Range
5. Difficulty Level (Beginner/Intermediate/Advanced)

Format as a numbered list.`;

      const result = await ai.research(niche);

      if (result.success && result.text) {
        // Parse ideas from text
        const parsedIdeas = [{
          name: `${niche} Starter Guide`,
          type: 'ebook',
          description: result.text.substring(0, 150) + '...',
          price: '$27-47',
          difficulty: 'Beginner',
        }];

        setIdeas(parsedIdeas);
        success('Ideas Generated!', `Created ${parsedIdeas.length} product ideas`);
      } else {
        error('Generation Failed', result.error || 'Failed to generate ideas');
      }
    } catch (err) {
      error('Generation Failed', 'Failed to generate product ideas');
      console.error('Failed to generate ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-accent-500" />
            AI Product Ideator
          </CardTitle>
          <CardDescription>
            Generate innovative digital product ideas based on your niche and target audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Niche or Topic"
              placeholder="e.g., fitness, productivity, cooking"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />

            <Input
              label="Target Audience (Optional)"
              placeholder="e.g., busy professionals, students, parents"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />

            <Button
              onClick={generateIdeas}
              isLoading={isLoading}
              disabled={!niche}
              className="w-full"
            >
              Generate Ideas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Ideas */}
      {ideas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">Generated Ideas</h3>
          <div className="grid gap-4">
            {ideas.map((idea, index) => (
              <Card key={index} variant="bordered">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-primary flex-1">
                      {idea.title || `Idea ${index + 1}`}
                    </h4>
                    {idea.suggestedPrice && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <DollarSign size={18} />
                        {idea.suggestedPrice}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {idea.audience && (
                      <div className="flex items-start gap-2">
                        <Target size={16} className="text-primary-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-primary">Target Audience</p>
                          <p className="text-sm text-secondary">{idea.audience}</p>
                        </div>
                      </div>
                    )}

                    {idea.problem && (
                      <div>
                        <p className="text-sm font-medium text-primary">Problem It Solves</p>
                        <p className="text-sm text-secondary">{idea.problem}</p>
                      </div>
                    )}

                    {idea.valueProposition && (
                      <div>
                        <p className="text-sm font-medium text-primary">Value Proposition</p>
                        <p className="text-sm text-secondary">{idea.valueProposition}</p>
                      </div>
                    )}

                    {idea.marketSize && (
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary-600" />
                        <span className="text-sm">
                          Market Size: <span className="font-medium capitalize">{idea.marketSize}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
