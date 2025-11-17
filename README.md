# Digital Product Creator Platform

A comprehensive web application for creating and selling digital products (ebooks, courses, guides) with AI-powered features for content generation, design, and marketing.

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL with real-time features)
- **AI**: Anthropic Claude API for content generation
- **Authentication**: Supabase Auth
- **Payment**: Stripe integration

## Project Structure

```
digital-product-creator/
├── frontend/          # React TypeScript frontend
├── backend/           # Express API server
├── shared/            # Shared types and utilities
└── database/          # Database migrations and seeds
```

## Features

- 🤖 AI Product Ideator - Generate product ideas with market validation (powered by Claude)
- ✍️ Ebook/Guide Creator - Rich text editor with AI writing assistant
- 🎓 Course Builder - Visual course creation with lessons and assessments
- 🎨 AI Cover Designer - Template library with AI image generation
- 📊 Analytics Dashboard - Track performance and sales
- 💰 Sales & Marketing Tools - Sales pages, email sequences, SEO optimization
- 📚 Content Database - Learn from uploaded content and replicate writing styles

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Anthropic API key (for AI features)

### Installation

1. **Clone the repository**

2. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `backend/supabase-schema.sql` in your Supabase SQL Editor
   - Get your project URL and API keys from Settings → API

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

4. **Configure backend environment** (edit `backend/.env`):
   ```env
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

5. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

6. **Configure frontend environment** (edit `frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

7. **Start development servers:**
   ```bash
   # Backend (from backend directory)
   npm run dev

   # Frontend (from frontend directory, in new terminal)
   npm run dev
   ```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:3001.

## Detailed Setup Guide

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed Supabase configuration instructions.

See [GETTING_STARTED.md](./GETTING_STARTED.md) for a complete walkthrough of using the platform.

## Environment Variables

### Backend (.env)
```
PORT=3001
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Create new account (via Supabase Auth)
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh access token
- GET `/api/auth/me` - Get current user

### Projects
- GET `/api/projects` - List all projects
- POST `/api/projects` - Create new project
- GET `/api/projects/:id` - Get project details
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### AI Features (Powered by Claude)
- POST `/api/ai/generate-ideas` - Generate product ideas
- POST `/api/ai/generate-outline` - Create chapter outline
- POST `/api/ai/expand-content` - Expand bullet points
- POST `/api/ai/improve-text` - Improve writing
- POST `/api/ai/generate-titles` - Generate SEO-optimized titles
- POST `/api/ai/generate-sales-copy` - Create marketing copy

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code

## Database Schema

The platform uses Supabase (PostgreSQL) with the following tables:

- **user_profiles** - User profile data (extends Supabase Auth)
- **projects** - Digital product projects
- **ai_generations** - AI content generation history

All tables have Row Level Security (RLS) enabled for data protection.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Key Features

### Supabase Integration
- Real-time database updates
- Built-in authentication
- Row Level Security for data protection
- Automatic user profile creation
- File storage ready

### Anthropic Claude AI
- Advanced content generation
- Multiple writing styles
- Context-aware responses
- Token usage tracking
- High-quality output

## License

MIT

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Support

For issues and questions, please open an issue on GitHub.
