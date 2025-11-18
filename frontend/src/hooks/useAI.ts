import { useSettingsStore } from '../stores/settingsStore';
import { useToast } from '../components/ui/Toast';

export type AITask =
  | 'expand'
  | 'continue'
  | 'improve'
  | 'suggest'
  | 'research'
  | 'outline'
  | 'title'
  | 'translate'
  | 'grammar';

interface AIResponse {
  text: string;
  success: boolean;
  error?: string;
}

export const useAI = () => {
  const { apiKeys, activeProvider, selectedModel } = useSettingsStore();
  const { error: showError } = useToast();

  const checkAPIKey = (): boolean => {
    const key = apiKeys[activeProvider];
    if (!key) {
      showError(
        'API Key Missing',
        `Please add your ${activeProvider} API key in Settings`
      );
      return false;
    }
    return true;
  };

  const callOpenAI = async (
    prompt: string,
    systemPrompt?: string
  ): Promise<AIResponse> => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKeys.openai}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content,
        success: true,
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const callAnthropic = async (
    prompt: string,
    systemPrompt?: string
  ): Promise<AIResponse> => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeys.anthropic || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.content[0].text,
        success: true,
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const callGoogle = async (
    prompt: string,
    systemPrompt?: string
  ): Promise<AIResponse> => {
    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKeys.google}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.candidates[0].content.parts[0].text,
        success: true,
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const generate = async (
    prompt: string,
    systemPrompt?: string
  ): Promise<AIResponse> => {
    if (!checkAPIKey()) {
      return { text: '', success: false, error: 'No API key' };
    }

    switch (activeProvider) {
      case 'openai':
        return callOpenAI(prompt, systemPrompt);
      case 'anthropic':
        return callAnthropic(prompt, systemPrompt);
      case 'google':
        return callGoogle(prompt, systemPrompt);
      default:
        return { text: '', success: false, error: 'Unknown provider' };
    }
  };

  const expand = async (text: string): Promise<AIResponse> => {
    return generate(
      text,
      'You are a helpful writing assistant. Expand the following text into a more detailed version while maintaining the core message. Keep the tone professional and engaging.'
    );
  };

  const continueWriting = async (text: string): Promise<AIResponse> => {
    return generate(
      `Continue writing from here:\n\n${text}`,
      'You are a creative writing assistant. Continue the text naturally, maintaining the same style, tone, and voice.'
    );
  };

  const improve = async (text: string): Promise<AIResponse> => {
    return generate(
      text,
      'You are an expert editor. Improve the following text for clarity, flow, and impact. Fix any grammar or spelling errors. Keep the core message but make it better.'
    );
  };

  const suggest = async (context: string): Promise<AIResponse> => {
    return generate(
      `Context: ${context}\n\nProvide 3-5 suggestions for what to write next.`,
      'You are a creative writing coach. Provide helpful, specific suggestions.'
    );
  };

  const research = async (topic: string): Promise<AIResponse> => {
    return generate(
      `Research topic: ${topic}\n\nProvide a comprehensive overview including key points, facts, and relevant information.`,
      'You are a research assistant. Provide accurate, well-organized information.'
    );
  };

  const generateOutline = async (
    title: string,
    type: string
  ): Promise<AIResponse> => {
    return generate(
      `Create a detailed outline for a ${type} titled "${title}". Include main sections/chapters and key points for each.`,
      'You are an expert content strategist. Create comprehensive, well-structured outlines.'
    );
  };

  const generateTitle = async (description: string): Promise<AIResponse> => {
    return generate(
      `Generate 5 compelling titles for content about: ${description}`,
      'You are a marketing expert. Create catchy, SEO-friendly titles that grab attention.'
    );
  };

  const translate = async (
    text: string,
    targetLanguage: string
  ): Promise<AIResponse> => {
    return generate(
      `Translate to ${targetLanguage}:\n\n${text}`,
      'You are a professional translator. Provide accurate translations while preserving tone and meaning.'
    );
  };

  const checkGrammar = async (text: string): Promise<AIResponse> => {
    return generate(
      text,
      'You are a grammar expert. Check this text for grammar, spelling, and punctuation errors. Provide the corrected version.'
    );
  };

  const chat = async (message: string, history: any[] = []): Promise<AIResponse> => {
    const messages = history.map((h) => `${h.role}: ${h.content}`).join('\n');
    return generate(
      `${messages}\n\nUser: ${message}`,
      'You are a helpful AI assistant for a digital product creator. Help with brainstorming, writing, editing, and content strategy.'
    );
  };

  return {
    generate,
    expand,
    continue: continueWriting,
    improve,
    suggest,
    research,
    generateOutline,
    generateTitle,
    translate,
    checkGrammar,
    chat,
    hasAPIKey: checkAPIKey,
  };
};
