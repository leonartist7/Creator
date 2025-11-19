export const mockAIResponses = {
  generateOutline: {
    chapters: [
      { title: 'Introduction', summary: 'Overview of the topic' },
      { title: 'Core Concepts', summary: 'Main ideas explained' },
      { title: 'Conclusion', summary: 'Final thoughts' }
    ]
  },
  improveText: {
    original: 'This is a test.',
    improved: 'This is a well-crafted test sentence with enhanced clarity and impact.'
  },
  generateIdeas: [
    { idea: 'AI-Powered Writing Assistant', confidence: 0.95 },
    { idea: 'Content Marketing Toolkit', confidence: 0.87 },
    { idea: 'Productivity Dashboard', confidence: 0.82 }
  ]
}

// Mock function for OpenAI
export function mockOpenAI(vi: any) {
  return vi.fn().mockResolvedValue(mockAIResponses.improveText)
}

// Mock function for Anthropic
export function mockAnthropic(vi: any) {
  return vi.fn().mockResolvedValue(mockAIResponses.generateOutline)
}
