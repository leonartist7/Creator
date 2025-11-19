# Getting Started with Digital Product Creator

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Creator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=sqlite://./database.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
```

Start the backend server:

```bash
npm run dev
```

The backend will run on http://localhost:3001

### 3. Frontend Setup

Open a new terminal and run:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on http://localhost:3000

### 4. Access the Application

1. Open your browser and go to http://localhost:3000
2. Click "Get Started" to create a new account
3. Fill in your email and password (minimum 8 characters)
4. You'll be redirected to the dashboard

## Key Features

### Creating Your First Project

1. From the dashboard, click "New Project"
2. Enter a project title
3. Select a project type (Ebook, Course, Guide, etc.)
4. Start writing in the rich text editor

### Using AI Tools

Click the "AI Tools" button to access:

- **Product Ideator**: Generate product ideas based on your niche
- **Outline Generator**: Create chapter outlines for your ebook
- **Content Expander**: Turn bullet points into full paragraphs
- **AI Writing Assistant**: Get help improving your content

### Saving Your Work

- Click the "Save" button in the top right
- Your project auto-saves periodically
- All projects are stored in your account

## Project Structure

```
Creator/
├── backend/          # Express API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Auth & error handling
│   └── package.json
│
├── frontend/         # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── stores/       # State management
│   │   └── utils/        # Helper functions
│   └── package.json
│
└── README.md
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Authentication
- POST `/api/auth/register` - Create new account
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh access token
- GET `/api/auth/me` - Get current user

### Projects
- GET `/api/projects` - List all projects
- POST `/api/projects` - Create new project
- GET `/api/projects/:id` - Get project details
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### AI Features
- POST `/api/ai/generate-ideas` - Generate product ideas
- POST `/api/ai/generate-outline` - Create chapter outline
- POST `/api/ai/expand-content` - Expand bullet points
- POST `/api/ai/improve-text` - Improve writing
- POST `/api/ai/generate-cover` - Generate cover image

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Ensure all environment variables are set in `.env`
- Try deleting `node_modules` and running `npm install` again

### Frontend won't start
- Check if port 3000 is available
- Ensure backend is running first
- Clear browser cache and try again

### Database errors
- Delete the `database.db` file and restart the backend
- The database will be recreated automatically

### OpenAI API errors
- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure you're using a valid model (gpt-4 or gpt-3.5-turbo)

## Next Steps

1. **Customize the design** - Edit Tailwind colors in `frontend/tailwind.config.js`
2. **Add more AI features** - Extend the AI service in `backend/src/services/openai.service.ts`
3. **Implement exports** - Add PDF/EPUB generation in export controller
4. **Add payment** - Integrate Stripe for subscriptions
5. **Deploy** - See DEPLOYMENT.md for deployment instructions

## Support

For issues and questions:
- Check the README.md
- Review the code comments
- Open an issue on GitHub

## License

MIT License - feel free to use this for your own projects!
