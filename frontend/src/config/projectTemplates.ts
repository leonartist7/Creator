/**
 * Project Templates with Pre-filled Content
 * Provides scaffolding for different digital product types
 */

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: 'ebook' | 'course' | 'guide' | 'whitepaper' | 'newsletter';
  icon: string;
  gradient: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string; // Pre-filled HTML content
  outline: string[]; // Chapter/section structure
  wordCount: number;
  features: string[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'ebook-complete',
    name: 'Complete eBook Template',
    description: 'Full-featured eBook with 10 chapters, perfect for non-fiction',
    type: 'ebook',
    icon: '📚',
    gradient: 'from-blue-500 to-cyan-500',
    estimatedTime: '2-4 weeks',
    difficulty: 'intermediate',
    wordCount: 25000,
    features: ['10 Chapters', 'Introduction', 'Conclusion', 'About Author'],
    outline: [
      'Front Matter',
      'Introduction: Why This Matters',
      'Chapter 1: The Foundation',
      'Chapter 2: Core Concepts',
      'Chapter 3: Practical Application',
      'Chapter 4: Advanced Techniques',
      'Chapter 5: Common Challenges',
      'Chapter 6: Case Studies',
      'Chapter 7: Tools & Resources',
      'Chapter 8: Implementation Guide',
      'Chapter 9: Best Practices',
      'Chapter 10: Future Trends',
      'Conclusion: Your Next Steps',
      'About the Author',
    ],
    content: `<h1>Your eBook Title Here</h1>

<h2>Front Matter</h2>
<p><strong>Copyright © 2025 [Your Name]</strong></p>
<p>All rights reserved. No part of this publication may be reproduced without permission.</p>

<h2>Table of Contents</h2>
<ul>
<li>Introduction</li>
<li>Chapter 1: The Foundation</li>
<li>Chapter 2: Core Concepts</li>
<li>Chapter 3: Practical Application</li>
<li>Chapter 4: Advanced Techniques</li>
<li>Chapter 5: Common Challenges</li>
<li>Chapter 6: Case Studies</li>
<li>Chapter 7: Tools & Resources</li>
<li>Chapter 8: Implementation Guide</li>
<li>Chapter 9: Best Practices</li>
<li>Chapter 10: Future Trends</li>
<li>Conclusion</li>
</ul>

<h2>Introduction: Why This Matters</h2>
<p>Welcome to this comprehensive guide on [TOPIC]. In this book, you'll discover...</p>

<p><strong>What You'll Learn:</strong></p>
<ul>
<li>Key concept #1</li>
<li>Key concept #2</li>
<li>Key concept #3</li>
</ul>

<p><strong>Who This Book Is For:</strong></p>
<p>This book is designed for [TARGET AUDIENCE] who want to [DESIRED OUTCOME].</p>

<h2>Chapter 1: The Foundation</h2>
<p>Before diving into the details, let's establish a solid foundation...</p>

<h3>Section 1.1: Getting Started</h3>
<p>[Replace with your content]</p>

<h3>Section 1.2: Core Principles</h3>
<p>[Replace with your content]</p>

<h3>Section 1.3: Setting the Right Mindset</h3>
<p>[Replace with your content]</p>

<p><strong>Key Takeaways:</strong></p>
<ul>
<li>Takeaway #1</li>
<li>Takeaway #2</li>
<li>Takeaway #3</li>
</ul>

<hr>

<h2>Chapter 2: Core Concepts</h2>
<p>Now that we've established the foundation, let's explore the core concepts...</p>

<h3>Section 2.1: Concept Overview</h3>
<p>[Replace with your content]</p>

<h3>Section 2.2: Deep Dive</h3>
<p>[Replace with your content]</p>

<h3>Section 2.3: Real-World Examples</h3>
<p>[Replace with your content]</p>

<hr>

<h2>Conclusion: Your Next Steps</h2>
<p>Congratulations on completing this journey! Here's what to do next:</p>

<ol>
<li><strong>Action Step 1:</strong> [Specific action]</li>
<li><strong>Action Step 2:</strong> [Specific action]</li>
<li><strong>Action Step 3:</strong> [Specific action]</li>
</ol>

<p>Remember, the key to success is [FINAL ADVICE].</p>

<h2>About the Author</h2>
<p><strong>[Your Name]</strong> is a [YOUR EXPERTISE] with [X] years of experience in [FIELD].</p>

<p>Connect with the author:</p>
<ul>
<li>Website: [URL]</li>
<li>Email: [EMAIL]</li>
<li>Social: [SOCIAL LINKS]</li>
</ul>`,
  },

  {
    id: 'course-outline',
    name: 'Online Course Structure',
    description: '5-module course with lessons and actionable exercises',
    type: 'course',
    icon: '🎓',
    gradient: 'from-purple-500 to-pink-500',
    estimatedTime: '3-6 weeks',
    difficulty: 'advanced',
    wordCount: 15000,
    features: ['5 Modules', '20 Lessons', 'Exercises', 'Bonus Resources'],
    outline: [
      'Course Welcome',
      'Module 1: Getting Started',
      'Module 2: Building Foundations',
      'Module 3: Intermediate Techniques',
      'Module 4: Advanced Strategies',
      'Module 5: Implementation & Launch',
      'Bonus: Resources & Tools',
    ],
    content: `<h1>[Course Name]</h1>
<p><em>Transform [OUTCOME] in [TIMEFRAME]</em></p>

<h2>Welcome to the Course!</h2>
<p>Welcome! I'm excited to guide you through this transformative journey...</p>

<p><strong>Course Structure:</strong></p>
<ul>
<li>5 Core Modules</li>
<li>20+ Video Lessons</li>
<li>Practical Exercises</li>
<li>Downloadable Resources</li>
</ul>

<h2>Module 1: Getting Started</h2>

<h3>Lesson 1.1: Course Overview</h3>
<p><strong>Duration:</strong> 10 minutes</p>
<p>In this lesson, you'll learn...</p>

<p><strong>Action Item:</strong> [Exercise]</p>

<h3>Lesson 1.2: Foundation Concepts</h3>
<p><strong>Duration:</strong> 15 minutes</p>
<p>[Lesson content]</p>

<hr>

<h2>Module 2: Building Foundations</h2>

<h3>Lesson 2.1: Core Principles</h3>
<p>[Content]</p>

<h3>Lesson 2.2: Practical Application</h3>
<p>[Content]</p>

<h3>Exercise: Put It Into Practice</h3>
<p><strong>Assignment:</strong> Complete the following:</p>
<ol>
<li>Step 1</li>
<li>Step 2</li>
<li>Step 3</li>
</ol>

<hr>

<h2>Bonus Resources</h2>
<ul>
<li>📄 Workbook PDF</li>
<li>🎨 Templates</li>
<li>📊 Checklists</li>
<li>🔗 Tool Recommendations</li>
</ul>`,
  },

  {
    id: 'howto-guide',
    name: 'How-To Guide Template',
    description: 'Step-by-step guide with actionable instructions',
    type: 'guide',
    icon: '📝',
    gradient: 'from-green-500 to-emerald-500',
    estimatedTime: '1-2 weeks',
    difficulty: 'beginner',
    wordCount: 5000,
    features: ['Step-by-Step', 'Screenshots', 'Tips & Tricks', 'FAQ'],
    outline: [
      'Introduction',
      'Prerequisites',
      'Step-by-Step Instructions',
      'Tips & Best Practices',
      'Troubleshooting',
      'Conclusion',
    ],
    content: `<h1>How to [ACHIEVE GOAL]: Complete Guide</h1>

<h2>Introduction</h2>
<p>This comprehensive guide will show you exactly how to [GOAL]. By the end, you'll be able to...</p>

<h2>What You'll Need</h2>
<p><strong>Prerequisites:</strong></p>
<ul>
<li>Requirement 1</li>
<li>Requirement 2</li>
<li>Requirement 3</li>
</ul>

<p><strong>Estimated Time:</strong> [TIME]</p>

<h2>Step 1: [First Step]</h2>
<p>Let's start by...</p>

<p><strong>Instructions:</strong></p>
<ol>
<li>First action</li>
<li>Second action</li>
<li>Third action</li>
</ol>

<p>💡 <strong>Pro Tip:</strong> [Helpful advice]</p>

<hr>

<h2>Step 2: [Second Step]</h2>
<p>Now that you've completed Step 1...</p>

<hr>

<h2>Step 3: [Third Step]</h2>
<p>Almost there! In this step...</p>

<hr>

<h2>Tips & Best Practices</h2>
<p>Here are some expert tips to get the most out of [PROCESS]:</p>

<ul>
<li><strong>Tip 1:</strong> [Advice]</li>
<li><strong>Tip 2:</strong> [Advice]</li>
<li><strong>Tip 3:</strong> [Advice]</li>
</ul>

<h2>Common Issues & Solutions</h2>

<h3>Problem: [Issue Description]</h3>
<p><strong>Solution:</strong> [Fix]</p>

<h3>Problem: [Issue Description]</h3>
<p><strong>Solution:</strong> [Fix]</p>

<h2>Conclusion</h2>
<p>Congratulations! You've successfully learned how to [GOAL]. Next steps:</p>
<ol>
<li>Practice what you've learned</li>
<li>Explore advanced techniques</li>
<li>Share your results</li>
</ol>`,
  },

  {
    id: 'whitepaper',
    name: 'Professional Whitepaper',
    description: 'Research-backed whitepaper for B2B audiences',
    type: 'whitepaper',
    icon: '📊',
    gradient: 'from-indigo-500 to-blue-500',
    estimatedTime: '2-3 weeks',
    difficulty: 'advanced',
    wordCount: 8000,
    features: ['Executive Summary', 'Data-Driven', 'Citations', 'Graphs'],
    outline: [
      'Executive Summary',
      'Introduction',
      'Problem Statement',
      'Market Analysis',
      'Solution Overview',
      'Case Studies',
      'Implementation',
      'Conclusion',
    ],
    content: `<h1>[Whitepaper Title]</h1>
<p><em>A Comprehensive Analysis of [TOPIC]</em></p>

<h2>Executive Summary</h2>
<p>This whitepaper examines [TOPIC] and provides actionable insights for [AUDIENCE].</p>

<p><strong>Key Findings:</strong></p>
<ul>
<li>Finding #1</li>
<li>Finding #2</li>
<li>Finding #3</li>
</ul>

<h2>Introduction</h2>
<p>In today's rapidly evolving [INDUSTRY], organizations face significant challenges...</p>

<h2>The Problem</h2>
<p><strong>Current State:</strong> [Description]</p>

<p><strong>Key Challenges:</strong></p>
<ol>
<li>Challenge 1</li>
<li>Challenge 2</li>
<li>Challenge 3</li>
</ol>

<h2>Market Analysis</h2>
<p>According to [SOURCE], the market for [TOPIC] is expected to grow...</p>

<p><strong>Market Statistics:</strong></p>
<ul>
<li>Statistic 1: [Data]</li>
<li>Statistic 2: [Data]</li>
<li>Statistic 3: [Data]</li>
</ul>

<h2>Proposed Solution</h2>
<p>Our research indicates that [SOLUTION] provides...</p>

<h2>Case Study: [Company Name]</h2>
<p><strong>Challenge:</strong> [Problem]</p>
<p><strong>Solution:</strong> [Approach]</p>
<p><strong>Results:</strong></p>
<ul>
<li>Result 1: [Metric]</li>
<li>Result 2: [Metric]</li>
<li>Result 3: [Metric]</li>
</ul>

<h2>Conclusion</h2>
<p>The evidence demonstrates that [CONCLUSION].</p>

<h2>References</h2>
<ol>
<li>[Citation 1]</li>
<li>[Citation 2]</li>
<li>[Citation 3]</li>
</ol>`,
  },

  {
    id: 'newsletter',
    name: 'Newsletter Series',
    description: '4-week newsletter series with engaging content',
    type: 'newsletter',
    icon: '📧',
    gradient: 'from-orange-500 to-red-500',
    estimatedTime: '1 week',
    difficulty: 'beginner',
    wordCount: 4000,
    features: ['4 Editions', 'Email-Ready', 'CTAs', 'Social Share'],
    outline: [
      'Week 1: Introduction',
      'Week 2: Deep Dive',
      'Week 3: Case Study',
      'Week 4: Action Plan',
    ],
    content: `<h1>[Newsletter Name] - Week 1</h1>

<p><strong>Subject:</strong> Welcome to [Newsletter Name]! 👋</p>

<h2>Hey [First Name],</h2>

<p>Welcome to the first edition of [Newsletter Name]! I'm thrilled to have you here.</p>

<p>Over the next 4 weeks, we'll explore [TOPIC] together. Each week, you'll get:</p>
<ul>
<li>✨ Actionable insights</li>
<li>📚 Curated resources</li>
<li>💡 Expert tips</li>
</ul>

<h3>This Week's Highlight</h3>
<p>[Main content goes here - 200-300 words]</p>

<h3>Quick Tip of the Week</h3>
<p>💡 [Tip description]</p>

<h3>Resource of the Week</h3>
<p>🔗 <a href="[URL]">[Resource Name]</a> - [Brief description]</p>

<hr>

<h2>Take Action</h2>
<p><strong>This Week's Challenge:</strong> [Specific action]</p>

<p>👉 <a href="[URL]"><strong>[CTA Button Text]</strong></a></p>

<hr>

<p>See you next week!</p>
<p><strong>[Your Name]</strong></p>

<p><em>P.S. [PS Message]</em></p>

<hr>

<h1>Week 2: [Topic]</h1>
<p>[Continue with Week 2 content...]</p>`,
  },
];

export const getTemplateById = (id: string) => {
  return PROJECT_TEMPLATES.find((t) => t.id === id);
};

export const getTemplatesByType = (type: ProjectTemplate['type']) => {
  return PROJECT_TEMPLATES.filter((t) => t.type === type);
};

export const getTemplatesByDifficulty = (difficulty: ProjectTemplate['difficulty']) => {
  return PROJECT_TEMPLATES.filter((t) => t.difficulty === difficulty);
};
