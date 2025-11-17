# Digital Product Creator Platform

A comprehensive web application for creating and selling digital products (ebooks, courses, guides) with AI-powered features for content generation, design, and marketing.

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: SQLite (development) / PostgreSQL (production)
- **AI**: OpenAI API for content generation
- **Authentication**: JWT with bcrypt
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

- 🤖 AI Product Ideator - Generate product ideas with market validation
- ✍️ Ebook/Guide Creator - Rich text editor with AI writing assistant
- 🎓 Course Builder - Visual course creation with lessons and assessments
- 🎨 AI Cover Designer - Template library with AI image generation
- 📊 Analytics Dashboard - Track performance and sales
- 💰 Sales & Marketing Tools - Sales pages, email sequences, SEO optimization
- 📚 Content Database - Learn from uploaded content and replicate writing styles

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- SQLite3
- OpenAI API key (for AI features)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   ```bash
   # Backend .env
   cp backend/.env.example backend/.env
   # Edit backend/.env with your keys
   ```

5. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```

6. Start development servers:
   ```bash
   # Backend (from backend directory)
   npm run dev

   # Frontend (from frontend directory, in new terminal)
   npm start
   ```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:3001.

## Environment Variables

### Backend (.env)
```
PORT=3001
DATABASE_URL=sqlite://./database.db
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your_stripe_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_key
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## License

MIT

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
