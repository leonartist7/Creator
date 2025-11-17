import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const AI_PROMPTS = {
  ideaGeneration: (niche: string, audience?: string) => `Generate 5 innovative digital product ideas for the ${niche} niche${audience ? ` targeting ${audience}` : ''}. For each idea, provide:
    - Product title
    - Target audience
    - Problem it solves
    - Unique value proposition
    - Estimated market size (small/medium/large)
    - Suggested price point

    Format the response as a JSON array with these fields: title, audience, problem, valueProposition, marketSize, suggestedPrice`,

  chapterOutline: (title: string, topic: string, style?: string) => `Create a detailed chapter outline for a ${style || 'comprehensive'} book titled "${title}" about ${topic}.
    Include:
    - 10-12 chapters with compelling titles
    - 3-5 subtopics per chapter
    - Estimated word count per chapter
    - Key takeaways for readers

    Format as JSON with chapters array containing: chapterNumber, title, subtopics, wordCount, keyTakeaways`,

  contentExpansion: (bullets: string, style: string = 'conversational') => `Expand the following bullet points into engaging, well-structured paragraphs in a ${style} writing style:

    ${bullets}

    Make it informative, engaging, and easy to read.`,

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

    Format as JSON with fields: headline, subheadline, benefits, features, testimonialPlaceholder, cta`,

  titleGenerator: (topic: string, type: string) => `Generate 10 compelling titles for a ${type} about ${topic}. Use proven formulas like:
    - "How to [Achieve Desired Outcome] Without [Common Obstacle]"
    - "The [Time Period] Guide to [Topic]"
    - "[Number] [Adjective] Ways to [Achieve Goal]"
    - "The Ultimate [Topic] Blueprint for [Audience]"

    Format as JSON array with fields: title, formula, seoScore (1-10)`,

  improveText: (text: string, improvement: string) => `Improve the following text by ${improvement}:

    ${text}

    Return the improved version while maintaining the original meaning and tone.`,
};

export const generateWithAI = async (
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    responseFormat?: 'text' | 'json';
  } = {}
) => {
  try {
    const {
      model = 'gpt-4',
      maxTokens = 2000,
      temperature = 0.7,
      responseFormat = 'text',
    } = options;

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature,
      ...(responseFormat === 'json' && { response_format: { type: 'json_object' } }),
    });

    const content = completion.choices[0]?.message?.content || '';

    return {
      content: responseFormat === 'json' ? JSON.parse(content) : content,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: completion.model,
    };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(error.message || 'Failed to generate AI content');
  }
};

export const generateImage = async (
  prompt: string,
  options: {
    size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
  } = {}
) => {
  try {
    const { size = '1024x1024', quality = 'standard', style = 'vivid' } = options;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size,
      quality,
      style,
      n: 1,
    });

    return {
      url: response.data[0]?.url || '',
      revisedPrompt: response.data[0]?.revised_prompt,
    };
  } catch (error: any) {
    console.error('DALL-E API error:', error);
    throw new Error(error.message || 'Failed to generate image');
  }
};

export default {
  generateWithAI,
  generateImage,
  AI_PROMPTS,
};
