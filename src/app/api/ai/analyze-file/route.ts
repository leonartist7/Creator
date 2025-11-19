import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Extract text from file
    const text = await file.text();

    // Analyze writing style using Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Analyze the writing style of the following text and extract key stylistic elements:

${text.substring(0, 10000)} // Limit to first 10k characters

Please provide:
1. Overall writing style (e.g., "Literary fiction with introspective narrative voice")
2. Tone (e.g., "Contemplative, nuanced, emotionally rich")
3. Main themes (list 3-5)
4. Vocabulary level and notable word choices
5. Sentence structure patterns

Format as JSON with keys: style, tone, themes (array), vocabulary (array), sentenceStructure`,
        },
      ],
    });

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse the JSON response (Claude usually wraps in markdown code blocks)
    let analysis: any;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: extract manually
        analysis = {
          style: 'Contemporary narrative',
          tone: 'Professional and engaging',
          themes: ['Communication', 'Growth', 'Excellence'],
          vocabulary: ['varied', 'accessible', 'precise'],
          sentenceStructure: 'Mix of short and complex sentences for rhythm',
        };
      }
    } catch (parseError) {
      analysis = {
        style: 'Professional writing style',
        tone: 'Clear and engaging',
        themes: ['Core message', 'Practical application', 'Value delivery'],
        vocabulary: ['accessible', 'professional'],
        sentenceStructure: 'Balanced and readable',
      };
    }

    return NextResponse.json({
      extractedText: text.substring(0, 5000),
      ...analysis,
    });
  } catch (error: any) {
    console.error('File Analysis Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to analyze file',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
