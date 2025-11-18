import { TemplateConfig } from '@/types/templates';

export const onlineCourseTemplate: TemplateConfig = {
  id: 'online-course',
  name: 'Online Course',
  description: 'Structured course with modules, lessons, and exercises',
  icon: '🎓',
  category: 'Education',
  color: 'blue',
  bgGradient: 'from-blue-50 to-cyan-50',

  inputs: [
    {
      id: 'courseTopic',
      label: 'Course Topic',
      type: 'text',
      placeholder: 'e.g., "Mastering Python Programming"',
      required: true,
    },
    {
      id: 'targetAudience',
      label: 'Target Audience',
      type: 'text',
      placeholder: 'e.g., "Beginner programmers with basic computer skills"',
      required: true,
    },
    {
      id: 'moduleCount',
      label: 'Number of Modules',
      type: 'range',
      min: 3,
      max: 12,
      defaultValue: 6,
      required: true,
    },
    {
      id: 'lessonsPerModule',
      label: 'Lessons per Module',
      type: 'range',
      min: 2,
      max: 8,
      defaultValue: 4,
      description: 'Average number of lessons in each module',
      required: true,
    },
    {
      id: 'includeExercises',
      label: 'Include Exercises',
      type: 'toggle',
      defaultValue: true,
      description: 'Add practical exercises to each lesson',
    },
    {
      id: 'includeResources',
      label: 'Include Resources & Tools',
      type: 'toggle',
      defaultValue: true,
      description: 'Add a resources section to each module',
    },
  ],

  sections: [
    {
      id: 'modules',
      title: 'Module {{index}}',
      description: 'Course module with lessons and exercises',
      repeatable: true,
      minInstances: 3,
      maxInstances: 12,
      fields: [
        {
          id: 'moduleTitle',
          label: 'Module Title',
          type: 'text',
          placeholder: 'Enter module title',
        },
        {
          id: 'moduleGoals',
          label: 'Learning Goals',
          type: 'textarea',
          placeholder: 'What will students learn in this module?',
        },
      ],
      aiPromptTemplate: `Create Module {{index}} overview for an online course about {{courseTopic}}.

Module Title: {{moduleTitle}}
Learning Goals: {{moduleGoals}}
Target Audience: {{targetAudience}}

Generate:
- Module introduction (150-250 words)
- Detailed learning objectives (3-5 specific objectives)
- Prerequisites or required knowledge
- Estimated completion time

Format as a structured module overview.`,
      subSections: [
        {
          id: 'lessons',
          title: 'Lesson {{lessonIndex}}',
          description: 'Individual lesson content',
          repeatable: true,
          minInstances: 2,
          maxInstances: 8,
          fields: [
            {
              id: 'lessonTitle',
              label: 'Lesson Title',
              type: 'text',
              placeholder: 'Enter lesson title',
            },
            {
              id: 'lessonTopic',
              label: 'Lesson Topic',
              type: 'textarea',
              placeholder: 'What does this lesson cover?',
            },
          ],
          aiPromptTemplate: `Create Lesson {{lessonIndex}} for Module {{index}} of the {{courseTopic}} course.

Lesson Title: {{lessonTitle}}
Lesson Topic: {{lessonTopic}}
Target Audience: {{targetAudience}}

Generate:
- Lesson objectives (2-4 specific outcomes)
- Main content (explanations, concepts, examples) - 500-800 words
- Step-by-step instructions where applicable
- Key takeaways (3-5 points)

Use clear, instructional language appropriate for beginners.`,
        },
        {
          id: 'exercises',
          title: 'Exercises',
          description: 'Practical exercises for this module',
          optional: true,
          aiPromptTemplate: `Create practical exercises for Module {{index}} of the {{courseTopic}} course.

Module Title: {{moduleTitle}}
Target Audience: {{targetAudience}}

Generate:
- 3-5 hands-on exercises that reinforce the module concepts
- Each exercise should include:
  * Clear instructions
  * Expected outcome
  * Estimated time to complete
  * Difficulty level (Easy/Medium/Hard)

Make exercises progressively challenging.`,
        },
        {
          id: 'resources',
          title: 'Resources & Tools',
          description: 'Additional resources for this module',
          optional: true,
          aiPromptTemplate: `Create a resources and tools section for Module {{index}} of the {{courseTopic}} course.

Module Title: {{moduleTitle}}

Generate a curated list of:
- Recommended tools (with brief descriptions)
- Further reading materials
- Useful websites or documentation
- Video resources (suggest topics, not specific URLs)
- Cheat sheets or templates

Format as an organized, easy-to-scan list.`,
        },
      ],
    },
  ],

  aiConfig: {
    model: 'gpt-4',
    temperature: 0.6,
    maxTokens: 2000,
    systemPrompt: `You are an expert online course creator and instructional designer.
You create clear, structured, and engaging educational content.
Your lessons are practical, example-driven, and designed for effective learning.
You break down complex topics into digestible, actionable steps.`,
  },

  ui: {
    editorLayout: 'sections',
    showProgress: true,
    customToolbar: ['generate', 'regenerate', 'add-example', 'simplify'],
  },
};
