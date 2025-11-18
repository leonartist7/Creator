import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      systemPrompt,
      temperature = 0.7,
      maxTokens = 2000,
      provider = 'openai', // 'openai' or 'anthropic'
      model,
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let content: string;
    let aiModel: string;
    let tokensUsed: number = 0;

    if (provider === 'anthropic') {
      // Use Claude
      const response = await anthropic.messages.create({
        model: model || 'claude-3-5-sonnet-20241022',
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

      content = response.content[0].type === 'text' ? response.content[0].text : '';
      aiModel = response.model;
      tokensUsed = response.usage.input_tokens + response.usage.output_tokens;
    } else {
      // Use OpenAI (default)
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemPrompt || 'You are a professional writer and content creator.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await openai.chat.completions.create({
        model: model || 'gpt-4',
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      content = response.choices[0]?.message?.content || '';
      aiModel = response.model;
      tokensUsed = response.usage?.total_tokens || 0;
    }

    return NextResponse.json({
      content,
      model: aiModel,
      tokensUsed,
      provider,
    });
  } catch (error: any) {
    console.error('AI Generation Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate content',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
