# AI Writing Studio - Setup Instructions

## 🚀 Complete Production Setup Guide

This guide will walk you through setting up the complete AI Writing Studio application with Supabase, OpenAI, and Anthropic Claude integration.

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn
- A Supabase account (https://supabase.com)
- OpenAI API key (https://platform.openai.com)
- Anthropic API key (https://console.anthropic.com)
- (Optional) Stripe account for payments

---

## 🔧 Step 1: Install Dependencies

```bash
# Install all required packages
npm install next react react-dom
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install openai @anthropic-ai/sdk
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react date-fns clsx tailwind-merge
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss autoprefixer postcss @tailwindcss/typography
```

**Or use the package.json provided:**

```bash
npm install
```

---

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create a Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Name your project (e.g., "AI Writing Studio")
4. Set a strong database password
5. Choose a region close to your users
6. Wait for the project to be created (~2 minutes)

### 2.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** to execute

This will create all necessary tables, indexes, RLS policies, and triggers.

### 2.3 Create Storage Bucket (Optional - for file uploads)

1. Go to **Storage** in Supabase dashboard
2. Click **"Create new bucket"**
3. Name: `reference-files`
4. Set to **Private**
5. Click **"Create bucket"**

---

## 🔑 Step 3: Configure Environment Variables

Your `.env.local` file has been created with your credentials. Verify it contains:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rztxxajwpcszbgsitnup.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**⚠️ IMPORTANT**: Never commit `.env.local` to version control!

---

## 🏗️ Step 4: Build and Run

### Development Mode

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
```

---

## 📱 Step 5: Test the Application

### 5.1 Create an Account

1. Navigate to `http://localhost:3000`
2. Click "Sign Up"
3. Enter email and password
4. Check your email for verification
5. Click the verification link

### 5.2 Create a Project

1. Go to `/templates`
2. Select a template (e.g., E-Book)
3. Fill in the form
4. Click "Create Project"

### 5.3 Generate Content

1. In the template editor, select a section
2. Click "Generate Content"
3. Wait for AI to generate (using your OpenAI/Anthropic key)
4. Edit, regenerate, or expand as needed

---

## 🎨 Available Templates

1. **E-Book** - Full-length books with chapters
2. **Online Course** - Structured courses with modules and lessons
3. **How-To Guide** - Step-by-step instructional content
4. **Story/Bestseller** - Creative fiction with file upload for style learning
5. **Social Media** - Platform-optimized posts
6. **Newsletter Series** - 4-part email campaigns
7. **Advertising** - High-converting ad copy

---

## 🔒 Security Checklist

- ✅ `.env.local` is in `.gitignore`
- ✅ RLS (Row Level Security) is enabled on all tables
- ✅ API keys are server-side only
- ✅ User authentication required for all actions
- ✅ File uploads are validated and scoped to user

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Verify `.env.local` exists and has correct values

### Issue: Database errors

**Solution**:
1. Check that you ran the schema.sql in Supabase
2. Verify RLS policies are created
3. Check Supabase logs in the dashboard

### Issue: AI generation fails

**Solution**:
1. Verify API keys are correct
2. Check API key has credits/quota
3. Check browser console for detailed errors
4. Verify API routes are accessible

### Issue: Authentication not working

**Solution**:
1. Check Supabase URL is correct
2. Verify email confirmation is enabled in Supabase
3. Check "Auth" → "URL Configuration" in Supabase
4. Set redirect URLs to match your app URL

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub (without `.env.local`)
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your repository
5. Add environment variables in Vercel dashboard
6. Deploy

### Update Supabase URLs

In Supabase → **Auth** → **URL Configuration**, add:

- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

---

## 📊 Database Schema Overview

### Main Tables

- **profiles** - User profiles (extends Supabase auth)
- **projects** - User projects with templates
- **project_sections** - Individual sections within projects
- **uploaded_files** - Reference files for style learning
- **ai_generations** - Log of all AI generations
- **subscriptions** - Stripe subscription data

### RLS Policies

All tables have Row Level Security enabled. Users can only access their own data.

---

## 🎯 Next Steps

### Add Payment Integration

1. Get Stripe API keys
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
3. Create Stripe products in dashboard
4. Implement subscription logic

### Customize Templates

1. Edit template configs in `src/config/templates/`
2. Add new templates following the guide in `TEMPLATE_ENGINE_README.md`
3. Restart dev server

### Add More AI Providers

1. Create new API routes in `src/app/api/ai/`
2. Update generator.ts to support new provider
3. Add provider selection UI

---

## 📚 Documentation

- **TEMPLATE_ENGINE_README.md** - Complete template system documentation
- **AI_WRITING_APP_README.md** - Original app features documentation
- **IMPLEMENTATION_GUIDE.md** - Step-by-step implementation guide

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review the comprehensive documentation
3. Check browser console for errors
4. Check Supabase logs in dashboard
5. Verify all environment variables are set

---

## 🎉 You're All Set!

Your AI Writing Studio is now ready for production use. Start creating amazing content with AI!

**Happy Writing!** ✍️
