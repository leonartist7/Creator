import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import {
  Sparkles,
  Copy,
  Search,
  Filter,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  MessageSquare,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'writing' | 'marketing' | 'business' | 'creative' | 'analysis' | 'technical';
  useCase: string;
  variables: string[]; // e.g., [TOPIC], [AUDIENCE]
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: '1',
    title: 'Comprehensive Blog Post',
    description: 'Generate a full blog post with introduction, body, and conclusion',
    prompt: `Write a comprehensive blog post about [TOPIC] for [AUDIENCE].

Structure:
1. Engaging introduction with a hook
2. 3-5 main sections with practical examples
3. Actionable takeaways
4. Strong conclusion with call-to-action

Tone: [TONE]
Length: Approximately 1500 words`,
    category: 'writing',
    useCase: 'Create long-form blog content quickly',
    variables: ['[TOPIC]', '[AUDIENCE]', '[TONE]'],
    icon: '📝',
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'Product Description Optimizer',
    description: 'Create compelling product descriptions that convert',
    prompt: `Write a persuasive product description for [PRODUCT NAME].

Include:
- Attention-grabbing headline
- Key features and benefits (focus on benefits over features)
- Social proof or credibility indicators
- Clear call-to-action
- SEO-optimized keywords: [KEYWORDS]

Target audience: [AUDIENCE]
Tone: Professional yet conversational
Length: 150-200 words`,
    category: 'marketing',
    useCase: 'E-commerce product pages',
    variables: ['[PRODUCT NAME]', '[KEYWORDS]', '[AUDIENCE]'],
    icon: '🛍️',
    difficulty: 'beginner',
  },
  {
    id: '3',
    title: 'Email Sequence Generator',
    description: 'Create a 5-email nurture sequence',
    prompt: `Create a 5-email nurture sequence for [PRODUCT/SERVICE].

Context: [CUSTOMER JOURNEY STAGE]
Goal: [PRIMARY GOAL]

For each email, provide:
1. Subject line (A/B test option included)
2. Email body (200-300 words)
3. Clear CTA
4. Best time to send

Overall tone: [TONE]
Target audience: [AUDIENCE]`,
    category: 'marketing',
    useCase: 'Email marketing campaigns',
    variables: ['[PRODUCT/SERVICE]', '[CUSTOMER JOURNEY STAGE]', '[PRIMARY GOAL]', '[TONE]', '[AUDIENCE]'],
    icon: '📧',
    difficulty: 'intermediate',
  },
  {
    id: '4',
    title: 'Business Plan Sections',
    description: 'Generate specific sections of a business plan',
    prompt: `Write the [SECTION] for a business plan for [BUSINESS IDEA].

Company: [COMPANY NAME]
Industry: [INDUSTRY]
Target Market: [TARGET MARKET]

Please include:
- Clear, professional language
- Data-driven insights where applicable
- Realistic projections
- Competitive analysis
- Risk mitigation strategies

Length: 500-750 words`,
    category: 'business',
    useCase: 'Business plan development',
    variables: ['[SECTION]', '[BUSINESS IDEA]', '[COMPANY NAME]', '[INDUSTRY]', '[TARGET MARKET]'],
    icon: '📊',
    difficulty: 'advanced',
  },
  {
    id: '5',
    title: 'Story Opening Hook',
    description: 'Create captivating story openings',
    prompt: `Write 3 different opening hooks for a story about [STORY CONCEPT].

Genre: [GENRE]
POV: [POINT OF VIEW]
Tone: [TONE]

For each opening:
- Create immediate intrigue
- Establish voice and tone
- Introduce conflict or tension
- Be approximately 150 words

Make them drastically different in approach.`,
    category: 'creative',
    useCase: 'Fiction and creative writing',
    variables: ['[STORY CONCEPT]', '[GENRE]', '[POINT OF VIEW]', '[TONE]'],
    icon: '✍️',
    difficulty: 'intermediate',
  },
  {
    id: '6',
    title: 'Social Media Content Calendar',
    description: 'Plan a week of social media posts',
    prompt: `Create a 7-day social media content calendar for [BRAND/TOPIC].

Platform: [PLATFORM]
Goals: [GOALS]
Target audience: [AUDIENCE]

For each day, provide:
1. Post copy (optimized for platform)
2. Suggested image/video concept
3. Best time to post
4. Relevant hashtags
5. Engagement question

Mix of content types: educational, entertaining, promotional`,
    category: 'marketing',
    useCase: 'Social media planning',
    variables: ['[BRAND/TOPIC]', '[PLATFORM]', '[GOALS]', '[AUDIENCE]'],
    icon: '📱',
    difficulty: 'intermediate',
  },
  {
    id: '7',
    title: 'Competitive Analysis',
    description: 'Analyze competitors comprehensively',
    prompt: `Conduct a competitive analysis for [YOUR PRODUCT/SERVICE].

Main competitors: [COMPETITOR NAMES]
Market: [MARKET/NICHE]

Analyze:
1. Strengths and weaknesses of each competitor
2. Market positioning
3. Pricing strategy
4. Unique value propositions
5. Market gaps and opportunities
6. Recommended differentiation strategy

Format: Professional report`,
    category: 'business',
    useCase: 'Market research and strategy',
    variables: ['[YOUR PRODUCT/SERVICE]', '[COMPETITOR NAMES]', '[MARKET/NICHE]'],
    icon: '🎯',
    difficulty: 'advanced',
  },
  {
    id: '8',
    title: 'FAQ Generator',
    description: 'Create comprehensive FAQ sections',
    prompt: `Generate 10 frequently asked questions and detailed answers for [PRODUCT/SERVICE/TOPIC].

Target audience: [AUDIENCE]
Focus areas: [KEY TOPICS]

For each Q&A:
- Anticipate real customer questions
- Provide clear, helpful answers
- Include examples where relevant
- Link to additional resources if applicable
- Optimize for SEO

Tone: Helpful and approachable`,
    category: 'writing',
    useCase: 'Customer support and SEO',
    variables: ['[PRODUCT/SERVICE/TOPIC]', '[AUDIENCE]', '[KEY TOPICS]'],
    icon: '❓',
    difficulty: 'beginner',
  },
  {
    id: '9',
    title: 'Technical Documentation',
    description: 'Write clear technical documentation',
    prompt: `Write technical documentation for [FEATURE/SYSTEM].

Audience: [TECHNICAL LEVEL]
Purpose: [PURPOSE]

Include:
1. Overview and purpose
2. Prerequisites
3. Step-by-step instructions
4. Code examples (if applicable)
5. Common issues and troubleshooting
6. Best practices
7. Related resources

Style: Clear, concise, scannable`,
    category: 'technical',
    useCase: 'API docs, user guides, tutorials',
    variables: ['[FEATURE/SYSTEM]', '[TECHNICAL LEVEL]', '[PURPOSE]'],
    icon: '⚙️',
    difficulty: 'advanced',
  },
  {
    id: '10',
    title: 'Headline Variations',
    description: 'Generate multiple headline options',
    prompt: `Create 10 different headline variations for [CONTENT/PRODUCT].

Context: [CONTEXT]
Target audience: [AUDIENCE]
Primary benefit: [BENEFIT]

Include mix of:
- Question headlines
- How-to headlines
- List headlines
- Curiosity-driven headlines
- Benefit-driven headlines

Each should be under 70 characters for SEO.`,
    category: 'marketing',
    useCase: 'Content marketing and copywriting',
    variables: ['[CONTENT/PRODUCT]', '[CONTEXT]', '[AUDIENCE]', '[BENEFIT]'],
    icon: '📰',
    difficulty: 'beginner',
  },
  {
    id: '11',
    title: 'Content Repurposing',
    description: 'Transform content across formats',
    prompt: `Repurpose this [ORIGINAL FORMAT] content into [TARGET FORMAT]:

Original content: [PASTE CONTENT]

Maintain:
- Core message and key points
- Brand voice
- Target audience: [AUDIENCE]

Adapt for:
- Platform-specific best practices
- Format-appropriate length
- Engagement optimization

Provide the repurposed content ready to publish.`,
    category: 'writing',
    useCase: 'Content efficiency',
    variables: ['[ORIGINAL FORMAT]', '[TARGET FORMAT]', '[PASTE CONTENT]', '[AUDIENCE]'],
    icon: '🔄',
    difficulty: 'intermediate',
  },
  {
    id: '12',
    title: 'Case Study Framework',
    description: 'Write compelling case studies',
    prompt: `Write a case study for [CLIENT/PROJECT].

Client: [CLIENT NAME]
Industry: [INDUSTRY]
Challenge: [CHALLENGE]
Solution: [SOLUTION]
Results: [RESULTS]

Structure:
1. Executive Summary
2. Background and Challenge
3. Solution Approach
4. Implementation
5. Results and Impact (with metrics)
6. Client Testimonial
7. Key Takeaways

Tone: Professional and results-focused
Length: 800-1000 words`,
    category: 'business',
    useCase: 'Sales and marketing materials',
    variables: ['[CLIENT/PROJECT]', '[CLIENT NAME]', '[INDUSTRY]', '[CHALLENGE]', '[SOLUTION]', '[RESULTS]'],
    icon: '📋',
    difficulty: 'intermediate',
  },
];

const CATEGORIES = [
  { value: 'writing', label: 'Writing', icon: FileText, color: 'blue' },
  { value: 'marketing', label: 'Marketing', icon: TrendingUp, color: 'red' },
  { value: 'business', label: 'Business', icon: Target, color: 'purple' },
  { value: 'creative', label: 'Creative', icon: Sparkles, color: 'pink' },
  { value: 'analysis', label: 'Analysis', icon: BookOpen, color: 'green' },
  { value: 'technical', label: 'Technical', icon: Zap, color: 'yellow' },
];

export const PromptTemplatesLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { success } = useToast();

  const handleCopyPrompt = async (template: PromptTemplate) => {
    await navigator.clipboard.writeText(template.prompt);
    success('Copied!', 'Prompt template copied to clipboard');
  };

  const filteredTemplates = PROMPT_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.useCase.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'secondary',
    };
    return colors[difficulty as keyof typeof colors] || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 glass-strong border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              AI Prompt Templates
            </h2>
            <p className="text-sm text-secondary mt-1">
              Pre-built prompts for common use cases - copy and customize
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded glass">
            <div className="text-2xl font-bold text-primary">{PROMPT_TEMPLATES.length}</div>
            <div className="text-xs text-muted">Templates</div>
          </div>
          <div className="text-center p-3 rounded glass">
            <div className="text-2xl font-bold text-blue-600">{CATEGORIES.length}</div>
            <div className="text-xs text-muted">Categories</div>
          </div>
          <div className="text-center p-3 rounded glass">
            <div className="text-2xl font-bold text-green-600">
              {PROMPT_TEMPLATES.filter((t) => t.difficulty === 'beginner').length}
            </div>
            <div className="text-xs text-muted">Beginner-Friendly</div>
          </div>
        </div>
      </Card>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-500 text-white'
                : 'glass text-secondary hover:text-primary'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'glass text-secondary hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Difficulty:</span>
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedDifficulty === level
                  ? 'bg-primary-500 text-white'
                  : 'glass text-secondary hover:text-primary'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-5 glass hover:glass-strong transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{template.icon}</span>
                <div>
                  <h4 className="font-semibold text-primary">{template.title}</h4>
                  <p className="text-xs text-muted">{template.useCase}</p>
                </div>
              </div>
              <Badge variant={getDifficultyColor(template.difficulty) as any} size="sm">
                {template.difficulty}
              </Badge>
            </div>

            <p className="text-sm text-secondary mb-3">{template.description}</p>

            <div className="mb-3 p-3 rounded glass-strong max-h-32 overflow-y-auto">
              <pre className="text-xs text-primary whitespace-pre-wrap font-mono">
                {template.prompt.substring(0, 200)}...
              </pre>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {template.variables.map((variable, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 font-mono"
                >
                  {variable}
                </span>
              ))}
            </div>

            <Button
              size="sm"
              onClick={() => handleCopyPrompt(template)}
              className="w-full"
            >
              <Copy size={14} className="mr-2" />
              Copy Template
            </Button>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-secondary">No templates found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
