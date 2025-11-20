import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const AI_PROMPTS = {
  ideaGeneration: (niche: string, audience?: string) => `Generate 5 innovative digital product ideas for the ${niche} niche${audience ? ` targeting ${audience}` : ''}.

For each idea, provide:
- Product title
- Target audience
- Problem it solves
- Unique value proposition
- Estimated market size (small/medium/large)
- Suggested price point

Return the response as a JSON array with these exact fields: title, audience, problem, valueProposition, marketSize, suggestedPrice`,

  chapterOutline: (title: string, topic: string, style?: string) => `Create a detailed chapter outline for a ${style || 'comprehensive'} book titled "${title}" about ${topic}.

Include:
- 10-12 chapters with compelling titles
- 3-5 subtopics per chapter
- Estimated word count per chapter
- Key takeaways for readers

Return as JSON with chapters array containing: chapterNumber, title, subtopics (array), wordCount, keyTakeaways (array)`,

  contentExpansion: (bullets: string, style: string = 'conversational') => `Expand the following bullet points into engaging, well-structured paragraphs in a ${style} writing style:

${bullets}

Make it informative, engaging, and easy to read. Return only the expanded content.`,

  salesCopy: (title: string, type: string, audience: string, benefits: string[]) => `Write compelling sales copy for a digital product:

Title: ${title}
Type: ${type}
Target audience: ${audience}
Benefits: ${benefits.join(', ')}

Include:
- Attention-grabbing headline
- Compelling subheadline
- 5-7 key benefits with descriptions
- Feature highlights
- Social proof placeholder
- Strong call-to-action

Return as JSON with fields: headline, subheadline, benefits (array of objects with title and description), features (array), testimonialPlaceholder, cta`,

  titleGenerator: (topic: string, type: string) => `Generate 10 compelling titles for a ${type} about ${topic}. Use proven formulas like:

- "How to [Achieve Desired Outcome] Without [Common Obstacle]"
- "The [Time Period] Guide to [Topic]"
- "[Number] [Adjective] Ways to [Achieve Goal]"
- "The Ultimate [Topic] Blueprint for [Audience]"

Return as JSON array with fields: title, formula, seoScore (1-10)`,

  improveText: (text: string, improvement: string) => `Improve the following text by ${improvement}:

${text}

Return only the improved version while maintaining the original meaning and tone.`,
};

/**
 * Sleep helper for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry wrapper with exponential backoff
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a retryable error (529 Overloaded, 529, or rate limit)
      const isRetryable =
        error.status === 529 ||
        error.message?.includes('overloaded') ||
        error.message?.includes('Overloaded') ||
        error.status === 429;

      // Don't retry on last attempt or non-retryable errors
      if (attempt === maxRetries || !isRetryable) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`Anthropic API overloaded (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);

      await sleep(delay);
    }
  }

  throw lastError;
};

export const generateWithClaude = async (
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
    maxRetries?: number;
  } = {}
) => {
  const {
    model = 'claude-3-5-sonnet-20241022',
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt = 'You are a helpful AI assistant specialized in creating digital products like ebooks, courses, and guides. Always provide high-quality, well-structured, and engaging content.',
    maxRetries = 3,
  } = options;

  return retryWithBackoff(async () => {
    try {
      const message = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      const textContent = content.type === 'text' ? content.text : '';

      // Try to parse JSON if the response looks like JSON
      let parsedContent = textContent;
      if (textContent.trim().startsWith('{') || textContent.trim().startsWith('[')) {
        try {
          parsedContent = JSON.parse(textContent);
        } catch {
          // If parsing fails, return as text
        }
      }

      return {
        content: parsedContent,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        model: message.model,
        stopReason: message.stop_reason,
      };
    } catch (error: any) {
      console.error('Anthropic API error:', error);
      throw new Error(error.message || 'Failed to generate AI content');
    }
  }, maxRetries);
};

export const generateIdeas = async (niche: string, audience?: string) => {
  const prompt = AI_PROMPTS.ideaGeneration(niche, audience);
  return generateWithClaude(prompt);
};

export const generateOutline = async (title: string, topic: string, style?: string) => {
  const prompt = AI_PROMPTS.chapterOutline(title, topic, style);
  return generateWithClaude(prompt);
};

export const expandContent = async (bullets: string, style?: string) => {
  const prompt = AI_PROMPTS.contentExpansion(bullets, style || 'conversational');
  return generateWithClaude(prompt);
};

export const improveText = async (text: string, improvement: string) => {
  const prompt = AI_PROMPTS.improveText(text, improvement);
  return generateWithClaude(prompt);
};

export const generateTitles = async (topic: string, type: string) => {
  const prompt = AI_PROMPTS.titleGenerator(topic, type);
  return generateWithClaude(prompt);
};

export const generateSalesCopy = async (
  title: string,
  type: string,
  audience: string,
  benefits: string[]
) => {
  const prompt = AI_PROMPTS.salesCopy(title, type, audience, benefits);
  return generateWithClaude(prompt);
};

export default {
  generateWithClaude,
  generateIdeas,
  generateOutline,
  expandContent,
  improveText,
  generateTitles,
  generateSalesCopy,
  AI_PROMPTS,
};
