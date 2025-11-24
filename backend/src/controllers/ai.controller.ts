import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured');
      return res.status(503).json({
        error: 'AI service not configured',
        content: null
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful writing assistant. Generate high-quality content based on user prompts. Return only the requested content without additional commentary or formatting unless specifically asked.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      content: generatedContent,
    });
  } catch (error: any) {
    console.error('AI generation error:', error);

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        error: 'OpenAI API quota exceeded',
        content: null
      });
    }

    res.status(500).json({
      error: 'Failed to generate content',
      details: error.message,
      content: null
    });
  }
};
