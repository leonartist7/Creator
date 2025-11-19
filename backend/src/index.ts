import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import aiRoutes from './routes/ai.routes';
import exportRoutes from './routes/export.routes';
import analyticsRoutes from './routes/analytics.routes';
import masterworkRoutes from './routes/masterwork.routes';
import aiStyleRoutes from './routes/ai-style.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from Vercel deployments and localhost
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
    ];

    // Allow all .vercel.app domains (for preview deployments)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/masterworks', masterworkRoutes);
app.use('/api/ai-studio', aiStyleRoutes);

// Error handling
app.use(errorHandler);

// Test Supabase connection and start server
const startServer = async () => {
  try {
    // Silently test Supabase connection if configured
    if (supabase) {
      await supabase.from('user_profiles').select('count').limit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
