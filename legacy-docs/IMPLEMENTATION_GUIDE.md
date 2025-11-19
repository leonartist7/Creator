# AI Writing App - Implementation Guide

## 🚀 Quick Start (Copy & Paste Ready)

This guide will help you integrate the complete AI Writing Studio into your Next.js project.

## 📋 Prerequisites

- Next.js 14+ project (App Router)
- Tailwind CSS configured
- TypeScript enabled

## 🎯 Step-by-Step Setup

### Step 1: Install Dependencies

First, ensure you have all required dependencies:

```bash
npm install next react react-dom
npm install -D typescript @types/react @types/node tailwindcss autoprefixer postcss
npm install -D @tailwindcss/typography
```

### Step 2: Project Structure

Create the following folder structure in your Next.js project:

```
your-project/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── editor/
│   │       └── page.tsx
│   ├── components/
│   ├── contexts/
│   ├── config/
│   └── types/
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── postcss.config.js
```

### Step 3: Copy Configuration Files

#### 1. **tailwind.config.js**
```javascript
// Copy from AI_WRITING_APP_tailwind.config.js
```

#### 2. **tsconfig.json**
```json
// Copy from AI_WRITING_APP_tsconfig.json
```

#### 3. **next.config.js**
```javascript
// Copy from AI_WRITING_APP_next.config.js
```

#### 4. **postcss.config.js**
```javascript
// Copy from AI_WRITING_APP_postcss.config.js
```

### Step 4: Copy Type Definitions

Copy the entire contents of `src/types/index.ts` to your project:

```typescript
// src/types/index.ts
// [Copy all type definitions]
```

### Step 5: Copy Configuration

Copy `src/config/templates.ts`:

```typescript
// src/config/templates.ts
// [Copy all template configurations]
```

### Step 6: Copy Contexts

Copy all three context files:

```typescript
// src/contexts/ThemeContext.tsx
// src/contexts/TemplateContext.tsx
// src/contexts/ProjectContext.tsx
```

### Step 7: Copy Components

Copy all component files:

```typescript
// src/components/Providers.tsx
// src/components/Dashboard.tsx
// src/components/Editor.tsx
// src/components/AIActionsMenu.tsx
// src/components/RadialMenu.tsx
// src/components/AICompanionSidebar.tsx
// src/components/TemplateSidebar.tsx
// src/components/AdaptiveToolbar.tsx
// src/components/VoiceToText.tsx
```

### Step 8: Copy App Files

#### 1. **src/app/layout.tsx**
```typescript
// Copy from provided layout.tsx
```

#### 2. **src/app/page.tsx**
```typescript
// Copy from provided page.tsx
```

#### 3. **src/app/editor/page.tsx**
```typescript
// Copy from provided editor/page.tsx
```

#### 4. **src/app/globals.css**
```css
// Copy from provided globals.css
```

### Step 9: Update package.json

Add these scripts to your package.json:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Step 10: Run the Application

```bash
npm run dev
```

Visit http://localhost:3000

## 🎨 Customization Guide

### Adding Your Own Template

1. Open `src/config/templates.ts`
2. Add a new template configuration:

```typescript
mynewtemplate: {
  id: 'mynewtemplate',
  name: 'My New Template',
  description: 'Description of what this template does',
  icon: '🎨', // Any emoji
  color: 'blue', // Tailwind color name
  bgGradient: 'from-blue-50 to-cyan-50', // Light mode gradient
  sidebarTools: [
    {
      id: 'tool1',
      label: 'Tool Name',
      icon: '⚡',
      action: 'action_name'
    }
  ],
  aiSuggestions: [
    'Suggestion 1',
    'Suggestion 2'
  ]
}
```

### Customizing Theme Colors

Edit `src/contexts/ThemeContext.tsx` to change the theme colors:

```typescript
const textColor = theme === 'light' ? 'text-black' : 'text-white';
const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-900';
const cardBg = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800';
```

### Adding New AI Actions

Edit `src/components/AIActionsMenu.tsx`:

```typescript
const actions: ActionItem[] = [
  // Add your custom action
  { id: 'myaction', label: 'My Action', icon: '🎯', category: 'Generate' },
  // ... existing actions
];
```

## 🔌 Integrating Real AI

Currently, AI actions are simulated. To integrate real AI:

### Option 1: OpenAI Integration

1. Install the OpenAI SDK:
```bash
npm install openai
```

2. Create an API route:
```typescript
// src/app/api/ai-action/route.ts
import { OpenAI } from 'openai';

export async function POST(req: Request) {
  const { action, text } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a writing assistant. Perform the following action: ${action}`
      },
      {
        role: 'user',
        content: text
      }
    ],
  });

  return Response.json({
    result: response.choices[0].message.content
  });
}
```

3. Update `AIActionsMenu.tsx`:
```typescript
const handleAction = async (action: AIAction) => {
  const response = await fetch('/api/ai-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      text: selection.text
    })
  });

  const { result } = await response.json();

  // Replace selected text with AI result
  document.execCommand('insertText', false, result);

  onClose();
};
```

### Option 2: Anthropic Claude Integration

```bash
npm install @anthropic-ai/sdk
```

Similar approach as OpenAI, but using Claude's API.

### Option 3: Custom AI Backend

Create your own API endpoints that call your AI service:

```typescript
// Your custom integration
const handleAction = async (action: AIAction) => {
  const response = await fetch('https://your-ai-backend.com/api/process', {
    method: 'POST',
    body: JSON.stringify({ action, text: selection.text })
  });

  const result = await response.json();
  // Apply result
};
```

## 🎯 Feature Checklist

After implementation, verify these features work:

- [ ] Light/Dark theme toggle
- [ ] All text is black in light mode, white in dark mode
- [ ] Dashboard shows template cards
- [ ] Stats cards appear at bottom of dashboard
- [ ] Clicking template redirects to editor
- [ ] Template sidebar shows on left
- [ ] AI companion sidebar shows on right
- [ ] Text selection shows radial menu
- [ ] Right-click shows context menu with AI actions
- [ ] Zen mode toggle works
- [ ] Word count updates in real-time
- [ ] Adaptive toolbar changes by writing phase
- [ ] Voice-to-text button opens modal
- [ ] Template-specific tools appear in left sidebar
- [ ] Project intelligence scores display in right sidebar
- [ ] Completion percentage tracks progress
- [ ] Theme persists on page reload

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution**: Ensure all paths use the `@/` alias and tsconfig.json has:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

### Issue: Tailwind classes not working

**Solution**:
1. Check `tailwind.config.js` content paths
2. Ensure `globals.css` has Tailwind directives
3. Restart dev server

### Issue: Dark mode not applying

**Solution**:
1. Check `darkMode: 'class'` in `tailwind.config.js`
2. Verify ThemeProvider is wrapping the app
3. Check localStorage for saved theme

### Issue: Voice-to-text not working

**Solution**:
1. Use Chrome or Edge browser
2. Allow microphone permissions
3. Check browser console for errors

### Issue: Text selection menu not appearing

**Solution**:
1. Ensure Editor component is rendering
2. Check for JavaScript errors in console
3. Verify z-index values aren't conflicting

## 📚 Additional Resources

### Understanding the Architecture

**Data Flow:**
```
User Action → Component → Context → State Update → UI Re-render
```

**Theme Flow:**
```
ThemeProvider → ThemeContext → All Components (via useTheme hook)
```

**Template Flow:**
```
Dashboard (select) → TemplateContext → Editor (load template) → TemplateSidebar (show tools)
```

**Project Flow:**
```
createProject → ProjectContext → Editor (edit) → updateProjectContent → Metadata Calculation
```

### Best Practices

1. **Always use hooks to access context:**
   ```typescript
   const { theme } = useTheme();
   const { selectedTemplate } = useTemplate();
   const { currentProject } = useProject();
   ```

2. **Maintain theme consistency:**
   ```typescript
   className={`${textColor} ${bgColor} ${cardBg}`}
   ```

3. **Use TypeScript types:**
   ```typescript
   import { TemplateType, Project, AIAction } from '@/types';
   ```

4. **Keep components modular:**
   - Each component should handle one responsibility
   - Use composition over inheritance
   - Pass data via props, not global state when possible

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build for production:
```bash
npm run build
npm run start
```

Then deploy the `.next` folder to your hosting provider.

## 📈 Performance Tips

1. **Lazy load heavy components:**
```typescript
const VoiceToText = dynamic(() => import('@/components/VoiceToText'), {
  ssr: false
});
```

2. **Memoize expensive calculations:**
```typescript
const wordCount = useMemo(() =>
  content.split(/\s+/).filter(Boolean).length,
  [content]
);
```

3. **Debounce text updates:**
```typescript
const debouncedUpdate = useDebouncedCallback(
  (value) => updateProjectContent(value),
  500
);
```

## 🎓 Learning Path

1. **Start with**: Dashboard → understand template selection
2. **Then explore**: Editor → understand text editing
3. **Next**: ThemeContext → understand global state
4. **Advanced**: AI actions → understand action handling
5. **Expert**: Add your own features!

## 💡 Tips for Success

- Start with the provided code exactly as-is
- Test each feature individually
- Customize only after everything works
- Read the README for detailed feature explanations
- Use TypeScript's IntelliSense for guidance

---

**Need Help?** Check the AI_WRITING_APP_README.md for detailed feature documentation.

**Happy Coding!** 🎉
