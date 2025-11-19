# 🚀 Deployment Guide - Knowledge Vault to Vercel + Supabase

This guide walks you through deploying the Knowledge Vault application to production.

## 📋 Prerequisites

- Vercel account (connected to your GitHub repository)
- Supabase project already created and linked
- Redis instance (Upstash recommended for serverless)
- Environment variables ready

## 🗄️ Step 1: Set Up Supabase Database

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `supabase-setup.sql` from the project root
4. Paste into SQL Editor and click **Run**
5. Verify tables were created:
   - masterworks
   - style_profiles
   - text_chunks
   - masterwork_uploads

## 🔧 Step 2: Configure Environment Variables

### Backend Environment Variables (Vercel)

Add these in your Vercel project settings:

```bash
# Node Environment
NODE_ENV=production

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Redis (Required for Bull queues)
REDIS_URL=redis://default:password@host:port

# Frontend URL
FRONTEND_URL=https://your-frontend.vercel.app

# Knowledge Vault Configuration
FILE_STORAGE_TYPE=supabase
MAX_FILE_SIZE=52428800

# Optional: AI Services
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# Optional: Stripe
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

### Frontend Environment Variables (Vercel)

```bash
VITE_API_URL=https://your-backend.vercel.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📦 Step 3: Deploy Backend to Vercel

```bash
# Navigate to backend directory
cd backend

# Login to Vercel (if not already)
vercel login

# Deploy to production
vercel --prod
```

Follow the prompts:
- Link to existing project or create new one
- Set root directory to `backend`
- Override build command: `npm run build`
- Override output directory: `dist`

## 🎨 Step 4: Deploy Frontend to Vercel

```bash
# Navigate to frontend directory
cd ../frontend

# Deploy to production
vercel --prod
```

Follow the prompts:
- Link to existing project or create new one
- Set root directory to `frontend`
- Build command should auto-detect (Vite)

## 🔗 Step 5: Update URLs

After deployment:

1. Copy your backend URL from Vercel
2. Update frontend environment variables:
   - Go to Vercel dashboard → Frontend project → Settings → Environment Variables
   - Update `VITE_API_URL` with your backend URL
3. Copy your frontend URL
4. Update backend environment variables:
   - Go to Vercel dashboard → Backend project → Settings → Environment Variables
   - Update `FRONTEND_URL` with your frontend URL
5. Redeploy both projects for changes to take effect

## 🧪 Step 6: Test Deployment

1. Visit your frontend URL
2. Test the complete workflow:
   - ✅ Sign up / Login
   - ✅ Upload a masterwork (PDF, EPUB, DOCX, TXT, MD)
   - ✅ Wait for extraction to complete
   - ✅ Wait for style analysis to complete
   - ✅ View Style DNA profile
   - ✅ Search across masterworks
   - ✅ Generate AI style prompts
   - ✅ Compare two styles
   - ✅ Blend multiple styles

## 🔥 Important Notes

### Redis for Background Jobs

The Knowledge Vault uses **Bull** for background job processing (text extraction, style analysis). You MUST have Redis configured:

**Recommended: Upstash Redis (Serverless)**
1. Create account at https://upstash.com
2. Create Redis database
3. Copy the connection URL
4. Add to Vercel environment variables as `REDIS_URL`

### File Storage

By default, files are stored locally. For production, you have two options:

**Option A: Supabase Storage (Recommended)**
- Set `FILE_STORAGE_TYPE=supabase`
- Files stored in Supabase bucket
- Enable Supabase Storage in your project
- Create a bucket named `masterworks`
- Make it public or configure RLS policies

**Option B: AWS S3**
- Set `FILE_STORAGE_TYPE=s3`
- Add AWS credentials to environment variables
- Configure bucket and region

### Database Migrations

If you need to run migrations manually:

```bash
cd backend
npm run migrate
```

Or use Supabase SQL Editor for manual execution.

## 🐛 Troubleshooting

### "Redis connection failed"
- Verify REDIS_URL is set correctly
- Check Redis instance is accessible from Vercel
- Upstash is recommended for serverless environments

### "File upload fails"
- Check FILE_STORAGE_TYPE is configured
- Verify Supabase Storage bucket exists and has correct permissions
- Check MAX_FILE_SIZE environment variable

### "Style analysis stuck"
- Verify Redis is working (jobs need queue)
- Check backend logs in Vercel dashboard
- Ensure text extraction completed successfully

### "CORS errors"
- Verify FRONTEND_URL is set in backend environment
- Check backend CORS configuration allows your frontend domain
- Ensure frontend VITE_API_URL points to backend

## 📊 Monitoring

**Vercel Dashboard:**
- View deployment logs
- Monitor function executions
- Track errors and performance

**Supabase Dashboard:**
- Monitor database queries
- Check table row counts
- View storage usage

**Bull Board (Optional):**
- Add `@bull-board/express` for queue monitoring
- Mount at `/admin/queues` endpoint
- Protected by authentication

## 🎯 Next Steps

After successful deployment:

1. ✅ Set up custom domain (optional)
2. ✅ Configure SSL certificates (automatic with Vercel)
3. ✅ Enable analytics and monitoring
4. ✅ Set up error tracking (Sentry recommended)
5. ✅ Configure backup strategy for Supabase
6. ✅ Test with real masterwork documents
7. ✅ Monitor Redis queue performance

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)

---

**Need help?** Check the logs in Vercel dashboard or Supabase logs panel.
