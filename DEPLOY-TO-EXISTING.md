# 🚀 Deploy to Your Existing Vercel Project

Great! You already have a Vercel deployment. Let's update it with the new Knowledge Vault code.

## ✅ Code Already Pushed

Since we've pushed all code to `claude/check-speckit-folder-01Sv5t4hYde2udZysBckRwFx`, if your Vercel project is connected to this branch, it should be deploying automatically right now!

## 📋 Deployment Steps

### 1️⃣ Check Current Frontend Deployment

Visit: https://creator-frontend-pink.vercel.app

**Expected behavior:**
- If connected to this branch → New deployment should be in progress
- Check Vercel Dashboard → Deployments to see status

### 2️⃣ Set Up Backend Deployment (If Not Already Set Up)

You need a separate Vercel project for the backend.

**Via Vercel Dashboard (Recommended):**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your Git repository (same repo as frontend)
4. **Important Settings:**
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3️⃣ Configure Environment Variables

#### Frontend Environment Variables
Go to: Vercel Dashboard → creator-frontend → Settings → Environment Variables

Add these:
```bash
VITE_API_URL=https://your-backend-url.vercel.app
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

#### Backend Environment Variables
Go to: Vercel Dashboard → creator-backend → Settings → Environment Variables

Add these:
```bash
NODE_ENV=production
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>
REDIS_URL=<your-redis-url>
FRONTEND_URL=https://creator-frontend-pink.vercel.app
FILE_STORAGE_TYPE=supabase
MAX_FILE_SIZE=52428800
```

### 4️⃣ Set Up Redis (Required for Knowledge Vault)

The Knowledge Vault needs Redis for background jobs (text extraction, style analysis).

**Quick Setup with Upstash (Free Tier):**
1. Visit: https://upstash.com
2. Create account → New Database
3. Choose region (same as Vercel deployment region)
4. Copy **REST URL**
5. Add to backend environment variables as `REDIS_URL`

### 5️⃣ Set Up Supabase Database

Since you mentioned Supabase is already linked, run the migration:

1. Open Supabase Dashboard → SQL Editor
2. Open file: `supabase-setup.sql` from project root
3. Copy entire contents
4. Paste into SQL Editor
5. Click **Run**

This creates all Knowledge Vault tables:
- masterworks
- style_profiles
- text_chunks
- masterwork_uploads

### 6️⃣ Set Up Supabase Storage (For File Uploads)

1. Supabase Dashboard → Storage
2. Create new bucket: `masterworks`
3. Make it public or configure RLS policies
4. Already configured in env vars: `FILE_STORAGE_TYPE=supabase`

### 7️⃣ Update Branch Configuration

If your Vercel projects aren't deploying from the current branch:

**Via Vercel Dashboard:**
1. Go to Project Settings → Git
2. **Production Branch**: Set to `claude/check-speckit-folder-01Sv5t4hYde2udZysBckRwFx`
   - Or keep `main` and merge this branch to main
3. Save and redeploy

### 8️⃣ Trigger Deployment

If not auto-deploying:

**Option A: Via Vercel Dashboard**
- Go to Deployments → Click "Redeploy" on latest deployment

**Option B: Push a commit**
```bash
# Make a small change to trigger deployment
git commit --allow-empty -m "trigger deployment"
git push origin claude/check-speckit-folder-01Sv5t4hYde2udZysBckRwFx
```

## 🧪 Testing Checklist

Once both frontend and backend are deployed:

1. **Frontend**: https://creator-frontend-pink.vercel.app
   - [ ] Page loads
   - [ ] Can sign up / login
   - [ ] Upload form appears

2. **Backend**: https://your-backend-url.vercel.app/health
   - [ ] Returns `{"status": "ok"}`

3. **Knowledge Vault Features**:
   - [ ] Upload a masterwork (PDF, TXT, MD)
   - [ ] Check upload progress
   - [ ] Wait for extraction (background job via Redis)
   - [ ] Wait for style analysis (background job via Redis)
   - [ ] View Style DNA profile
   - [ ] Search across masterworks
   - [ ] AI Studio → Generate Prompt
   - [ ] AI Studio → Compare Styles
   - [ ] AI Studio → Blend Styles

## 🔍 Monitoring Deployment

**Frontend Deployment:**
- Dashboard: https://vercel.com/lionovart/creator-frontend
- Logs: Vercel Dashboard → Deployments → View Logs

**Backend Deployment:**
- Dashboard: Check your Vercel projects list
- Logs: Vercel Dashboard → Function Logs
- Health Check: https://your-backend-url.vercel.app/health

## ⚡ Quick Commands

### Check Vercel Deployment Status (after login)
```bash
vercel login
vercel ls
```

### Force Redeploy Frontend
```bash
cd frontend
vercel --prod
```

### Force Redeploy Backend
```bash
cd backend
vercel --prod
```

## 🐛 Common Issues

### "Frontend deploys but shows old code"
- Check which branch is configured as production branch
- Manually trigger redeploy from Vercel dashboard
- Clear build cache: Settings → General → Clear Build Cache

### "Backend functions timeout"
- Check Redis connection (REDIS_URL environment variable)
- Increase function timeout: Settings → Functions → Max Duration

### "Cannot upload files"
- Verify Supabase Storage bucket exists
- Check FILE_STORAGE_TYPE=supabase in environment
- Verify Supabase Storage permissions

### "Style analysis never completes"
- Check Redis is working (background jobs need queue)
- Check backend logs for errors
- Verify text extraction completed first

## 📊 What You Should See

**After Successful Deployment:**

1. **Frontend** (creator-frontend-pink.vercel.app):
   - Original app features PLUS
   - New "Knowledge Vault" section
   - New "AI Studio" section
   - Upload interface for masterworks
   - Search interface
   - Style DNA visualization

2. **Backend** (new Vercel project):
   - `/health` endpoint returns OK
   - `/api/masterworks/*` endpoints active
   - `/api/ai-studio/*` endpoints active

3. **Database** (Supabase):
   - 4 new tables visible in Table Editor
   - Ready to store masterworks

4. **Redis** (Upstash):
   - Connected to backend
   - Processing jobs in queue

## 🎯 Next Steps

1. **Now**: Check if frontend auto-deployed from git push
2. **Set up**: Backend Vercel project (if not exists)
3. **Configure**: Environment variables for both
4. **Run**: Supabase migration (supabase-setup.sql)
5. **Set up**: Redis on Upstash
6. **Test**: Upload a masterwork and verify full workflow

## 📚 Resources

- **Your Frontend**: https://creator-frontend-pink.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Upstash (Redis)**: https://upstash.com

---

**Status**: Code is pushed and ready. Vercel should auto-deploy if connected to this branch!

**Next**: Check Vercel dashboard for deployment status, then configure environment variables.
