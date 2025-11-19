# Vercel Deployment Guide

This guide will help you deploy your Digital Product Creator platform to Vercel.

## Deployment Strategy

**Frontend**: Vercel (optimal for React/Vite apps)
**Backend**: Vercel Serverless Functions (or Railway/Render for persistent server)
**Database**: Supabase (already cloud-hosted)

## Option 1: Frontend on Vercel + Backend on Vercel (Recommended for Serverless)

### Step 1: Deploy Backend to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   vercel
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add these environment variables:
     ```
     SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
     SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ANTHROPIC_API_KEY=sk-ant-api03-9Yu7zZegvUfTuE3VHU6HGGCz35Z4...
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

4. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

### Step 2: Deploy Frontend to Vercel

1. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

2. **Configure Environment Variables** in Vercel Dashboard:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   VITE_SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Redeploy**:
   ```bash
   vercel --prod
   ```

4. **Update Backend FRONTEND_URL**:
   - Go to backend project settings
   - Update `FRONTEND_URL` to your actual frontend URL
   - Redeploy backend

---

## Option 2: Frontend on Vercel + Backend on Render (Recommended for Long-Running Server)

### Why Render for Backend?
- Better for persistent connections
- No cold starts
- More suitable for Express servers
- Free tier available

### Step 1: Deploy Backend to Render

1. **Go to** [render.com](https://render.com)

2. **Create New Web Service**:
   - Connect your GitHub repository
   - Select the `backend` folder
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ANTHROPIC_API_KEY=sk-ant-api03-9Yu7zZegvUfTuE3VHU6HGGCz35Z4...
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Deploy** - Render will automatically deploy your backend

### Step 2: Deploy Frontend to Vercel

1. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Add Environment Variables** in Vercel:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Option 3: Both on Vercel via GitHub

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import Projects to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)

2. **Import Backend**:
   - Select your repository
   - Framework Preset: Other
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Add all environment variables

3. **Import Frontend**:
   - Import the same repository again
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Add environment variables

---

## Quick Deploy Script

Create a `deploy.sh` in the root:

```bash
#!/bin/bash

echo "🚀 Deploying Digital Product Creator..."

# Deploy Backend
echo "📦 Deploying Backend..."
cd backend
vercel --prod
BACKEND_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*')

# Deploy Frontend
echo "🎨 Deploying Frontend..."
cd ../frontend
vercel --prod

echo "✅ Deployment complete!"
echo "Backend: $BACKEND_URL"
echo "Don't forget to update environment variables in Vercel dashboard!"
```

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] All environment variables configured
- [ ] `FRONTEND_URL` in backend matches actual frontend URL
- [ ] `VITE_API_URL` in frontend matches actual backend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test AI features
- [ ] Test project creation
- [ ] Verify Supabase connection

---

## Environment Variables Reference

### Backend Required
```env
SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
ANTHROPIC_API_KEY=your-anthropic-key
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend Required
```env
VITE_API_URL=https://your-backend-url
VITE_SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Troubleshooting

### Backend Issues

**"Cannot find module"**
- Make sure `vercel.json` is properly configured
- Verify build command includes TypeScript compilation

**"Supabase connection failed"**
- Check environment variables are set correctly
- Verify Supabase credentials

**CORS errors**
- Ensure `FRONTEND_URL` is set correctly in backend
- Check CORS configuration in `backend/src/index.ts`

### Frontend Issues

**"API not found"**
- Verify `VITE_API_URL` points to correct backend
- Check backend is deployed and running

**Build fails**
- Run `npm run build` locally to test
- Check for TypeScript errors

---

## Monitoring & Logs

### Vercel
- View logs: `vercel logs [deployment-url]`
- Dashboard: vercel.com/dashboard
- Real-time logs available in dashboard

### Render
- Logs available in Render dashboard
- Auto-deploys on git push

---

## Cost Breakdown

### Free Tier (Recommended for MVP)
- **Vercel Frontend**: Free (100GB bandwidth, unlimited projects)
- **Render Backend**: Free (750 hours/month, spins down after inactivity)
- **Supabase**: Free (500MB database, 2GB file storage)
- **Anthropic API**: Pay per use (first $5 free for new users)

### Paid Tier (Production)
- **Vercel Pro**: $20/month (better performance, more bandwidth)
- **Render Starter**: $7/month (persistent server, no spin down)
- **Supabase Pro**: $25/month (8GB database, 100GB storage)

---

## Next Steps After Deployment

1. Set up custom domain
2. Enable HTTPS (automatic on Vercel/Render)
3. Configure email templates in Supabase
4. Set up monitoring (Sentry, LogRocket)
5. Enable database backups
6. Set up CI/CD for auto-deployment

---

## Support

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs

Happy deploying! 🚀
