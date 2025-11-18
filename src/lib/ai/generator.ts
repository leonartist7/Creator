import {
  AIGenerationRequest,
  AIGenerationResponse,
  AnalyzeFileFunction,
} from '@/types/templates';
import { interpolateTemplate } from './template-interpolator';
import { getTemplate } from '@/config/templates';

/**
 * Main AI content generation function
 * Uses OpenAI or Anthropic Claude based on preference
 */
export async function generateSectionContent(
  request: AIGenerationRequest,
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<AIGenerationResponse> {
  console.log('[AI Generator] Generating content for:', {
    projectId: request.projectId,
    sectionId: request.sectionId,
    templateId: request.templateId,
    provider,
  });

  // Interpolate the AI prompt template with actual values
  const prompt = interpolateTemplate(
    request.sectionConfig.aiPromptTemplate,
    {
      ...request.inputs,
      ...request.context,
      index: request.sectionId.split('_').pop() || '1',
    }
  );

  const template = getTemplate(request.templateId);

  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemPrompt: template.aiConfig.systemPrompt,
        temperature: template.aiConfig.temperature,
        maxTokens: template.aiConfig.maxTokens,
        provider,
        model: template.aiConfig.model,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate content');
    }

    const data = await response.json();

    return {
      content: data.content,
      metadata: {
        model: data.model,
        tokensUsed: data.tokensUsed,
        generatedAt: new Date(),
      },
    };
  } catch (error) {
    console.error('[AI Generator] Error:', error);
    throw error;
  }
}

/**
 * Regenerate content for an existing section
 * Can apply different variations or tones
 */
export async function regenerateSectionContent(
  request: AIGenerationRequest,
  variation?: 'expand' | 'shorten' | 'change-tone',
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<AIGenerationResponse> {
  console.log('[AI Generator] Regenerating with variation:', variation);

  let modifiedRequest = { ...request };

  if (variation === 'expand') {
    modifiedRequest.sectionConfig = {
      ...request.sectionConfig,
      aiPromptTemplate: request.sectionConfig.aiPromptTemplate + '\n\nMake this version MORE DETAILED and COMPREHENSIVE. Add examples, elaboration, and deeper insights.',
    };
  } else if (variation === 'shorten') {
    modifiedRequest.sectionConfig = {
      ...request.sectionConfig,
      aiPromptTemplate: request.sectionConfig.aiPromptTemplate + '\n\nMake this version MORE CONCISE. Keep only the most essential information while maintaining clarity.',
    };
  } else if (variation === 'change-tone') {
    modifiedRequest.sectionConfig = {
      ...request.sectionConfig,
      aiPromptTemplate: request.sectionConfig.aiPromptTemplate + '\n\nREWRITE this in a different tone while keeping the same core message and information.',
    };
  }

  return generateSectionContent(modifiedRequest, provider);
}

/**
 * Analyze uploaded reference file to extract writing style
 * Used primarily by the Story/Bestseller template
 */
export const analyzeReferenceFile: AnalyzeFileFunction = async (file) => {
  console.log('[AI Generator] Analyzing reference file:', file.name);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/ai/analyze-file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze file');
    }

    const analysis = await response.json();
    return analysis;
  } catch (error) {
    console.error('[AI Generator] File analysis error:', error);
    throw error;
  }
};

/**
 * Generate variations for A/B testing
 * Used by Social Media and Advertising templates
 */
export async function generateVariations(
  request: AIGenerationRequest,
  count: number = 3,
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<AIGenerationResponse[]> {
  console.log('[AI Generator] Generating', count, 'variations');

  const variations: AIGenerationResponse[] = [];

  for (let i = 0; i < count; i++) {
    const variationRequest: AIGenerationRequest = {
      ...request,
      sectionConfig: {
        ...request.sectionConfig,
        aiPromptTemplate: request.sectionConfig.aiPromptTemplate + `\n\nCREATE VARIATION ${i + 1}: Use a DIFFERENT angle, hook, or approach while maintaining the core message.`,
      },
    };

    try {
      const variation = await generateSectionContent(variationRequest, provider);
      variations.push(variation);
    } catch (error) {
      console.error(`[AI Generator] Failed to generate variation ${i + 1}:`, error);
      // Continue with other variations even if one fails
    }
  }

  return variations;
}

/**
 * Stream content generation (for real-time updates)
 * Useful for long-form content
 */
export async function* streamSectionContent(
  request: AIGenerationRequest,
  provider: 'openai' | 'anthropic' = 'openai'
): AsyncGenerator<string, void, unknown> {
  const prompt = interpolateTemplate(
    request.sectionConfig.aiPromptTemplate,
    {
      ...request.inputs,
      ...request.context,
    }
  );

  const template = getTemplate(request.templateId);

  const response = await fetch('/api/ai/generate-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      systemPrompt: template.aiConfig.systemPrompt,
      temperature: template.aiConfig.temperature,
      maxTokens: template.aiConfig.maxTokens,
      provider,
    }),
  });

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    yield chunk;
  }
}
