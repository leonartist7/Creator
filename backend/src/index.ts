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
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Error handling
app.use(errorHandler);

// Test Supabase connection and start server
const startServer = async () => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);

    if (error) {
      console.warn('⚠️  Supabase connection warning:', error.message);
      console.log('💡 Make sure to run the SQL schema in your Supabase dashboard');
    } else {
      console.log('✅ Supabase connection established successfully');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Supabase URL: ${process.env.SUPABASE_URL}`);
      console.log(`🤖 Anthropic API: ${process.env.ANTHROPIC_API_KEY ? 'configured' : 'NOT configured'}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
